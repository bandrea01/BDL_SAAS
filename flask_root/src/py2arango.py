from arango import ArangoClient
from uuid import uuid4
import ifcopenshell


class Py2Arango(object):
    def __init__(self):
        self.client = ArangoClient(hosts='http://arangodb:8529')
        self.db = self.client.db('prova', username='root', password='BDLaaS')
        self.existing_nodes = set()
        self.existing_edges = set()
        self.graph = None

    def insertSensor(self, nodes_name, edges_name, component_id, type, brandName, controlledProperty,
                     manufacturerName,
                     modelName, name):
        # Inserimento sensore
        id = component_id.split("-")[-1]
        sensor_node = {
            "_key": f"Sensor{type}-{id}",
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
                    controlledProperty
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
            }
        }
        sensor_key = sensor_node["_key"]

        sensor_edge = {
            "_from": f"{nodes_name}/{component_id}",
            "_to": f"{nodes_name}/{sensor_key}",
            "rel_name": f"Has{type}Sensor"
        }

        self.db[nodes_name].insert(sensor_node)
        self.db[edges_name].insert(sensor_edge)

        # try:
        #     self.db[nodes_name].insert(sensor_node)
        #     self.db[edges_name].insert(sensor_edge)
        # except Exception as e:
        #     return 404
        # return 200

    # Create the basic node with literal attributes and the class hierarchy
    # Input: ifc_entity - an instance, ifc_file - the parsed ifc-SPF
    # Output: basic nodes with properties for literal attributes and labels for ifc class hierarchy
    @staticmethod
    def create_pure_node_from_ifc_entity(ifc_entity):
        key = f"{ifc_entity.is_a()}-{str(ifc_entity.id() if ifc_entity.id() != 0 else uuid4())}"
        node = {'_key': key, 'name': ifc_entity.is_a()}
        attributes_type = ['ENTITY INSTANCE', 'AGGREGATE OF ENTITY INSTANCE', 'DERIVED']
        for i in range(ifc_entity.__len__()):
            if not ifc_entity.wrapped_data.get_argument_type(i) in attributes_type:
                name = ifc_entity.wrapped_data.get_argument_name(i)
                name_value = ifc_entity.wrapped_data.get_argument(i)
                node[name] = name_value
        return node

    # existing_nodes = set()
    # existing_edges = set()

    # Process literal attributes, entity attributes, and relationship attributes
    # Input: db - a link to ArangoDB graph database, ifc_entity - an instance, ifc_file - the parsed ifc-SPF
    # Output: a subgraph
    def create_graph_from_ifc_entity_all(self, ifc_entity, ifc_file, nodes_name, edges_name):
        node = self.create_pure_node_from_ifc_entity(ifc_entity)

        # Check if node already exists in the database
        node_key = node["_key"]
        if node_key not in self.existing_nodes:
            collection = self.db[nodes_name]
            collection.insert(node)
            self.existing_nodes.add(node_key)

        for i in range(ifc_entity.__len__()):
            if ifc_entity[i]:
                if ifc_entity.wrapped_data.get_argument_type(i) == 'ENTITY INSTANCE':
                    if ifc_entity.is_a() in ['IfcOwnerHistory'] and ifc_entity.is_a() != 'IfcProject':
                        continue
                    else:
                        sub_node = self.create_pure_node_from_ifc_entity(ifc_entity[i])

                        # Check if sub node already exists in the database
                        sub_node_key = sub_node["_key"]
                        if sub_node_key not in self.existing_nodes:
                            sub_collection = self.db[nodes_name]
                            sub_collection.insert(sub_node)
                            self.existing_nodes.add(sub_node_key)

                        # Controllo se l'arco esiste già
                        edge_key = (node["_key"], sub_node["_key"], ifc_entity.wrapped_data.get_argument_name(i))
                        if edge_key not in self.existing_edges:
                            rel_collection = self.db[edges_name]
                            rel_collection.insert({
                                "_from": f"{nodes_name}/{node['_key']}",
                                "_to": f"{nodes_name}/{sub_node['_key']}",
                                "rel_name": ifc_entity.wrapped_data.get_argument_name(i)
                            })
                            self.existing_edges.add(edge_key)

                elif ifc_entity.wrapped_data.get_argument_type(i) == 'AGGREGATE OF ENTITY INSTANCE':
                    for sub_entity in ifc_entity[i]:
                        sub_node = self.create_pure_node_from_ifc_entity(sub_entity)

                        # Check if sub node already exists in the database
                        sub_node_key = sub_node["_key"]
                        if sub_node_key not in self.existing_nodes:
                            sub_collection = self.db[nodes_name]
                            sub_collection.insert(sub_node)
                            self.existing_nodes.add(sub_node_key)

                        # Controllo se l'arco esiste già
                        edge_key = (node["_key"], sub_node["_key"], ifc_entity.wrapped_data.get_argument_name(i))
                        if edge_key not in self.existing_edges:
                            rel_collection = self.db[edges_name]
                            rel_collection.insert({
                                "_from": f"{nodes_name}/{node['_key']}",
                                "_to": f"{nodes_name}/{sub_node['_key']}",
                                "rel_name": ifc_entity.wrapped_data.get_argument_name(i)
                            })
                            self.existing_edges.add(edge_key)

        for rel_name in ifc_entity.wrapped_data.get_inverse_attribute_names():
            if ifc_entity.wrapped_data.get_inverse(rel_name):
                inverse_relations = ifc_entity.wrapped_data.get_inverse(rel_name)
                for wrapped_rel in inverse_relations:
                    rel_entity = ifc_file.by_id(wrapped_rel.id())
                    sub_node = self.create_pure_node_from_ifc_entity(rel_entity)

                    # Check if sub node already exists in the database
                    sub_node_key = sub_node["_key"]
                    if sub_node_key not in self.existing_nodes:
                        sub_collection = self.db[nodes_name]
                        sub_collection.insert(sub_node)
                        self.existing_nodes.add(sub_node_key)

                    # Controllo se l'arco esiste già
                    edge_key = (sub_node["_key"], sub_node["_key"], rel_name)
                    if edge_key not in self.existing_edges:
                        rel_collection = self.db[edges_name]
                        rel_collection.insert({
                            "_from": f"{nodes_name}/{sub_node['_key']}",
                            "_to": f"{nodes_name}/{sub_node['_key']}",
                            "rel_name": rel_name
                        })
                        self.existing_edges.add(edge_key)

    def create_full_graph(self, ifc_file, nodes_name, edges_name):
        idx = 1
        length = len(ifc_file.wrapped_data.entity_names())
        for entity_id in ifc_file.wrapped_data.entity_names():
            entity = ifc_file.by_id(entity_id)
            print(idx, '/', length, entity)
            self.create_graph_from_ifc_entity_all(entity, ifc_file, nodes_name, edges_name)
            idx += 1
        return

    def init_graph(self, file_path):
        self.existing_nodes = set()
        self.existing_edges = set()
        self.graph = None

        filename = file_path.rsplit('/', 1)[-1].split('.')[-2]

        nodes_name = f"{filename}_nodes"
        edges_name = f"{filename}_edges"
        graph_name = f"{filename}_graph"

        if not (self.db.has_collection(nodes_name) and self.db.has_collection(edges_name)):
            self.db.create_collection(nodes_name)
            self.db.create_collection(edges_name, edge=True)

            # Caricamento file ifc
            ifc_file = ifcopenshell.open(file_path)

            # Creazione grafo
            self.create_full_graph(ifc_file, nodes_name, edges_name)

            self.graph = self.db.create_graph(graph_name, edge_definitions=[
                {
                    "edge_collection": edges_name,  # Nome della collezione di archi (edges) esistente
                    "from_vertex_collections": [nodes_name],  # Nomi delle collezioni di nodi (from)
                    "to_vertex_collections": [nodes_name]  # Nomi delle collezioni di nodi (to)
                }
            ])


