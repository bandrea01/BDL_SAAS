from functools import wraps
from flask import Flask, request, session, jsonify, send_file
from flask_cors import CORS
from flask import render_template
from flask import redirect, url_for
import dataGenerator
import time
from py_fiware import FiwareAPI
from py2arango import Py2Arango
import os

app = Flask(__name__)
app.secret_key = 'BDLaaS'
CORS(app)

arango = Py2Arango()
fiware = FiwareAPI()

fiware.setOrionIP("orion:1026")
fiware.setPerseoIP("perseo-fe:9090")


def login_required(f):
    """
    Metodo per la richiesta di login
    :param f:
    :return:
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        """
        Decorator design pattern
        """
        if 'user_id' not in session:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)

    return decorated_function


def update_entities(n, start_value, entity_id):
    """
    Metodo che aggiorna un'entità selezionata dall'utente
    @param n: Numero di dati da generare
    @param start_value: Valore di partenza da cui partire
    @param entity_id: Id dell'entità da aggiornare
    @return:
    """
    temperatures = dataGenerator.generate_temperature_values(n, 0.5, start_value, 0.05)
    res_update = 0

    for i in range(0, n):
        payload = {
            "numValue": {
                "type": "Property",
                "value": temperatures[i]
            },
            "@context": [
                "https://raw.githubusercontent.com/smart-data-models/dataModel.Device/master/context.jsonld"
            ]
        }
        res_update = fiware.update_entity(entity_id, payload)
        if res_update != 204:
            err_update = "Error in update data " + str(res_update)
            return jsonify("error: ", err_update)
        time.sleep(5)

    return jsonify(res_update)


@app.route('/mapping')
@login_required
def mapping():
    """
    Render template pagina di mapping
    @return: upload_arango.html
    """
    return render_template('upload_arango.html')


@app.route('/')
@login_required
def index():
    """
    Render template pagina di mapping
    @return: login.html
    """
    return render_template("login.html")


@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    Pagina di login per accedere al menù delle operazioni
    @return: La pagina HTML relativa a seconda dei parametri
    """
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username == os.getenv('DEBUG_USR') and password == os.getenv('DEBUG_PWD'):
            session['user_id'] = username
            return redirect(url_for('menu'))
        else:
            return redirect(url_for("login"))
    return render_template('login.html')


@app.route('/menu', methods=['GET', 'POST'])
@login_required
def menu():
    """
    Render template pagina di menù
    @return: menu.html
    """
    return render_template("menu.html")


@app.route('/viewer', methods=['GET', 'POST'])
@login_required
def viewer():
    """
    Redirect alla pagina dedicata al viewer
    @return: Redirect alla pagina dedicata
    """
    host_ip_address = request.host.split(':')[0]
    viewer_url = f"http://{host_ip_address}:5173"

    return redirect(viewer_url)


@app.route('/mapping', methods=['GET', 'POST'])
@login_required
def upload_file():
    """
    Mapping file IFC
    @return: Redirect alla pagina di menù
    """
    uploaded_file = request.files['file']
    file_path = '/app/src/ifc/' + uploaded_file.filename
    uploaded_file.save(file_path)

    arango.init_graph(file_path)

    # TODO EVENTUALMENTE CERCARE DI FARE LA CREAZIONE SU ORION DELLE ENTITA' BUILDING TYPE ESTRAENDO GEOMETRIA
    return redirect(url_for('menu'))


@app.route('/monitoring', methods=['GET', 'POST'])
@login_required
def monitoring():
    """
    Render template della pagina grafana_dashboard.html
    @return: grafana_dashboard.html
    """
    return render_template("grafana_dashboard.html")


