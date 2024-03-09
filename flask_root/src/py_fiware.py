import base64
import os

import requests


class FiwareAPI(object):

    def __init__(self):
        self.orionIP = None
        self.perseoIP = None
        self.header = {
            'Content-Type': 'application/json',
            'Link': '<https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context-v1.7.jsonld>; '
                    'rel="http://www.w3.org/ns/json-ld#context"; '
                    'type="application/ld+json"'
        }
        self.header_subscription = {
            'Content-Type': 'application/json'
        }

    def setOrionIP(self, orion_ip):
        self.orionIP = orion_ip

    def getOrionIP(self):
        return self.orionIP

    def setPerseoIP(self, perseoIP):
        self.perseoIP = perseoIP

    def getPerseoIP(self):
        return self.perseoIP

    @staticmethod
    def custom_query(http_request_type, http_header, http_data, query_url):
        if http_request_type == "GET":
            response = requests.get(query_url, headers=http_header)
            return response.json()
        elif http_request_type == "POST":
            response = requests.post(query_url, headers=http_header, json=http_data)
            return response.status_code
        elif http_request_type == "PATCH":
            response = requests.patch(query_url, headers=http_header, json=http_data)
            return response.status_code
        elif http_request_type == "PUT":
            response = requests.put(query_url, headers=http_header, json=http_data)
            return response.status_code
        elif http_request_type == "DELETE":
            response = requests.delete(query_url, headers=http_header, json=http_data)
            return response.status_code

    def insert_entity(self, data):
        url = f'http://{self.orionIP}/ngsi-ld/v1/entities'
        response = requests.post(url, headers=self.header, json=data)
        return response.status_code

    def get_entities(self):
        url = f'http://{self.orionIP}/ngsi-ld/v1/entities'
        response = requests.get(url, headers=self.header)
        return response.json()

    def get_entity_from_id(self, entity_id):
        url = f'http://{self.orionIP}/ngsi-ld/v1/entities/{entity_id}'
        response = requests.get(url, headers=self.header)
        return response.json()

    def entity_exists(self, entity_id):
        url = f'http://{self.orionIP}/ngsi-ld/v1/entities/{entity_id}'
        response = requests.get(url, headers=self.header)
        return response.status_code == 200

    def get_entity_from_type(self, entity_type):
        url = f'http://{self.orionIP}/ngsi-ld/v1/entities?{entity_type}'
        response = requests.get(url, headers=self.header)
        return response.json()

    def get_entity_values(self, entity_id, params):
        attrs_field = ','.join(params)
        url = f'http://{self.orionIP}/ngsi-ld/v1/entities/{entity_id}/options=values&attrs={attrs_field}'
        response = requests.get(url, headers=self.header)
        return response.json()

    def get_entity_attribute(self, entity_id, attribute):
        url = f'http://{self.orionIP}/ngsi-ld/v1/entities/{entity_id}/attrs/{attribute}'
        response = requests.get(url, headers=self.header)
        return response.json()

    def get_entity_plain_value(self, entity_id, attribute):
        url = f'http://{self.orionIP}/ngsi-ld/v1/entities/{entity_id}/attrs/{attribute}/value'
        response = requests.get(url, headers=self.header)
        return response.json()

    def update_entity(self, entity_id, data):
        url = f'http://{self.orionIP}/ngsi-ld/v1/entities/{entity_id}/attrs'
        response = requests.patch(url, headers=self.header, json=data)
        return response.status_code

    def update_entity_by_value(self, entity_id, attribute_name, attribute_new_value):
        string_new_value = str(attribute_new_value)
        url = f'http://{self.orionIP}/ngsi-ld/v1/entities/{entity_id}/attrs/{attribute_name}'
        response = requests.put(url, headers=self.header, json=string_new_value)
        return response.status_code

    def delete_entity(self, entity_id):
        url = f'http://{self.orionIP}/ngsi-ld/v1/entities/{entity_id}'
        response = requests.delete(url, headers=self.header)
        return response.status_code

    def subscribe(self, data):
        url = f'http://{self.orionIP}/ngsi-ld/v1/subscriptions'
        response = requests.post(url, headers=self.header_subscription, json=data)
        return response.status_code

    def get_subscriptions(self):
        url = f'http://{self.orionIP}/ngsi-ld/v1/subscriptions'
        response = requests.get(url, headers=self.header_subscription)
        return response.json()

    @staticmethod
    def get_subscription_id_from_response(response):
        return response["Location"].rsplit('/', 1)[-1]

    def pause_subscription(self, subscription_id):
        data = {"status": "inactive"}
        url = f'http://{self.orionIP}/ngsi-ld/v1/subscriptions/{subscription_id}'
        response = requests.patch(url, headers=self.header, json=data)
        return response.status_code

    def delete_subscription(self, subscription_id):
        url = f'http://{self.orionIP}/ngsi-ld/v1/subscriptions/{subscription_id}'
        response = requests.delete(url, headers=self.header)
        return response.status_code

    def get_types(self):
        url = f'http://{self.orionIP}/ngsi-ld/v1/types'
        response = requests.get(url, headers=self.header)
        return response.json()

    def get_types_list(self):
        url = f'http://{self.orionIP}/ngsi-ld/v1/types?option=values'
        response = requests.get(url, headers=self.header)
        return response.json()

    def register(self, data):
        url = f'http://{self.orionIP}/ngsi-ld/v1/types?option=values'
        response = requests.post(url, headers=self.header, json=data)
        return response.status_code

    @staticmethod
    def get_registration_id_from_response(response):
        return response["Location"].rsplit('/', 1)[-1]

    def get_all_registrations(self):
        url = f'http://{self.orionIP}/ngsi-ld/v1/registrations'
        response = requests.get(url, headers=self.header)
        return response.json()

    def get_registration_by_id(self, registration_id):
        url = f'http://{self.orionIP}/ngsi-ld/v1/registrations/{registration_id}'
        response = requests.get(url, headers=self.header)
        return response.json()

    def delete_registration_by_id(self, regitration_id):
        url = f'http://{self.orionIP}/ngsi-ld/v1/registrations/{regitration_id}'
        response = requests.delete(url, headers=self.header)
        return response.status_code

    def get_rule_by_name(self, rule_name):
        url = f'http://{self.perseoIP}/rules/{rule_name}'
        response = requests.get(url, headers=self.header_subscription)
        return response.status_code

    def get_rules(self):
        url = f'http://{self.perseoIP}/rules'
        response = requests.get(url, headers=self.header_subscription)
        return response.json()

    def insert_rule(self, data):
        url = f'http://{self.perseoIP}/rules'
        response = requests.post(url, headers=self.header_subscription, json=data)
        return response.status_code

    def delete_rule(self, rule_name):
        url = f'http://{self.perseoIP}/rules/{rule_name}'
        response = requests.delete(url, headers=self.header_subscription)
        return response.status_code

    def init_entites(self, type, temperature_value):
        if self.entity_exists("urn:ngsi-ld:TemperatureSensor:001"):
            return 200

        # self.delete_entity("urn:ngsi-ld:TemperatureSensor:001")
        payload = {
            "id": "urn:ngsi-ld:TemperatureSensor:001",
            "type": type,
            "category": {
                "type": "Property",
                "value": "sensor"
            },
            "location": {
                "type": "GeoProperty",
                "value": {
                    "type": "Point",
                    "coordinates": [-8, 44]
                }
            },
            "temperature": {
                "type": "Property",
                "value": temperature_value,
                "unitCode": "CEL"
            }
        }
        res = self.insert_entity(payload)
        return res

    def init_subscriptions(self, description, type, format, uri):
        json = self.get_subscriptions()

        for sub in json:
            if sub["notification"]["endpoint"]["uri"] == uri:
                self.delete_subscription(sub["id"])

        payload = {
            "description": description,
            "type": "Subscription",
            "entities": [
                {
                    "type": type,
                }
            ],
            "notification": {
                "attributes": ["temperature", "location"],
                "format": format,
                "endpoint": {
                    "uri": uri,
                    "accept": "application/json"
                }
            }
        }
        res = self.subscribe(payload)
        return res

    def init_rules_mail(self, rule_name, text, template, to, subject):
        status = self.get_rule_by_name(rule_name)

        if status == 200:
            self.delete_rule(rule_name)

        payload = {
            "name": rule_name,
            "text": text,
            "action": {
                "type": "email",
                "template": template,
                "parameters": {
                    "to": to,
                    "from": "perseobdl@gmail.com",
                    "subject": subject
                }
            }
        }

        res = self.insert_rule(payload)
        return res


