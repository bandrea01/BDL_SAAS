from functools import wraps

from flask import Flask, request, jsonify, session
from flask import render_template
from flask import redirect, url_for
from py_orion import OrionAPI

import os  # Per prendere le variabili di ambiente definite dal file docker

app = Flask(__name__)
app.secret_key = 'cristian'
orion = OrionAPI()


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


def init_orion():
    orion.setOrionIP("orion:1026")
    payload = {
        "id": "urn:ngsi-ld:TemperatureSensor:001",
        "type": "TemperatureSensor",
        "category": {
            "type": "Property",
            "value": "sensor"
        },
        "temperature": {
            "type": "Property",
            "value": 25
        }
    }
    res = orion.insert_entity(payload)
    return res


def init_subscriptions():
    # Quantumleap
    payload = {
        "description": "Subscription for temperature updates",
        "type": "Subscription",
        "entities": [
            {
                "type": "TemperatureSensor"
            }
        ],
        "notification": {
            "endpoint": {
                "uri": "http://quantumleap:8668/v2/notify",
                "accept": "application/json"
            }
        }
    }
    res = orion.subscribe(payload)
    return res
    # Perseo
    # orion.subscribe(.....)


@app.route('/main_page')
@login_required
def main_page():
    return render_template('main_page.html')


#   DEBUG ADMIN  #

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

        # Sostituire con il controllo delle credenziali reali
        if username == os.getenv('DEBUG_USR') and password == os.getenv('DEBUG_PWD'):
            # if username == "admin" and password == "restapi":
            session['user_id'] = username  # Salva l'ID utente nella sessione
            return redirect(url_for('main_page'))  # Reindirizzare alla pagina principale dopo il login
        else:
            return redirect(url_for("login"))

    return render_template('login.html')


@app.route('/upload', methods=['GET', 'POST'])
@login_required
def upload_file():
    # Salva il file caricato e ottieni il percorso
    uploaded_file = request.files['file']
    file_path = '/src/ifc/' + uploaded_file.filename
    uploaded_file.save(file_path)

    # Esegui lo script py2arango con il percorso del file come argomento
    # os.system('python /src/py2arango.py ' + file_path)
    res_init = init_orion()
    if res_init != 201:
        err = "Error in init Orion: " + str(res_init)
        return render_template("error.html", message=err)
    res_subscription = init_subscriptions()
    if res_subscription != 201:
        err = "Error in init Orion: " + str(res_subscription)
        return render_template("error.html", message=err)

    return render_template("upload_complete.html")


if __name__ == '__main__':
    app.run(debug=True)
