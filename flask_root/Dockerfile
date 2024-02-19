FROM python:3.11

COPY requirements.txt .

RUN \
    python3 -m pip install -r requirements.txt --no-cache-dir

COPY . .

EXPOSE 8432

ENV FLASK_APP=src/App.py
ENV FLASK_ENV=development


CMD ["flask", "run", "--host=0.0.0.0", "--port=80"]