@app.route('/generation', methods=['GET', 'POST'])
@login_required
def generation():
    """
    Metodo che avvia la generazione dei dati del sensore ed effettua le sottoscrizioni a ORION-LD
    @return: Valore di ritorno per indicare se l'operazione è andata a buon fine o meno (200 o 404)
    """
    data = request.json
    mail = data.get("mail")
    threshold = data.get("threshold")
    dataAmount = data.get("dataAmount")
    sensor_id = data.get("sensorId")

    entity_id = f"urn:ngsi-ld:MEASUREMENT:id:{sensor_id}"

    # TODO IN TEORIA DOVREBBE ESSERE FATTO SUL CREATE SENSOR PER FARLO UNA SOLA VOLTA
    res_subscription = fiware.init_quantumleap_subscription(
        "Quantumleap Sensor Subscription",
        "DeviceMeasurement",
        "normalized",
        "http://quantumleap:8668/v2/notify"
    )

    if res_subscription != 201:
        err = "Error in doing subscription: " + str(res_subscription)
        return render_template("error.html", message=err)

    res_subscription = fiware.init_perseo_subscription(
        "Perseo Sensor Subscription",
        "DeviceMeasurement",
        "normalized",
        "http://perseo-fe:9090/notices"
    )

    if res_subscription != 201:
        err = "Error in doing subscription: " + str(res_subscription)
        return render_template("error.html", message=err)

    res_rule = fiware.init_rule_mail(
        f"{sensor_id}_rule_mail",
        f"SELECT *, numValue? AS value FROM iotEvent WHERE (CAST(CAST(numValue?,String), DOUBLE) >= {threshold} AND id = '{entity_id}')",
        "WARNING! " + sensor_id + " threshold level exceeded. Value: ${value}",
        mail,
        f"{sensor_id} Notify"
    )

    if res_rule != 200:
        err = "Error in rule creation: " + str(res_rule)
        return render_template("error.html", message=err)

    res = update_entities(dataAmount, 20.0, entity_id)

    return res


@app.route('/api/create/sensor', methods=['POST'])
def create_sensor():
    """
    Metodo per creare un sensore, inserirlo in ORION-LD e ArangoDB
    @return: Viene ritornato il valore 200 se tutto è andato a buon fine
    """
    data = request.json

    sceneModelName = data.get("sceneModelName")
    componentID = data.get("componentID")
    brandName = data.get("brandName")
    manufacturerName = data.get("manufacturerName")
    modelName = data.get("modelName")
    name = data.get("name")
    description = data.get("description")
    controlledProperty = data.get("controlledProperty")
    measurementType = data.get("measurementType")
    coordinateX = data.get("coordinateX")
    coordinateY = data.get("coordinateY")
    coordinateZ = data.get("coordinateZ")

    res_device_model = fiware.init_device_model(
        sceneModelName,
        componentID.split("-")[-1],
        brandName,
        controlledProperty,
        manufacturerName,
        modelName,
        name
    )

    if res_device_model != 201 and res_device_model != 200:
        err = "Error in init Orion device model: " + str(res_device_model)
        return render_template("error.html", message=err)

    res_device_measurement = fiware.init_device_measurement(
        sceneModelName,
        componentID.split("-")[-1],
        controlledProperty,
        description,
        coordinateX,
        coordinateY,
        coordinateZ,
        measurementType,
        name,
        25.0
    )

    if res_device_measurement != 201 and res_device_measurement != 200:
        err = "Error in init Orion device measurement: " + str(res_device_measurement)
        return render_template("error.html", message=err)

    sceneModelName = sceneModelName.split(".")[0]

    arango.insertSensor(
        f"{sceneModelName}_nodes",
        f"{sceneModelName}_edges",
        componentID,
        brandName,
        controlledProperty,
        manufacturerName,
        modelName,
        name,
        description,
        [coordinateX, coordinateY, coordinateZ]
    )

    return jsonify("done"), 200


@app.route("/api/orion/sensors", methods=["GET"])
def getOrionSensors():
    """
    Metodo che restituisce la lista dei sensori creati su ORION-LD
    @return: La lista in formato JSON dei sensori creati
    """
    entities = fiware.get_entity_from_type("https://smartdatamodels.org/dataModel.Device/DeviceMeasurement")
    ids = []
    for entity in entities:
        ids.append(entity["id"].split(":")[4])
    return jsonify(ids)


