from functools import wraps
from flask import Flask, request, session, jsonify
from flask_cors import CORS
from flask import render_template
from flask import redirect, url_for
import dataGenerator
import time
from py_fiware import FiwareAPI
from py2arango import Py2Arango

import os

app = Flask(__name__)
app.secret_key = 'cristian'
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
    temperatures = dataGenerator.generate_temperature_values(n, 0.5, start_value, 0.05)

    for i in range(0, n):
        payload = {
            "https://smartdatamodels.org/dataModel.Device/numValue": {
                "type": "Property",
                "value": temperatures[i]
            }
        }
        # TODO CAMBIARE ENTITY_ID PASSANDOLO DINAMICAMENTE COME PARAMETRO PER FUNZIONE E DA FRONT-END
        res_update = fiware.update_entity(entity_id, payload)
        if res_update != 204:
            err_update = "Error in update data " + str(res_update)
            return render_template("error.html", msg=err_update)
        time.sleep(5)


@app.route('/mapping')
@login_required
def main_page():
    return render_template('upload_arango.html')


@app.route('/')
@login_required
def index():
    return render_template("login.html")


@app.route('/login', methods=['GET', 'POST'])
def login():
    """
        Pagina di login per accedere alle risorse del satabase
    """
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username == os.getenv('DEBUG_USR') and password == os.getenv('DEBUG_PWD'):
            # if username == "admin" and password == "restapi":
            session['user_id'] = username
            return redirect(url_for('menu'))
        else:
            return redirect(url_for("login"))
    return render_template('login.html')


@app.route('/menu', methods=['GET', 'POST'])
@login_required
def menu():
    return render_template("menu.html")


@app.route('/mapping', methods=['GET', 'POST'])
@login_required
def upload_file():
    uploaded_file = request.files['file']
    file_path = '/app/src/ifc/' + uploaded_file.filename
    uploaded_file.save(file_path)
    # os.system('python /app/src/py2arango.py ' + file_path)

    arango.init_graph(file_path)

    # TODO EVENTUALMENTE CERCARE DI FARE LA CREAZIONE SU ORION DELLE ENTITA' BUILDING TYPE ESTRAENDO GEOMETRIA
    return redirect(url_for('menu'))


@app.route('/monitoring', methods=['GET', 'POST'])
@login_required
def monitoring():
    return render_template("grafana_dashboard.html")


@app.route('/generation', methods=['GET', 'POST'])
@login_required
def generation():
    data = request.json
    mail = data.get("mail")
    threshold = data.get("threshold")
    dataAmount = data.get("dataAmount")
    entity_id = data.get("entityId")
    # TODO PRENDERE ENTITY ID DAL FORM

    # sensor_type = "TemperatureSensor"
    # res_entity = fiware.init_entites(sensor_type, 20.0)
    # if res_entity != 201 and res_entity != 200:
    #     err = "Error in init Orion: " + str(res_entity)
    #     return render_template("error.html", message=err)

    # res_device_model = fiware.init_device_model("Temperature", "200", "", "temperature", "", "", "Temperature sensor")
    # if res_device_model != 201 and res_device_model != 200:
    #     err = "Error in init Orion: " + str(res_device_model)
    #     return render_template("error.html", message=err)
    #
    # res_device_measurement = fiware.init_device_measurement("Temperature", "200", "temperature", "Temperature measure",
    #                                                         2, 0, 1, "Temperature", "Temperature measurement", 25.0)
    # if res_device_measurement != 201 and res_device_measurement != 200:
    #     err = "Error in init Orion: " + str(res_device_measurement)
    #     return render_template("error.html", message=err)

    # res_subscription = fiware.init_subscriptions("Quantumleap subscription",
    #                                              sensor_type,
    #                                              "normalized",
    #                                              "http://quantumleap:8668/v2/notify")
    # if res_subscription != 201:
    #     err = "Error in doing subscription: " + str(res_subscription)
    #     return render_template("error.html", message=err)

    # res_subscription = fiware.init_subscriptions("Perseo-FE subscription",
    #                                              sensor_type,
    #                                              "normalized",
    #                                              "http://perseo-fe:9090/notices")
    # if res_subscription != 201:
    #     err = "Error in doing subscription: " + str(res_subscription)
    #     return render_template("error.html", message=err)

    # res_rule = fiware.init_rules_mail("temperature_rule_mail",
    #                                   f"SELECT *, temperature? AS temperature FROM iotEvent WHERE (CAST(CAST(temperature?,String), DOUBLE)>={threshold} AND type='TemperatureSensor')",
    #                                   "WARNING! Possible fire in progress/Temperature sensor malfunction... Detected temperature: ${temperature}°C",
    #                                   mail, "Temperature Notify")
    #
    # if res_rule != 200:
    #     err = "Error in rule creation: " + str(res_rule)
    #     return render_template("error.html", message=err)

    # TODO SISTEMARE IL TIPO DI ENTITA' DA AGGIORNARE
    # update_entities(dataAmount, 20.0, entity_id)
    update_entities(dataAmount, 20.0, f"urn:ngsi-ld:MEASUREMENT:id:Sensor{type}-{id}")


