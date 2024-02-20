import requests


class OrionAPI(object):

    def __init__(self):
        self.orionIP = None
        self.header = {
            'Content-Type': 'application/json',
            'Link': '<http://context/ngsi-context.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; '
                    'type="application/ld+json"',
            'Accept': 'application/ld+json'
        }

    def setOrionIP(self, orion_ip):
        self.orionIP = orion_ip

    def getOrionIP(self):
        return self.orionIP

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
        url = f'http://{self.orionIP}/ngsi-ld/v1/entities/{entity_id}/attrs/{attribute_name}/value'
        response = requests.put(url, headers=self.header, json=string_new_value)
        return response.status_code

    def subscribe(self, data):
        url = f'http://{self.orionIP}/ngsi-ld/v1/subscriptions'
        response = requests.post(url, headers=self.header, json=data)
        return response.status_code

    @staticmethod
    def get_subscription_id_from_response(response):
        return response["Location"].rsplit('/', 1)[-1]

    def pause_subscription(self, subscription_id):
        data = {"status": "inactive"}
        url = f'http://{self.orionIP}/ngsi-ld/v1/subscriptions/{subscription_id}'
        response = requests.patch(url, headers=self.header, json=data)
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