@app.route("/api/export/ifc", methods=["GET"])
def export_ifc_model():
    """
    Metodo che esporta un grafo su ArangoDB in file IFC
    @return: Il file IFC
    """
    model_name = request.args.get('model_name')
    if not model_name:
        return "Model name is required", 400

    # Remove the file extension
    model_name = model_name.rsplit('.', 1)[0]

    output_file_path = ""

    try:
        output_file_path = arango.export_ifc(model_name)

        return send_file(output_file_path, as_attachment=True)
    finally:
        if os.path.exists(output_file_path):
            os.remove(output_file_path)


"""-------------------    AQL    ---------------------"""


@app.route("/api/find/all/nodes", methods=["GET"])
def get_all_nodes():
    """
    Metodo che ritorna tutti i nodi all'interno di una collezione di nodi
    @return: La lista in formato JSON dei nodi della collezione
    """
    nodes_collection = request.args.get('nodes_collection')

    if not all([nodes_collection]):
        return jsonify({'error': 'Missing required query parameters'}), 400

    query = f"""
            FOR i IN {nodes_collection}
            LET cleanedNode = UNSET(i, "_id", "_rev")
            RETURN cleanedNode
        """
    cursor = arango.db.aql.execute(query)
    nodes_list = list(cursor)

    if not nodes_list:
        return jsonify({'error': 'Nodi non trovati'}), 404

    return jsonify(nodes_list)


@app.route("/api/find/all/edges", methods=["GET"])
def get_all_edges():
    """
    Metodo che ritorna tutti gli edge all'interno di una collezione di edge
    @return: La lista in formato JSON degli edge della collezione
    """
    edges_collection = request.args.get('edges_collection')

    if not all([edges_collection]):
        return jsonify({'error': 'Missing required query parameters'}), 400

    query = f"""
            FOR i IN {edges_collection}
            LET cleanedNode = UNSET(i, "_key", "_id", "_rev")
            RETURN cleanedNode
            """
    cursor = arango.db.aql.execute(query)
    edges_list = list(cursor)

    if not edges_list:
        return jsonify({'error': 'Edge non trovati'}), 404

    return jsonify(edges_list)


@app.route("/api/find/node/key", methods=["GET"])
def get_node_by_key():
    """
    Metodo che ritorna un nodo in base alla sua _key
    @return: Le informazioni relative al nodo in formato JSON
    """
    nodes_collection = request.args.get('nodes_collection')
    key = request.args.get('key')

    if not all([nodes_collection, key]):
        return jsonify({'error': 'Missing required query parameters'}), 400

    nodes = arango.db[nodes_collection]
    filter_key = {'_key': key}
    cursor = nodes.find(filter_key)
    nodes_list = list(cursor)

    if not nodes_list:
        return jsonify({'error': 'Nodo non trovato'}), 404

    return jsonify(nodes_list)


@app.route("/api/find/node/id", methods=["GET"])
def get_node_by_id():
    """
    Metodo che ritorna un nodo in base al suo _id
    @return: Le informazioni relative al nodo in formato JSON
    """
    nodes_collection = request.args.get('nodes_collection')
    id = request.args.get('id')

    if not all([nodes_collection, id]):
        return jsonify({'error': 'Missing required query parameters'}), 400

    query = f"""
        FOR i IN {nodes_collection}
        FILTER i._key LIKE 'Ifc%-{id}'
        LET cleanedNode = UNSET(i, "_id", "_rev")
        RETURN cleanedNode
    """
    cursor = arango.db.aql.execute(query)
    results = list(cursor)

    if not results:
        return jsonify({'error': 'Nodo non trovato'}), 404

    return jsonify(results)


