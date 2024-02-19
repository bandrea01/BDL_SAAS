import requests


class OrionAPI(object):
    def __init__(self):
        self.orionIP = None
        self.get_header = {'Accept': 'application/json'}
        self.get_header_plain = {'Accept': 'application/plain'}
        self.post_header = {'Content-Type': 'application/json', 'Accept': 'application/json'}
        self.post_header_plain = {'Content-Type': 'text/plain'}

    def setOrionIP(self, orion_ip):
        self.orionIP = orion_ip

    def getOrionIP(self):
        return self.orionIP

    @staticmethod
    def custom_query(http_request_type, http_header, http_data, query_url):
        if http_request_type == "GET":
            response = requests.post(query_url, headers=http_header)
            return response.json()
        elif http_request_type == "POST":
            response = requests.post(query_url, headers=http_header, json=http_data)
            return response.json()

    def insert_entity(self, entity_id, entity_type, entity_attribute_name, entity_attribute_value,
                      entity_attribute_type, observed_time) -> int:
        data = {
            "id": entity_id,
            "type": entity_type,
            entity_attribute_name: {
                "value": entity_attribute_value,
                "attr_type": entity_attribute_type
            },
            "dateObserved": observed_time
        }
        url = f'http://{self.orionIP}/v2/entities'
        response = requests.post(url, headers=self.post_header, json=data)
        return response.json()

    def get_entities(self):
        url = f'http://{self.orionIP}/v2/entities'
        response = requests.get(url, headers=self.get_header)
        return response.json()

    def get_entity_from_id(self, entity_id):
        url = f'http://{self.orionIP}/v2/entities/{entity_id}'
        response = requests.get(url, headers=self.get_header)
        return response.json()

    def get_entity_from_type(self, entity_type):
        url = f'http://{self.orionIP}/v2/entities?{entity_type}'
        response = requests.get(url, headers=self.get_header)
        return response.json()

    def get_entity_values(self, entity_id, params):
        attrs_field = ','.join(params)
        url = f'http://{self.orionIP}/v2/entities/{entity_id}/options=values&attrs={attrs_field}'
        response = requests.get(url, headers=self.get_header)
        return response.json()

    def get_entity_attribute(self, entity_id, attribute):
        url = f'http://{self.orionIP}/v2/entities/{entity_id}/attrs/{attribute}'
        response = requests.get(url, headers=self.get_header)
        return response.json()

    def get_entitiy_plain_value(self, entity_id, attribute):
        url = f'http://{self.orionIP}/v2/entities/{entity_id}/attrs/{attribute}/value'
        response = requests.get(url, headers=self.get_header_plain)
        return response.json()

    def update_entity(self, entity_id, attribute_name, attribute_new_value, attribute_type):
        data = {
            {attribute_name}: {
                "value": attribute_new_value,
                "type": attribute_type
            }
        }

        url = f'http://{self.orionIP}/v2/entities/{entity_id}/attrs'
        response = requests.patch(url, headers=self.post_header, json=data)
        return response.json()

    def update_entity_by_value(self, entity_id, attribute_name, attribute_new_value):
        string_new_value = str(attribute_new_value)
        url = f'http://{self.orionIP}/v2/entities/{entity_id}/attrs/{attribute_name}/value'
        response = requests.post(url, headers=self.post_header_plain, json=string_new_value)
        return response.json()

    @staticmethod
    def _create_subscription_data(description, entities_list, conditions_list, notification_http_url,
                                  notification_attrs_list, expiration, expression_name=None, expression_body=None):
        data = {
            "description": description,
            "subject": {
                "entities": entities_list,
                "condition": {
                    "attrs": conditions_list
                }
            },
            "notification": {
                "http": {
                    "url": notification_http_url
                },
                "attrs": notification_attrs_list
            },
            "expires": expiration
        }
        if expression_name and expression_body:
            data["subject"]["expression"] = {expression_name: expression_body}
        return data

    def subscribe(self, description, entities_list, conditions_list, notification_url, notification_attrs_list,
                  expiration):
        data = self._create_subscription_data(description, entities_list, conditions_list, notification_url,
                                              notification_attrs_list, expiration)
        url = f'http://{self.orionIP}/v2/subscriptions'
        response = requests.post(url, headers=self.post_header, json=data)
        return response.json()

    def subscribe_with_expression(self, description, entities_list, conditions_list, expression_name, expression_body,
                                  notification_http_url, notification_attrs_list, expiration):
        data = self._create_subscription_data(description, entities_list, conditions_list, notification_http_url,
                                              notification_attrs_list, expiration, expression_name, expression_body)
        url = f'http://{self.orionIP}/v2/subscriptions'
        response = requests.post(url, headers=self.post_header, json=data)
        return response.json()

    @staticmethod
    def get_subscription_id_from_response(response):
        return response["Location"].rsplit('/', 1)[-1]

    def pause_subscription(self, subscription_id):
        data = {"status": "inactive"}

        url = f'http://{self.orionIP}/v2/subscriptions/{subscription_id}'
        response = requests.patch(url, headers=self.post_header, json=data)
        return response.json()

    def get_types(self):
        url = f'http://{self.orionIP}/v2/types'
        response = requests.get(url, headers=self.get_header)
        return response.json()

    def get_types_list(self):
        url = f'http://{self.orionIP}/v2/types?option=values'
        response = requests.get(url, headers=self.get_header)
        return response.json()

    def register(self, description, entities_list, attributes_list, provider_url):
        data = {
            "description": description,
            "dataProvided": {
                "entities": entities_list,
                "attrs": attributes_list
            },
            "provider": {
                "http": {
                    "url": provider_url
                }
            }
        }

        url = f'http://{self.orionIP}/v2/types?option=values'
        response = requests.post(url, headers=self.post_header, json=data)
        return response.json()

    @staticmethod
    def get_registration_id_from_response(response):
        return response["Location"].rsplit('/', 1)[-1]

    def get_all_registrations(self):
        url = f'http://{self.orionIP}/v2/registrations'
        response = requests.get(url, headers=self.get_header)
        return response.json()

    def get_registration_by_id(self, regitration_id):
        url = f'http://{self.orionIP}/v2/registrations/{regitration_id}'
        response = requests.get(url, headers=self.get_header)
        return response.json()

    def delete_registration_by_id(self, regitration_id):
        url = f'http://{self.orionIP}/v2/registrations/{regitration_id}'
        response = requests.delete(url, headers=self.post_header)
        return response.json()
