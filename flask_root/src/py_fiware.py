from datetime import datetime
import requests


class FiwareAPI(object):
    def __init__(self):
        self.orionIP = None
        self.perseoIP = None
        self.header = {
            'Content-Type': 'application/ld+json'
        }
        self.header_subscription = {
            'Content-Type': 'application/ld+json',
            'Accept': 'application/ld+json'
        }
        self.header_perseo = {
            'Content-Type': 'application/json'
        }
        self.header_perseo_subscription = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
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
        url = f'http://{self.orionIP}/ngsi-ld/v1/entities?type={entity_type}'
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
        response = requests.get(url, headers=self.header_perseo)
        return response.status_code

    def get_rules(self):
        url = f'http://{self.perseoIP}/rules'
        response = requests.get(url, headers=self.header_perseo)
        return response.json()

    def insert_rule(self, data):
        url = f'http://{self.perseoIP}/rules'
        response = requests.post(url, headers=self.header_perseo, json=data)
        return response.status_code

    def delete_rule(self, rule_name):
        url = f'http://{self.perseoIP}/rules/{rule_name}'
        response = requests.delete(url, headers=self.header_perseo)
        return response.status_code

    def init_device_model(self, sceneModelName, id, brandName, controlledProperty, manufacturerName, modelName, name):
        if self.entity_exists(f"urn:ngsi-ld:DeviceModel:{sceneModelName}-{controlledProperty}-{id}"):
            return 200

        payload = {
            "id": f"urn:ngsi-ld:DeviceModel:{sceneModelName}-{controlledProperty}-{id}",
            "type": "DeviceModel",
            "brandName": {
                "type": "Property",
                "value": brandName
            },
            "deviceCategory": {
                "type": "Property",
                "value": [
                    "sensor"
                ]
            },
            "category": {
                "type": "Property",
                "value": [
                    "sensor"
                ]
            },
            "controlledProperty": {
                "type": "Property",
                "value": [
                    controlledProperty.lower().replace('sensor', '')
                ]
            },
            "function": {
                "type": "Property",
                "value": [
                    "sensing"
                ]
            },
            "manufacturerName": {
                "type": "Property",
                "value": manufacturerName
            },
            "modelName": {
                "type": "Property",
                "value": modelName
            },
            "name": {
                "type": "Property",
                "value": name
            },
            "@context": [
                "https://raw.githubusercontent.com/smart-data-models/dataModel.Device/master/context.jsonld"
            ]
        }
        res = self.insert_entity(payload)
        return res

    def init_device_measurement(self, sceneModelName, id, controlledProperty, description, x, y, z, measurementType, name,
                                numValue):
        if self.entity_exists(f"urn:ngsi-ld:MEASUREMENT:id:{sceneModelName}-{controlledProperty}-{id}"):
            return 200

        payload = {
            "id": f"urn:ngsi-ld:MEASUREMENT:id:{sceneModelName}-{controlledProperty}-{id}",
            "type": "DeviceMeasurement",
            "address": {
                "type": "Property",
                "value": {
                    "streetAddress": "",
                    "addressLocality": "",
                    "addressRegion": "",
                    "addressCountry": "",
                    "postalCode": "",
                    "postOfficeBoxNumber": ""
                }
            },
            "alternateName": {
                "type": "Property",
                "value": ""
            },
            "areaServed": {
                "type": "Property",
                "value": ""
            },
            "controlledProperty": {
                "type": "Property",
                "value": controlledProperty.lower().replace('sensor', '')
            },
            "dataProvider": {
                "type": "Property",
                "value": ""
            },
            "dateCreated": {
                "type": "Property",
                "value": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
            },
            "dateModified": {
                "type": "Property",
                "value": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
            },
            "dateObserved": {
                "type": "Property",
                "value": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
            },
            "description": {
                "type": "Property",
                "value": description
            },
            "deviceType": {
                "type": "Property",
                "value": "sensor"
            },
            "location": {
                "type": "Property",
                "value": {
                    "type": "Point",
                    "coordinates": [
                        x,
                        y,
                        z
                    ]
                }
            },
            "measurementType": {
                "type": "Property",
                "value": measurementType
            },
            "name": {
                "type": "Property",
                "value": name
            },
            "numValue": {
                "type": "Property",
                "value": numValue
            },
            "outlier": {
                "type": "Property",
                "value": False
            },
            "owner": {
                "type": "Property",
                "value": []
            },
            "refDevice": {
                "type": "Property",
                "value": f"urn:ngsi-ld:DeviceModel:{sceneModelName}-{controlledProperty}-{id}"
            },
            "seeAlso": {
                "type": "Property",
                "value": []
            },
            "source": {
                "type": "Property",
                "value": ""
            },
            "textValue": {
                "type": "Property",
                "value": ""
            },
            "unit": {
                "type": "Property",
                "value": "CEL"
            },
            "@context": [
                "https://raw.githubusercontent.com/smart-data-models/dataModel.Device/master/context.jsonld"
            ]
        }
        res = self.insert_entity(payload)
        return res

    def init_quantumleap_subscription(self, description, type, format, uri):
        json = self.get_subscriptions()

        for sub in json:
            if sub["notification"]["endpoint"]["uri"] == uri and sub["entities"] == type:
                self.delete_subscription(sub["id"])

        payload = {
            "description": description,
            "type": "Subscription",
            "entities": [
                {
                    "type": type
                }
            ],
            "watchedAttributes": [
                "numValue"
            ],
            "notification": {
                "attributes": [
                    "numValue",
                    "location"
                ],
                "format": format,
                "endpoint": {
                    "uri": uri,
                    "accept": "application/json"
                }
            },
            "@context": [
                "https://raw.githubusercontent.com/smart-data-models/dataModel.Device/master/context.jsonld"
            ]
        }
        res = self.subscribe(payload)
        return res

    def init_perseo_subscription(self, description, type, format, uri):
        json = self.get_subscriptions()

        for sub in json:
            if sub["notification"]["endpoint"]["uri"] == uri and sub["entities"] == type:
                self.delete_subscription(sub["id"])

        payload = {
            "description": description,
            "type": "Subscription",
            "entities": [
                {
                    "type": type
                }
            ],
            "watchedAttributes": [
                "numValue"
            ],
            "notification": {
                "attributes": [
                    "numValue"
                ],
                "format": format,
                "endpoint": {
                    "uri": uri,
                    "accept": "application/json"
                }
            },
            "@context": [
                "https://raw.githubusercontent.com/smart-data-models/dataModel.Device/master/context.jsonld"
            ]
        }
        res = self.subscribe(payload)
        return res

    def init_rule_mail(self, rule_name, text, template, to, subject):
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
