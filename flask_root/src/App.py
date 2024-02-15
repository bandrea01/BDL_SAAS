from flask import Flask, request, jsonify, session
from flask import render_template
from flask import redirect, url_for
from functools import wraps
from datetime import datetime

import os  # Per prendere le variabili di ambiente definite dal file docker

app = Flask(__name__)

if __name__ == '__main__':
    app.run(debug=True)

#   DEBUG ADMIN  #

@app.route('/')
def index():
    """
        Visualizzazione di default di tutti i clienti
    """
    return redirect(url_for('view_clienti'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    """
        Pagina di login per accedere alle risorse del satabase
    """
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        if username == os.getenv('DEBUG_USR') and password == os.getenv(
                'DEBUG_PWD'):  # Sostituire con il controllo delle credenziali reali
            session['user_id'] = username  # Salva l'ID utente nella sessione
            return redirect(url_for('view_clienti'))  # Reindirizzare alla pagina principale dopo il login
        else:
            return redirect(url_for("login"))

    return render_template('login.html')


def contains(word, pattern):
    """
    Metodo per verificare la presenza di un pattern in una parola
    """
    return pattern in word


def get_table_routes():
    """
    Metodo che ritorna tutte le routes dell'applicazione per le view
    """
    routes = []
    if 'user_id' not in session:
        routes.append('login')
        return routes
    for rule in app.url_map.iter_rules():
        # Filtra le regole che non necessiti, come static files
        if rule.endpoint != 'static' and contains(rule.endpoint, 'view'):
            routes.append(rule.endpoint)
    routes.append('logout')
    return routes


def get_rest_routes():
    """
    Metodo che ritorna tutte le routes restanti dell'applicazione
    """
    routes = []
    for rule in app.url_map.iter_rules():
        # Filtra le regole che non necessiti, come static files
        if not ( rule.endpoint == 'static' or contains(rule.endpoint, 'view') or contains(rule.endpoint, 'logout') or contains(rule.endpoint, 'login')):
            if str(rule) != '/results':
                routes.append(
                    [app.view_functions[rule.endpoint].__name__, str(rule), app.view_functions[rule.endpoint].__doc__])
    return routes


def url_to_phrase(url):
    """
    Metodo per la formattazione di un URL
    """
    words = url.split('_')
    phrase = ' '.join(word.capitalize() for word in words)
    return phrase


def generate_menu():
    """
    Generate menu
    """
    pages = []
    for link in get_table_routes():
        pages.append({'name': url_to_phrase(link), 'url': url_for(link)})

    return pages


@app.route('/logout')
def logout():
    """
        Metodo per il logout dalla web app
    """
    session.pop('user_id', None)
    return redirect(url_for('login'))


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


@app.route('/load_ifc', methods=['GET', 'POST'])
@login_required
def load_ifc():
    """
        Metodo per la creazione di un record di Cliente
    """
    if request.method == 'POST':

        return redirect(url_for('view_clienti'))

    return render_template('create_cliente.html', menu=generate_menu())


#   END DEBUG   #
