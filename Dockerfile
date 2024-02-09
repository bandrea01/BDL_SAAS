FROM python:3.11.4-alpine3.18

COPY requirements.txt .

RUN \
    #Scarichiamo librerie di postgres
    apk add --no-cache postgresql-libs && \ 
    apk add --no-cache g++ && \
    apk add --no-cache --virtual .builds-deps gcc musl-dev postgresql-dev && \
    #Installazione di dipendenze e librerie python
    python3 -m pip install -r requirements.txt --no-cache-dir && \
    #Pulizia della memoria
    apk --purge del .builds-deps

COPY . .

#Esposizione della porta 80 (docker-compose.yml -> pythonapp -> port)
EXPOSE 80

#Indico che la FLASK_APP è l'applicazione python che ho scritto (App.py)
ENV FLASK_APP=src/App2.py

#Comando che viene eseguito automaticamente per runnare l'applicazione
CMD ["flask", "run", "--host=0.0.0.0", "--port=80"]