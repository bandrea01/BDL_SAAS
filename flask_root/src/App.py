from functools import wraps
from flask import Flask, request, session
from flask import render_template
from flask import redirect, url_for
import dataGenerator
import time
from py_orion import OrionAPI

import os

app = Flask(__name__)
app.secret_key = 'cristian'
orion = OrionAPI()
orion.setOrionIP("orion:1026")


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


def update_entities():
    temperatures = dataGenerator.generate_temperature_values(100, 0.5, 25, 0.1)
    for i in range(0, 100):
        payload = {
            "temperature" : temperatures[i]
        }
        res_update = orion.update_entity("urn:ngsi-ld:TemperatureSensor:001", payload)
        if res_update != 204:
            err_update = "Error in update data " + str(res_update)
            return render_template("error.html", msg=err_update)
        time.sleep(5)


@app.route('/main_page')
@login_required
def main_page():
    return render_template('main_page.html')


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
            return redirect(url_for('main_page'))
        else:
            return redirect(url_for("login"))
    return render_template('login.html')


@app.route('/menu', methods=['GET', 'POST'])
@login_required
def menu():
    return render_template("upload_complete.html")


@app.route('/upload', methods=['GET', 'POST'])
@login_required
def upload_file():
    uploaded_file = request.files['file']
    file_path = '/src/ifc/' + uploaded_file.filename
    uploaded_file.save(file_path)
    os.system('python /src/py2arango.py ' + file_path)
    return redirect(url_for('menu'))


@app.route('/monitoring', methods=['GET', 'POST'])
@login_required
def monitoring():
    return render_template("grafana_dashboard.html")


@app.route('/generation', methods=['GET', 'POST'])
@login_required
def generation():
    res_init = orion.init_entites()
    if res_init != 201:
        err = "Error in init Orion: " + str(res_init)
        return render_template("error.html", message=err)
    res_subscription = orion.init_subscriptions("Quantumleap subscription",
                                                "normalized",
                                                "http://quantumleap:8668/v2/notify")
    if res_subscription != 201:
        err = "Error in doing subscription: " + str(res_subscription)
        return render_template("error.html", message=err)
    res_subscription = orion.init_subscriptions("Perseo-FE subscription",
                                                "normalized",
                                                "http://perseo-fe:9090/notices")
    if res_subscription != 201:
        err = "Error in doing subscription: " + str(res_subscription)
        return render_template("error.html", message=err)

    update_entities()


if __name__ == '__main__':
    app.run(debug=True)