@app.route("/api/find/nodes/name", methods=["GET"])
def get_nodes_by_name():
    """
    Metodo che ritorna un nodo in base al suo name
    @return: Le informazioni relative al nodo in formato JSON
    """
    nodes_collection = request.args.get('nodes_collection')
    name = request.args.get('name')

    if not all([nodes_collection, name]):
        return jsonify({'error': 'Missing required query parameters'}), 400

    nodes = arango.db[nodes_collection]
    filter_name = {'name': name}
    cursor = nodes.find(filter_name)
    nodes_list = list(cursor)

    if not nodes_list:
        return jsonify({'error': 'Nodo/i non trovato/i'}), 404

    return jsonify(nodes_list)


@app.route("/api/traversal", methods=["GET"])
def traversal():
    """
    Metodo che ritorna le informazioni di un nodo
    @return: Il risultato del traversal in formato JSON
    """
    graph_name = request.args.get('graph_name')
    start_vertex_collection = request.args.get('start_vertex_collection')
    start_vertex_key = request.args.get('start_vertex_key')
    direction = request.args.get('direction')
    min_depth = int(request.args.get('min_depth'))
    max_depth = int(request.args.get('max_depth'))

    if not all([graph_name, start_vertex_collection, direction]):
        return jsonify({'error': 'Missing required query parameters'}), 400

    graph = arango.db.graph(graph_name)
    start_vertex = f"{start_vertex_collection}/{start_vertex_key}"

    travers = graph.traverse(
        start_vertex=start_vertex,
        direction=direction,
        min_depth=min_depth,
        max_depth=max_depth
    )

    if not travers:
        return jsonify({'error': 'Traversal error'}), 404

    return jsonify(travers)


@app.route("/api/traversal/name", methods=["GET"])
def traversal_by_name():
    """
    Metodo che ritorna le informazioni di tutti i nodi di un determinato tipo di nodo
    @return: Il risultato del traversal in formato JSON
    """
    graph_name = request.args.get('graph_name')
    start_vertex_collection = request.args.get('start_vertex_collection')
    vertex_type = request.args.get('vertex_type')
    direction = request.args.get('direction')
    min_depth = int(request.args.get('min_depth'))
    max_depth = int(request.args.get('max_depth'))

    if not all([graph_name, start_vertex_collection, vertex_type, direction]):
        return jsonify({'error': 'Missing required query parameters'}), 400

    query = f"""
            FOR node IN {start_vertex_collection}
                FILTER node.name == "{vertex_type}"
                FOR v, e, p IN {min_depth}..{max_depth} {direction} node GRAPH "{graph_name}"
                LET cleanedNode = UNSET(v, "_id", "_rev")
                RETURN cleanedNode
            """
    cursor = arango.db.aql.execute(query)
    results = list(cursor)

    if not results:
        return jsonify({'error': 'Traversal error'}), 404

    return jsonify(results)


@app.route("/api/node/find/sensors", methods=["GET"])
def sensors_by_node():
    """
    Metodo che ritorna le informazioni di tutti i nodi di un determinato tipo di nodo
    @return: Il risultato del traversal in formato JSON
    """
    graph_name = request.args.get('graph_name')
    start_vertex_collection = request.args.get('start_vertex_collection')
    vertex_key = request.args.get('vertex_key')
    direction = request.args.get('direction')

    if not all([graph_name, start_vertex_collection, vertex_key, direction]):
        return jsonify({'error': 'Missing required query parameters'}), 400

    query = f"""
            FOR node IN {start_vertex_collection}
            FILTER node._key == "{vertex_key}"
            LET relatedNodes = (
                FOR v, e, p IN {direction} node GRAPH {graph_name}
                    FILTER v._key LIKE '%Sensor%'
                LET cleanedNode = UNSET(v, "_id", "_rev")
                RETURN {{node: cleanedNode}}
            )
    
            LET cleanedNode = UNSET(node, "_id", "_rev")
    
            RETURN {{
                node: cleanedNode,
                relatedNodes: relatedNodes
            }}
            """

    cursor = arango.db.aql.execute(query)
    results = list(cursor)

    if not results:
        return jsonify({'error': 'Traversal error'}), 404

    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)
