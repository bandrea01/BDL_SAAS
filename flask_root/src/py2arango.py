import sys
from arango import ArangoClient
from uuid import uuid4
import ifcopenshell


# Create the basic node with literal attributes and the class hierarchy
# Input: ifc_entity - an instance, ifc_file - the parsed ifc-SPF
# Output: basic nodes with properties for literal attributes and labels for ifc class hierarchy
def create_pure_node_from_ifc_entity(ifc_entity):
    node = {'_key': str(ifc_entity.id() if ifc_entity.id() != 0 else uuid4()), 'name': ifc_entity.is_a()}
    attributes_type = ['ENTITY INSTANCE', 'AGGREGATE OF ENTITY INSTANCE', 'DERIVED']
    for i in range(ifc_entity.__len__()):
        if not ifc_entity.wrapped_data.get_argument_type(i) in attributes_type:
            name = ifc_entity.wrapped_data.get_argument_name(i)
            name_value = ifc_entity.wrapped_data.get_argument(i)
            node[name] = name_value
    return node


existing_nodes = set()
existing_edges = set()


# Process literal attributes, entity attributes, and relationship attributes
# Input: db - a link to ArangoDB graph database, ifc_entity - an instance, ifc_file - the parsed ifc-SPF
# Output: a subgraph
def create_graph_from_ifc_entity_all(db, ifc_entity, ifc_file, nodes_name, edges_name):
    node = create_pure_node_from_ifc_entity(ifc_entity)
    # collection = db[nodes_name]

    # Check if node already exists in the database
    # existing_node = collection.get(node["_key"])
    # if not existing_node:
    #    collection.insert(node)
    node_key = node["_key"]
    if node_key not in existing_nodes:
        collection = db[nodes_name]
        collection.insert(node)
        existing_nodes.add(node_key)

    for i in range(ifc_entity.__len__()):
        if ifc_entity[i]:
            if ifc_entity.wrapped_data.get_argument_type(i) == 'ENTITY INSTANCE':
                if ifc_entity.is_a() in ['IfcOwnerHistory'] and ifc_entity.is_a() != 'IfcProject':
                    continue
                else:
                    sub_node = create_pure_node_from_ifc_entity(ifc_entity[i])
                    # sub_collection = db[nodes_name]

                    # Check if sub node already exists in the database
                    # existing_sub_node = sub_collection.get(sub_node["_key"])
                    # if not existing_sub_node:
                    #    sub_collection.insert(sub_node)

                    sub_node_key = sub_node["_key"]
                    if sub_node_key not in existing_nodes:
                        sub_collection = db[nodes_name]
                        sub_collection.insert(sub_node)
                        existing_nodes.add(sub_node_key)

                    # Controllo se l'arco esiste già
                    edge_key = (node["_key"], sub_node["_key"], ifc_entity.wrapped_data.get_argument_name(i))
                    if edge_key not in existing_edges:
                        rel_collection = db[edges_name]
                        rel_collection.insert({
                            "_from": f"{nodes_name}/{node['_key']}",
                            "_to": f"{nodes_name}/{sub_node['_key']}",
                            "rel_name": ifc_entity.wrapped_data.get_argument_name(i)
                        })
                        existing_edges.add(edge_key)

            elif ifc_entity.wrapped_data.get_argument_type(i) == 'AGGREGATE OF ENTITY INSTANCE':
                for sub_entity in ifc_entity[i]:
                    sub_node = create_pure_node_from_ifc_entity(sub_entity)
                    # sub_collection = db[nodes_name]

                    # Check if sub node already exists in the database
                    # existing_sub_node = sub_collection.get(sub_node["_key"])
                    # if not existing_sub_node:
                    #    sub_collection.insert(sub_node)

                    sub_node_key = sub_node["_key"]
                    if sub_node_key not in existing_nodes:
                        sub_collection = db[nodes_name]
                        sub_collection.insert(sub_node)
                        existing_nodes.add(sub_node_key)

                    # Controllo se l'arco esiste già
                    edge_key = (node["_key"], sub_node["_key"], ifc_entity.wrapped_data.get_argument_name(i))
                    if edge_key not in existing_edges:
                        rel_collection = db[edges_name]
                        rel_collection.insert({
                            "_from": f"{nodes_name}/{node['_key']}",
                            "_to": f"{nodes_name}/{sub_node['_key']}",
                            "rel_name": ifc_entity.wrapped_data.get_argument_name(i)
                        })
                        existing_edges.add(edge_key)

    for rel_name in ifc_entity.wrapped_data.get_inverse_attribute_names():
        if ifc_entity.wrapped_data.get_inverse(rel_name):
            inverse_relations = ifc_entity.wrapped_data.get_inverse(rel_name)
            for wrapped_rel in inverse_relations:
                rel_entity = ifc_file.by_id(wrapped_rel.id())
                sub_node = create_pure_node_from_ifc_entity(rel_entity)
                # sub_collection = db[nodes_name]

                # Check if sub node already exists in the database
                # existing_sub_node = sub_collection.get(sub_node["_key"])
                # if not existing_sub_node:
                #    sub_collection.insert(sub_node)

                sub_node_key = sub_node["_key"]
                if sub_node_key not in existing_nodes:
                    sub_collection = db[nodes_name]
                    sub_collection.insert(sub_node)
                    existing_nodes.add(sub_node_key)

                # Controllo se l'arco esiste già
                edge_key = (sub_node["_key"], sub_node["_key"], rel_name)
                if edge_key not in existing_edges:
                    rel_collection = db[edges_name]
                    rel_collection.insert({
                        "_from": f"{nodes_name}/{sub_node['_key']}",
                        "_to": f"{nodes_name}/{sub_node['_key']}",
                        "rel_name": rel_name
                    })
                    existing_edges.add(edge_key)


def create_full_graph(db, ifc_file, nodes_name, edges_name):
    idx = 1
    length = len(ifc_file.wrapped_data.entity_names())
    for entity_id in ifc_file.wrapped_data.entity_names():
        entity = ifc_file.by_id(entity_id)
        print(idx, '/', length, entity)
        create_graph_from_ifc_entity_all(db, entity, ifc_file, nodes_name, edges_name)
        idx += 1
    return


if len(sys.argv) != 2:
    print("Usage: python py2arango.py <path_to_ifc_file>")
    sys.exit(1)

# Initialize the ArangoDB client
client = ArangoClient(hosts='http://bdl_saas-arangodb-1:8529')
db = client.db('prova', username='root', password='BDLaaS')

filename = sys.argv[1].rsplit('/', 1)[-1].split('.')[-2]
nodes_name = f"{filename}_nodes"
edges_name = f"{filename}_edges"
graph_name = f"{filename}_graph"

if not (db.has_collection(nodes_name) and db.has_collection(edges_name)):
    db.create_collection(nodes_name)
    db.create_collection(edges_name, edge=True)

    # Caricamento file ifc
    ifc_file_path = sys.argv[1]
    ifc_file = ifcopenshell.open(ifc_file_path)

    # Inizializzazione e utilizzo del grafo
    create_full_graph(db, ifc_file, nodes_name, edges_name)

    graph = db.create_graph(graph_name, edge_definitions=[
        {
            "edge_collection": edges_name,  # Nome della collezione di archi (edges) esistente
            "from_vertex_collections": [nodes_name],  # Nomi delle collezioni di nodi (from)
            "to_vertex_collections": [nodes_name]  # Nomi delle collezioni di nodi (to)
        }
    ])