@app.route('/create_sensor', methods=['GET', 'POST'])
def create_sensor():
    data = request.json
    sceneModelName = data.get("sceneModelName")
    componentID = data.get("componentID")
    sensorType = data.get("sensorType")
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

    res_device_model = fiware.init_device_model(sensorType, componentID.split("-")[-1], brandName, controlledProperty,
                                                manufacturerName, modelName, name)
    if res_device_model != 201 and res_device_model != 200:
        err = "Error in init Orion: " + str(res_device_model)
        return render_template("error.html", message=err)

    res_device_measurement = fiware.init_device_measurement(sensorType, componentID.split("-")[-1], controlledProperty,
                                                            description,
                                                            coordinateX, coordinateY, coordinateZ, measurementType,
                                                            name, 25.0)
    if res_device_measurement != 201 and res_device_measurement != 200:
        err = "Error in init Orion: " + str(res_device_measurement)
        return render_template("error.html", message=err)

    arango.insertSensor(f"{sceneModelName}_nodes", f"{sceneModelName}_edges", componentID, sensorType, brandName,
                        controlledProperty, manufacturerName, modelName, name)


"""-------------------    AQL    ---------------------"""


@app.route("/get_all_nodes/<string:nodes_name>", methods=["GET"])
def get_all_nodes(nodes_name):
    nodes = arango.db[nodes_name]

    cursor = nodes.all()

    # Convertire il cursore in una lista
    nodes_list = list(cursor)

    if not nodes_list:
        # Se non ci sono nodi trovati, restituisci un messaggio di errore
        return jsonify({'error': 'Nodi non trovati'}), 404

    # Restituisci i dati JSON
    return jsonify(nodes_list)


@app.route("/get_all_edges/<string:edges_name>", methods=["GET"])
def get_all_edges(edges_name):
    edges = arango.db[edges_name]

    cursor = edges.all()

    nodes_list = list(cursor)

    if not nodes_list:
        # Se non ci sono nodi trovati, restituisci un messaggio di errore
        return jsonify({'error': 'Edge non trovati'}), 404

    # Restituisci i dati JSON
    return jsonify(nodes_list)


@app.route("/get_node_by_key/<string:nodes_name>/<string:key>", methods=["GET"])
def get_node_by_key(nodes_name, key):
    nodes = arango.db[nodes_name]

    # Definire il criterio di ricerca
    filter_key = {'_key': key}

    # Ottenere il nodo dalla collezione utilizzando il metodo find() con limit=1
    cursor = nodes.find(filter_key)

    nodes_list = list(cursor)

    if not nodes_list:
        # Se non ci sono nodi trovati, restituisci un messaggio di errore
        return jsonify({'error': 'Nodo non trovato'}), 404

    # Restituisci i dati JSON
    return jsonify(nodes_list)


@app.route("/get_node_by_id/<string:nodes_name>/<string:id>", methods=["GET"])
def get_node_by_id(nodes_name, id):
    query = f"""
        FOR i IN {nodes_name}
        FILTER i._key LIKE '%-{id}'
        RETURN i
    """

    # Esegui la query e ottieni i risultati
    cursor = arango.db.aql.execute(query)
    results = list(cursor)

    if not results:
        # Se non ci sono nodi trovati, restituisci un messaggio di errore
        return jsonify({'error': 'Nodo non trovato'}), 404

    # Restituisci i dati JSON
    return jsonify(results)


@app.route("/get_nodes_by_name/<string:nodes_name>/<string:name>", methods=["GET"])
def get_nodes_by_name(nodes_name, name):
    nodes = arango.db[nodes_name]

    # Definire il criterio di ricerca
    filter_name = {'name': name}

    # Ottenere il nodo dalla collezione utilizzando il metodo find() con limit=1
    cursor = nodes.find(filter_name)

    nodes_list = list(cursor)

    if not nodes_list:
        # Se non ci sono nodi trovati, restituisci un messaggio di errore
        return jsonify({'error': 'Nodo/i non trovato/i'}), 404

    # Restituisci i dati JSON
    return jsonify(nodes_list)


@app.route(
    "/traversal/<string:graph_name>/<string:start_vertex_collection>/<string:start_vertex_key>/<string:direction>/<int:min_depth>/<int:max_depth>",
    methods=["GET"])
def traversal(graph_name, start_vertex_collection, start_vertex_key, direction, min_depth, max_depth):
    graph = arango.db.graph(graph_name)
    start_vertex = f"{start_vertex_collection}/{start_vertex_key}"

    travers = graph.traverse(
        start_vertex=start_vertex,
        direction=direction,
        min_depth=min_depth,
        max_depth=max_depth
    )

    if not travers:
        # Se non ci sono nodi trovati, restituisci un messaggio di errore
        return jsonify({'error': 'Traversal error'}), 404

    # Restituisci i dati JSON
    return jsonify(travers)


@app.route(
    "/traversal_by_name/<string:graph_name>/<string:start_vertex_collection>/<string:vertex_type>/<string:direction>/<int:min_depth>/<int:max_depth>",
    methods=["GET"])
def traversal_by_name(graph_name, start_vertex_collection, vertex_type, direction, min_depth, max_depth):
    # graph = arango.db.graph(graph_name)
    query = f"""
            FOR node IN {start_vertex_collection}
                FILTER node.name == "{vertex_type}"
                FOR v, e, p IN {min_depth}..{max_depth} {direction} 
                node GRAPH "{graph_name}"
                RETURN p
            """

    # Esegui la query e ottieni i risultati
    cursor = arango.db.aql.execute(query)
    results = list(cursor)

    if not results:
        # Se non ci sono nodi trovati, restituisci un messaggio di errore
        return jsonify({'error': 'Traversal error'}), 404

    # Restituisci i dati JSON
    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)
