import json
import time
import csv

times = []
temperatures = []

def csv_to_jsonld(csv_file):
    context = {
        "@context": {
            "nome": "http://schema.org/name",
            "coordinate": {
                "@id": "http://schema.org/geo",
                "@type": "http://schema.org/GeoCoordinates",
                "x": "http://schema.org/longitude",
                "y": "http://schema.org/latitude",
                "z": "http://schema.org/altitude"
            },
            "tempo": "http://schema.org/DateTime",
            "temperatura": "http://schema.org/temperature"
        }
    }

    data = []

    # Lettura dei dati dal file CSV
    with open(csv_file, 'r') as file:
        header = file.readline().strip()
        header = header.replace("\n", "")
        names_list = header.split(";")
        file.readline()
        for line in file:
            line = line.replace("\n", "")
            values_list = line.split(";")
            dictionary = {key: value for key, value in zip(names_list, values_list)}
            data.append(dictionary)

    # Aggiunta del contesto ai dati
    data_with_context = context.copy()
    data_with_context.update({"data": data})

    # Scrittura dei dati in un file JSON
    with open("./json_ld_data.jsonld", 'w') as json_file:
        json.dump(data_with_context, json_file, indent=2)

    print("File created!")


def data_sender(csv_file):
    with open(csv_file, "r") as csv:
        csv.readline()
        for line in csv:
            string = line
            string = string.replace('\n', '')
            values = string.split(";")
            times.append(values[4])
            temperatures.append(float(values[5]))
    for i in range(0, len(times)):
        print(times[i], temperatures[i])
        time.sleep(1)


csv_to_jsonld("simulated_data.csv")