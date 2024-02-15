FROM python:3.11.5-alpine3.18

COPY requirements.txt .

RUN \
    apk add --no-cache g++ && \
    apk add --no-cache --virtual .builds-deps gcc musl-dev && \
    python3 -m pip install -r requirements.txt --no-cache-dir && \
    apk --purge del .builds-deps


COPY . .

EXPOSE 8432

ENV FLASK_APP=src/App.py
ENV FLASK_ENV=development


CMD ["flask", "run", "--host=0.0.0.0", "--port=80"]
