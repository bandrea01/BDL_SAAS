import subprocess
from functools import wraps

from flask import Flask, request, jsonify, session
from flask import render_template
from flask import redirect, url_for

import os  # Per prendere le variabili di ambiente definite dal file docker

app = Flask(__name__)
app.secret_key = 'cristian'

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
        # if username == os.getenv('DEBUG_USR') and password == os.getenv('DEBUG_PWD'):
        if username == "admin" and password == "restapi":
            session['user_id'] = username  # Salva l'ID utente nella sessione
            return redirect(url_for('main_page'))  # Reindirizzare alla pagina principale dopo il login
        else:
            return redirect(url_for("login"))

    return render_template('login.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    # Salva il file caricato e ottieni il percorso
    uploaded_file = request.files['file']
    file_path = 'ifc\\' + uploaded_file.filename
    uploaded_file.save(file_path)

    # Esegui lo script py2arango con il percorso del file come argomento
    subprocess.run(['python', 'py2arango.py', file_path])

if __name__ == '__main__':
    app.run(debug=True)

#
# def contains(word, pattern):
#     """
#     Metodo per verificare la presenza di un pattern in una parola
#     """
#     return pattern in word
#
#
# def get_table_routes():
#     """
#     Metodo che ritorna tutte le routes dell'applicazione per le view
#     """
#     routes = []
#     if 'user_id' not in session:
#         routes.append('login')
#         return routes
#     for rule in app.url_map.iter_rules():
#         # Filtra le regole che non necessiti, come static files
#         if rule.endpoint != 'static' and contains(rule.endpoint, 'view'):
#             routes.append(rule.endpoint)
#     routes.append('logout')
#     return routes
#
#
# def get_rest_routes():
#     """
#     Metodo che ritorna tutte le routes restanti dell'applicazione
#     """
#     routes = []
#     for rule in app.url_map.iter_rules():
#         # Filtra le regole che non necessiti, come static files
#         if not ( rule.endpoint == 'static' or contains(rule.endpoint, 'view') or contains(rule.endpoint, 'logout') or contains(rule.endpoint, 'login')):
#             if str(rule) != '/results':
#                 routes.append(
#                     [app.view_functions[rule.endpoint].__name__, str(rule), app.view_functions[rule.endpoint].__doc__])
#     return routes
#
#
# def url_to_phrase(url):
#     """
#     Metodo per la formattazione di un URL
#     """
#     words = url.split('_')
#     phrase = ' '.join(word.capitalize() for word in words)
#     return phrase
#
#
# def generate_menu():
#     """
#     Generate menu
#     """
#     pages = []
#     for link in get_table_routes():
#         pages.append({'name': url_to_phrase(link), 'url': url_for(link)})
#
#     return pages
#
#
# @app.route('/logout')
# def logout():
#     """
#         Metodo per il logout dalla web app
#     """
#     session.pop('user_id', None)
#     return redirect(url_for('login'))
#
#

#

# @app.route('/load_ifc', methods=['GET', 'POST'])
# @login_required
# def load_ifc():
#     """
#         Metodo per la creazione di un record di Cliente
#     """
#     if request.method == 'POST':
#         return redirect(url_for('view_clienti'))
#     return render_template('create_cliente.html', menu=generate_menu())


#   END DEBUG   #
