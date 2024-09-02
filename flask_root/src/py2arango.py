import re
from arango import ArangoClient
from uuid import uuid4

import ifcopenshell
import ifcopenshell.api


class Py2Arango(object):
    def __init__(self):
        self.client = ArangoClient(hosts='http://arangodb:8529')
        self.db = self.get_database()
        self.existing_nodes = set()
        self.existing_edges = set()
        self.graph = None

    def get_database(self):
        sys_db = self.client.db('_system', username='root', password='BDLaaS')

        if not sys_db.has_database('prova'):
            sys_db.create_database('prova')

        return self.client.db('prova', username='root', password='BDLaaS')

    def getIfcNodeFromName(self, collection_name, name):
        query = f"""
            FOR i IN {collection_name}
                FILTER i.name == "{name}"
                RETURN i
        """

        cursor = self.db.aql.execute(query)
        return cursor.next()

    def getRowNumber(self, nodes_name):
        """
        Query per ottenere l'ultimo ID inserito:

        FOR doc IN ExBuonPastore_nodes
            SORT TO_NUMBER(SUBSTRING(doc.row, 1)) DESC
            LIMIT 1
            RETURN TO_NUMBER(SUBSTRING(doc.row, 1))
        """
        query = f"""
            FOR i IN {nodes_name}
                SORT TO_NUMBER(SUBSTRING(i.row, 1)) DESC
                LIMIT 1
                RETURN TO_NUMBER(SUBSTRING(i.row, 1))
        """

        cursor = self.db.aql.execute(query)
        return cursor.next()

    @staticmethod
    def getIfcSensor(nodes_name, current_id, name, description, objectType, tag, predefinedType, ifcOwnerHistory):
        current_id += 1

        ifc_sensor = {
            "_key": f"IfcSensor-{current_id}",
            "name": "IfcSensor",
            "row": f"#{current_id}",
            "GlobalId": str(uuid4()),
            "Name": name,
            "Description": description,
            "ObjectType": objectType,
            "Tag": tag,
            "PredefinedType": f"{predefinedType}",
        }

        edge = {
            "_from": f"{nodes_name}/{ifc_sensor['_key']}",
            "_to": f"{nodes_name}/{ifcOwnerHistory['_key']}",
            "rel_name": f"OwnerHistory"
        }

        return current_id, ifc_sensor, edge

    @staticmethod
    def getIfcRelContainedInSpatialStructureEdge(nodes_name, ifc_sensor, ifcRelContainedInSpatialStructure):
        edge = {
            "_from": f"{nodes_name}/{ifc_sensor['_key']}",
            "_to": f"{nodes_name}/{ifcRelContainedInSpatialStructure['_key']}",
            "rel_name": f"RelatedElements"
        }

        return edge

    @staticmethod
    def getIfcRelDefinesByType(nodes_name, current_id, ifc_sensor, ifcOwnerHistory):
        current_id += 1

        ifcRelDefinesByType = {
            "_key": f"IfcRelDefinesByType-{current_id}",
            "name": "IfcRelDefinesByType",
            "row": f"#{current_id}",
            "GlobalId": str(uuid4()),
            "Name": None,
            "Description": None
        }

        edge = {
            "_from": f"{nodes_name}/{ifc_sensor['_key']}",
            "_to": f"{nodes_name}/{ifcRelDefinesByType['_key']}",
            "rel_name": f"RelatingObjects"
        }

        edge_owner = {
            "_from": f"{nodes_name}/{ifcRelDefinesByType['_key']}",
            "_to": f"{nodes_name}/{ifcOwnerHistory['_key']}",
            "rel_name": f"OwnerHistory"
        }

        return current_id, ifcRelDefinesByType, edge, edge_owner

    @staticmethod
    def getIfcRelAssociatesMaterial(nodes_name, current_id, ifc_sensor, ifcOwnerHistory):
        current_id += 1

        ifcRelAssociatesMaterial = {
            "_key": f"IfcRelAssociatesMaterial-{current_id}",
            "name": "IfcRelAssociatesMaterial",
            "row": f"#{current_id}",
            "GlobalId": str(uuid4()),
            "Name": None,
            "Description": None
        }

        edge = {
            "_from": f"{nodes_name}/{ifc_sensor['_key']}",
            "_to": f"{nodes_name}/{ifcRelAssociatesMaterial['_key']}",
            "rel_name": f"RelatedObjects"
        }

        edge_owner = {
            "_from": f"{nodes_name}/{ifcRelAssociatesMaterial['_key']}",
            "_to": f"{nodes_name}/{ifcOwnerHistory['_key']}",
            "rel_name": f"OwnerHistory"
        }

        return current_id, ifcRelAssociatesMaterial, edge, edge_owner

    @staticmethod
    def getIfcMaterial(nodes_name, current_id, ifcRelAssociatesMaterial):
        current_id += 1

        ifcMaterial = {
            "_key": f"IfcMaterial-{current_id}",
            "name": "IfcMaterial",
            "row": f"#{current_id}",
            "Name": None,
            "Description": None,
            "Category": None,
        }

        edge = {
            "_from": f"{nodes_name}/{ifcRelAssociatesMaterial['_key']}",
            "_to": f"{nodes_name}/{ifcMaterial['_key']}",
            "rel_name": f"RelatingMaterial"
        }

        return current_id, ifcMaterial, edge

    # TODO: Da capire come e se usare ApplicationOccurrence e ElementType o metterli a None
    @staticmethod
    def getIfcSensorType(nodes_name, current_id, name, description,  predefinedType, ifcRelDefinesByType, ifcRelAssociatesMaterial, ifcOwnerHistory):
        current_id += 1

        ifcSensorType = {
            "_key": f"IfcSensorType-{current_id}",
            "name": "IfcSensorType",
            "row": f"#{current_id}",
            "GlobalId": str(uuid4()),
            "Name": name,
            "Description": description,
            "ApplicableOccurrence": "Any",
            "Tag": None,
            "ElementType": "SENSOR",
            "PredefinedType": f"{predefinedType}",
        }

        edge_type = {
            "_from": f"{nodes_name}/{ifcRelDefinesByType['_key']}",
            "_to": f"{nodes_name}/{ifcSensorType['_key']}",
            "rel_name": f"RelatingType"
        }

        edge_material = {
            "_from": f"{nodes_name}/{ifcRelAssociatesMaterial['_key']}",
            "_to": f"{nodes_name}/{ifcSensorType['_key']}",
            "rel_name": f"RelatedObjects"
        }

        edge_owner = {
            "_from": f"{nodes_name}/{ifcSensorType['_key']}",
            "_to": f"{nodes_name}/{ifcOwnerHistory['_key']}",
            "rel_name": f"OwnerHistory"
        }

        return current_id, ifcSensorType, edge_type, edge_material, edge_owner

    @staticmethod
    def getIfcRelNests(nodes_name, current_id, ifc_sensor, ifcOwnerHistory):
        current_id += 1

        ifcRelNests = {
            "_key": f"IfcRelNests-{current_id}",
            "name": "IfcRelNests",
            "row": f"#{current_id}",
            "GlobalId": str(uuid4()),
            "Name": "NestedPorts",
            "Description": "Flow"
        }

        edge = {
            "_from": f"{nodes_name}/{ifc_sensor['_key']}",
            "_to": f"{nodes_name}/{ifcRelNests['_key']}",
            "rel_name": f"RelatingObject"
        }

        edge_owner = {
            "_from": f"{nodes_name}/{ifcRelNests['_key']}",
            "_to": f"{nodes_name}/{ifcOwnerHistory['_key']}",
            "rel_name": f"OwnerHistory"
        }

        return current_id, ifcRelNests, edge, edge_owner

    @staticmethod
    def getIfcDistributionPort(nodes_name, current_id, ifcRelNests):
        current_id += 1

        ifcDistributionPort = {
            "_key": f"IfcDistributionPort-{current_id}",
            "name": "IfcDistributionPort",
            "row": f"#{current_id}",
            "GlobalId": str(uuid4()),
            "Name": f"Port_{str(uuid4())}_1",
            "Description": "Flow",
            "ObjectType": None,
            "FlowDirection": "SOURCEANDSINK",
            "PredefinedType": "CABLE",
            "SystemType": "ELECTRICAL",
        }

        edge = {
            "_from": f"{nodes_name}/{ifcRelNests['_key']}",
            "_to": f"{nodes_name}/{ifcDistributionPort['_key']}",
            "rel_name": f"RelatedObjects"
        }

        return current_id, ifcDistributionPort, edge

    @staticmethod
    def getIfcRelDefinesByProperties(nodes_name, current_id, ifc_sensor, ifcOwnerHistory):
        current_id += 1

        ifcRelDefinesByProperties = {
            "_key": f"IfcRelDefinesByProperties-{current_id}",
            "name": "IfcRelDefinesByProperties",
            "row": f"#{current_id}",
            "GlobalId": str(uuid4()),
            "Name": None,
            "Description": None
        }

        edge = {
            "_from": f"{nodes_name}/{ifc_sensor['_key']}",
            "_to": f"{nodes_name}/{ifcRelDefinesByProperties['_key']}",
            "rel_name": f"RelatedObjects"
        }

        edge_owner = {
            "_from": f"{nodes_name}/{ifcRelDefinesByProperties['_key']}",
            "_to": f"{nodes_name}/{ifcOwnerHistory['_key']}",
            "rel_name": f"OwnerHistory"
        }

        return current_id, ifcRelDefinesByProperties, edge, edge_owner

    @staticmethod
    def getIfcPropertySet(nodes_name, current_id, name, ifcRelDefinesByProperties, ifcOwnerHistory):
        current_id += 1

        ifcPropertySet = {
            "_key": f"IfcPropertySet-{current_id}",
            "name": "IfcPropertySet",
            "row": f"#{current_id}",
            "GlobalId": str(uuid4()),
            "Name": f"Pset_{name}",
            "Description": None
        }

        edge = {
            "_from": f"{nodes_name}/{ifcRelDefinesByProperties['_key']}",
            "_to": f"{nodes_name}/{ifcPropertySet['_key']}",
            "rel_name": f"RelatingPropertyDefinition"
        }

        edge_owner = {
            "_from": f"{nodes_name}/{ifcPropertySet['_key']}",
            "_to": f"{nodes_name}/{ifcOwnerHistory['_key']}",
            "rel_name": f"OwnerHistory"
        }

        return current_id, ifcPropertySet, edge, edge_owner

    @staticmethod
    def getIfcPropertySingleValue(nodes_name, current_id, name, ifcPropertySet):
        current_id += 1

        ifcPropertySingleValue = {
            "_key": f"IfcPropertySingleValue-{current_id}",
            "name": "IfcPropertySingleValue",
            "row": f"#{current_id}",
            "Name": name
        }

        edge = {
            "_from": f"{nodes_name}/{ifcPropertySet['_key']}",
            "_to": f"{nodes_name}/{ifcPropertySingleValue['_key']}",
            "rel_name": f"HasProperties"
        }

        return current_id, ifcPropertySingleValue, edge

    @staticmethod
    def getIfcLabel(nodes_name, wrappedValue, ifcSingleValue):
        ifcLabel = {
            "_key": f"IfcLabel-{str(uuid4())}",
            "name": "IfcLabel",
            "row": f"#{str(uuid4())}",
            "wrappedValue": wrappedValue
        }

        edge = {
            "_from": f"{nodes_name}/{ifcSingleValue['_key']}",
            "_to": f"{nodes_name}/{ifcLabel['_key']}",
            "rel_name": f"NominalValue"
        }

        return ifcLabel, edge

    @staticmethod
    def getIfcIdentifier(nodes_name, wrappedValue, ifcSingleValue):
        ifcIdentifier = {
            "_key": f"IfcIdentifier-{str(uuid4())}",
            "name": "IfcIdentifier",
            "row": f"#{str(uuid4())}",
            "wrappedValue": wrappedValue
        }

        edge = {
            "_from": f"{nodes_name}/{ifcSingleValue['_key']}",
            "_to": f"{nodes_name}/{ifcIdentifier['_key']}",
            "rel_name": f"NominalValue"
        }

        return ifcIdentifier, edge

    @staticmethod
    def getIfcProductDefinitionShape(nodes_name, current_id, ifc_sensor):
        current_id += 1

        ifcProductDefinitionShape = {
            "_key": f"IfcProductDefinitionShape-{current_id}",
            "name": "IfcProductDefinitionShape",
            "row": f"#{current_id}",
            "Name": None,
            "Description": None,
        }

        edge = {
            "_from": f"{nodes_name}/{ifc_sensor['_key']}",
            "_to": f"{nodes_name}/{ifcProductDefinitionShape['_key']}",
            "rel_name": f"Representation"
        }

        return current_id, ifcProductDefinitionShape, edge

    @staticmethod
    def getIfcLocalPlacement(nodes_name, current_id, ifc_sensor):
        current_id += 1

        ifcLocalPlacement = {
            "_key": f"IfcLocalPlacement-{current_id}",
            "name": "IfcLocalPlacement",
            "row": f"#{current_id}"
        }

        edge = {
            "_from": f"{nodes_name}/{ifcLocalPlacement['_key']}",
            "_to": f"{nodes_name}/{ifc_sensor['_key']}",
            "rel_name": f"ObjectPlacement"
        }

        return current_id, ifcLocalPlacement, edge

    @staticmethod
    def getIfcRepresentationMap(nodes_name, current_id, ifcSensorType):
        current_id += 1

        ifcRepresentationMap = {
            "_key": f"IfcRepresentationMap-{current_id}",
            "name": "IfcRepresentationMap",
            "row": f"#{current_id}"
        }

        edge = {
            "_from": f"{nodes_name}/{ifcSensorType['_key']}",
            "_to": f"{nodes_name}/{ifcRepresentationMap['_key']}",
            "rel_name": f"RepresentationMaps"
        }

        return current_id, ifcRepresentationMap, edge

    @staticmethod
    def getIfcAxis2Placement3D(nodes_name, current_id, ifcLocalPlacement, ifcRepresentationMap):
        current_id += 1

        ifcAxis2Placement3D = {
            "_key": f"IfcAxis2Placement3D-{current_id}",
            "name": "IfcAxis2Placement3D",
            "row": f"#{current_id}"
        }

        edge_placement = None
        edge_representation = None

        if ifcLocalPlacement:
            edge_placement = {
                "_from": f"{nodes_name}/{ifcLocalPlacement['_key']}",
                "_to": f"{nodes_name}/{ifcAxis2Placement3D['_key']}",
                "rel_name": f"RelativePlacement"
            }

        if ifcRepresentationMap:
            edge_representation = {
                "_from": f"{nodes_name}/{ifcRepresentationMap['_key']}",
                "_to": f"{nodes_name}/{ifcAxis2Placement3D['_key']}",
                "rel_name": f"MappingOrigin"
            }

        return current_id, ifcAxis2Placement3D, edge_placement, edge_representation

    @staticmethod
    def getIfcCartesianPoint(nodes_name, current_id, coordinates, ifcAxis2Placement3D):
        current_id += 1

        ifcCartesianPoint = {
            "_key": f"IfcCartesianPoint-{current_id}",
            "name": "IfcCartesianPoint",
            "row": f"#{current_id}",
            "Coordinates": coordinates
        }

        edge = {
            "_from": f"{nodes_name}/{ifcCartesianPoint['_key']}",
            "_to": f"{nodes_name}/{ifcAxis2Placement3D['_key']}",
            "rel_name": f"Location"
        }

        return current_id, ifcCartesianPoint, edge

    def insertSensor(self, nodes_name, edges_name, component_id, brandName, controlledProperty, manufacturerName,
                     modelName, name, description, coordinates):

        current_id = self.getRowNumber(nodes_name)
        ifcOwnerHistory = self.getIfcNodeFromName(nodes_name, "IfcOwnerHistory")
        ifcRelContainedInSpatialStructure = self.getIfcNodeFromName(nodes_name, "IfcRelContainedInSpatialStructure")

        nodes = []
        edges = []

        # TODO: Vedere se lasciare come ObjectType il modello del sensore
        # Create IfcSensor node and edge
        current_id, ifc_sensor, edge = self.getIfcSensor(
            nodes_name,
            current_id,
            name,
            description,
            modelName,
            None,
            controlledProperty,
            ifcOwnerHistory
        )
        nodes.append(ifc_sensor)
        edges.append(edge)

        # TODO: Vedere se implementare anche un metodo che crei un IfcRelConnectsElements
        #  (relazione tra gli oggetti: RelatingElement) per collegare il sensore
        #  ad un componente architettonico direttamente

        # Create IfcRelContainedInSpatialStructure edge
        edge = self.getIfcRelContainedInSpatialStructureEdge(nodes_name, ifc_sensor, ifcRelContainedInSpatialStructure)
        edges.append(edge)

        # Create IfcLocalPlacement node and edge
        current_id, ifcLocalPlacement, edge = self.getIfcLocalPlacement(nodes_name, current_id, ifc_sensor)
        nodes.append(ifcLocalPlacement)
        edges.append(edge)

        # Create IfcAxis2Placement3D node and edge
        current_id, ifcAxis2Placement3D, edge_placement, edge_representation = self.getIfcAxis2Placement3D(
            nodes_name,
            current_id,
            ifcLocalPlacement,
            None
        )
        nodes.append(ifcAxis2Placement3D)
        edge_placement and edges.append(edge_placement)
        edge_representation and edges.append(edge_representation)

        # Create IfcCartesianPoint node and edge
        current_id, ifcCartesianPoint, edge = self.getIfcCartesianPoint(
            nodes_name,
            current_id,
            coordinates,
            ifcAxis2Placement3D
        )
        nodes.append(ifcCartesianPoint)
        edges.append(edge)

        # Create IfcProductDefinitionShape node and edge
        current_id, ifcProductDefinitionShape, edge = self.getIfcProductDefinitionShape(
            nodes_name,
            current_id,
            ifc_sensor
        )
        nodes.append(ifcProductDefinitionShape)
        edges.append(edge)

        # Create IfcRelNests node and edge
        current_id, ifcRelNests, edge, edge_owner = self.getIfcRelNests(
            nodes_name,
            current_id,
            ifc_sensor,
            ifcOwnerHistory
        )
        nodes.append(ifcRelNests)
        edges.append(edge)
        edges.append(edge_owner)

        # TODO: Si potrebbe anche associare la posizione nel caso con
        #  IfcLocalPlacement -> IfcAxis2Placement3D -> IfcCartesianPoint se si conoscesse la posizione del cavo
        #  Potendo arricchire la definizione
        # Create IfcDistributionPort node and edge
        current_id, ifcDistributionPort, edge = self.getIfcDistributionPort(nodes_name, current_id, ifcRelNests)
        nodes.append(ifcDistributionPort)
        edges.append(edge)

        # Create IfcRelDefinesByType node and edge
        current_id, ifcRelDefinesByType, edge, edge_owner = self.getIfcRelDefinesByType(
            nodes_name,
            current_id,
            ifc_sensor,
            ifcOwnerHistory
        )
        nodes.append(ifcRelDefinesByType)
        edges.append(edge)
        edges.append(edge_owner)

        # Create IfcRelAssociatesMaterial node and edge
        current_id, ifcRelAssociatesMaterial, edge, edge_owner = self.getIfcRelAssociatesMaterial(
            nodes_name,
            current_id,
            ifc_sensor,
            ifcOwnerHistory
        )
        nodes.append(ifcRelAssociatesMaterial)
        edges.append(edge)
        edges.append(edge_owner)

        # TODO: Da capire se si vuole mettere veramente il materiale
        # Create IfcMaterial node and edge
        current_id, ifcMaterial, edge = self.getIfcMaterial(
            nodes_name,
            current_id,
            ifcRelAssociatesMaterial
        )
        nodes.append(ifcMaterial)
        edges.append(edge)

        # Create IfcSensorType node and edge
        current_id, ifcSensorType, edge_type, edge_material, edge_owner = self.getIfcSensorType(
            nodes_name,
            current_id,
            name,
            description,
            controlledProperty,
            ifcRelDefinesByType,
            ifcRelAssociatesMaterial,
            ifcOwnerHistory
        )
        nodes.append(ifcSensorType)
        edges.append(edge_type)
        edges.append(edge_material)
        edges.append(edge_owner)

        # Create IfcRepresentationMap node and edge
        current_id, ifcRepresentationMap, edge = self.getIfcRepresentationMap(nodes_name, current_id, ifcSensorType)
        nodes.append(ifcRepresentationMap)
        edges.append(edge)

        # Create IfcAxis2Placement3D node and edge
        current_id, ifcAxis2Placement3D, edge_placement, edge_representation = self.getIfcAxis2Placement3D(
            nodes_name,
            current_id,
            ifcLocalPlacement,
            ifcRepresentationMap
        )
        nodes.append(ifcAxis2Placement3D)
        edge_placement and edges.append(edge_placement)
        edge_representation and edges.append(edge_representation)

        # TODO: Le coordinate di questo cartesian point centrano con la geometria quindi non si sanno
        # Create IfcCartesianPoint node and edge
        current_id, ifcCartesianPoint, edge = self.getIfcCartesianPoint(
            nodes_name,
            current_id,
            [0, 0, 0],
            ifcAxis2Placement3D
        )
        nodes.append(ifcCartesianPoint)
        edges.append(edge)

        # Create IfcRelDefinesByProperties node and edge
        current_id, ifcRelDefinesByProperties, edge, edge_owner = self.getIfcRelDefinesByProperties(
            nodes_name,
            current_id,
            ifc_sensor,
            ifcOwnerHistory
        )
        nodes.append(ifcRelDefinesByProperties)
        edges.append(edge)
        edges.append(edge_owner)

        # Create IfcPropertySet node and edge
        current_id, ifcPropertySet, edge, edge_owner = self.getIfcPropertySet(
            nodes_name,
            current_id,
            "SensorTypeCommon",
            ifcRelDefinesByProperties,
            ifcOwnerHistory
        )
        nodes.append(ifcPropertySet)
        edges.append(edge)
        edges.append(edge_owner)

        # Create IfcPropertySingleValue node and edge
        current_id, ifcPropertySingleValue, edge = self.getIfcPropertySingleValue(
            nodes_name,
            current_id,
            "Reference",
            ifcPropertySet
        )
        nodes.append(ifcPropertySingleValue)
        edges.append(edge)

        # Create IfcIdentifier node and edge
        ifcIdentifier, edge = self.getIfcIdentifier(
            nodes_name,
            modelName,
            ifcPropertySingleValue
        )
        nodes.append(ifcIdentifier)
        edges.append(edge)

        # Create IfcRelDefinesByProperties node and edge
        current_id, ifcRelDefinesByProperties, edge, edge_owner = self.getIfcRelDefinesByProperties(
            nodes_name,
            current_id,
            ifc_sensor,
            ifcOwnerHistory
        )
        nodes.append(ifcRelDefinesByProperties)
        edges.append(edge)
        edges.append(edge_owner)

        # Create IfcPropertySet node and edge
        current_id, ifcPropertySet, edge, edge_owner = self.getIfcPropertySet(
            nodes_name,
            current_id,
            "EnvironmentalImpactIndicators",
            ifcRelDefinesByProperties,
            ifcOwnerHistory
        )
        nodes.append(ifcPropertySet)
        edges.append(edge)
        edges.append(edge_owner)

        # TODO: Forse sarebbe meglio tralasciare la Reference essendo ambigua e mettere se ritenuto comodo
        #  l'unità di misura del sensore Unit
        # Create IfcPropertySingleValue node and edge
        current_id, ifcPropertySingleValue, edge = self.getIfcPropertySingleValue(
            nodes_name,
            current_id,
            "Reference",
            ifcPropertySet
        )
        nodes.append(ifcPropertySingleValue)
        edges.append(edge)

        # Create IfcIdentifier node and edge
        ifcIdentifier, edge = self.getIfcIdentifier(
            nodes_name,
            modelName,
            ifcPropertySingleValue
        )
        nodes.append(ifcIdentifier)
        edges.append(edge)

        # Create IfcRelDefinesByProperties node and edge
        current_id, ifcRelDefinesByProperties, edge, edge_owner = self.getIfcRelDefinesByProperties(
            nodes_name,
            current_id,
            ifc_sensor,
            ifcOwnerHistory
        )
        nodes.append(ifcRelDefinesByProperties)
        edges.append(edge)

        # Create IfcPropertySet node and edge
        current_id, ifcPropertySet, edge, edge_owner = self.getIfcPropertySet(
            nodes_name,
            current_id,
            "ManufacturerTypeInformation",
            ifcRelDefinesByProperties,
            ifcOwnerHistory
        )
        nodes.append(ifcPropertySet)
        edges.append(edge)
        edges.append(edge_owner)

        # Create IfcPropertySingleValue node and edge
        current_id, ifcPropertySingleValue, edge = self.getIfcPropertySingleValue(
            nodes_name,
            current_id,
            "Manufacturer",
            ifcPropertySet
        )
        nodes.append(ifcPropertySingleValue)
        edges.append(edge)

        # Create IfcLabel node and edge
        ifcLabel, edge = self.getIfcLabel(
            nodes_name,
            manufacturerName,
            ifcPropertySingleValue
        )
        nodes.append(ifcLabel)
        edges.append(edge)

        # Create IfcPropertySingleValue node and edge
        current_id, ifcPropertySingleValue, edge = self.getIfcPropertySingleValue(
            nodes_name,
            current_id,
            "ModelLabel",
            ifcPropertySet
        )
        nodes.append(ifcPropertySingleValue)
        edges.append(edge)

        # Create IfcLabel node and edge
        ifcLabel, edge = self.getIfcLabel(
            nodes_name,
            modelName,
            ifcPropertySingleValue
        )
        nodes.append(ifcLabel)
        edges.append(edge)

        self.db[nodes_name].insert_many(nodes)
        self.db[edges_name].insert_many(edges)

    # Create the basic node with literal attributes and the class hierarchy
    # Input: ifc_entity - an instance, ifc_file - the parsed ifc-SPF
    # Output: basic nodes with properties for literal attributes and labels for ifc class hierarchy
    @staticmethod
    def create_pure_node_from_ifc_entity(ifc_entity):
        key = f"{ifc_entity.is_a()}-{str(ifc_entity.id() if ifc_entity.id() != 0 else uuid4())}"
        node = {'_key': key, 'name': ifc_entity.is_a(), 'row': f"#{ifc_entity.id()}"}
        attributes_type = ['ENTITY INSTANCE', 'AGGREGATE OF ENTITY INSTANCE', 'DERIVED']
        for i in range(ifc_entity.__len__()):
            if not ifc_entity.wrapped_data.get_argument_type(i) in attributes_type:
                name = ifc_entity.wrapped_data.get_argument_name(i)
                name_value = ifc_entity.wrapped_data.get_argument(i)
                node[name] = name_value
        return node

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

    @staticmethod
    def format_file_path(file_path):
        filename = file_path.rsplit('/', 1)[-1].split('.')[-2]

        # Remove special characters from the start
        filename = re.sub(r'^[^a-zA-Z0-9]+', '', filename)

        # Move leading numbers to the end
        match = re.match(r'^(\d+)(.*)', filename)
        if match:
            filename = f"{match.group(2)}{match.group(1)}"

        # Replace '-' with '_'
        filename = filename.replace('-', '_')

        # Remove spaces
        filename = filename.replace(' ', '')

        return filename

    def init_graph(self, file_path):
        self.existing_nodes = set()
        self.existing_edges = set()
        self.graph = None

        filename = self.format_file_path(file_path)

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

    """IFC MODEL EXPORT"""

    def extract_collections(self, nodes_name, edges_name):
        nodes_query = f"""
                FOR node IN {nodes_name}
                    LET numeric_key = TO_NUMBER(SPLIT(node._key, '-')[1])
                    SORT numeric_key
                    RETURN node
                """
        nodes = self.db.aql.execute(nodes_query)

        edges_query = f"""
                FOR edge IN {edges_name}
                    COLLECT from = edge._from, rel_name = edge.rel_name INTO groupedEdges
                    LET numeric_key = TO_NUMBER(SPLIT(from, '-')[1])
                    SORT numeric_key
                    RETURN {{
                        _from: from,
                        _to: groupedEdges[*].edge._to,
                        rel_type: rel_name
                    }}
                """
        edges = self.db.aql.execute(edges_query)

        return nodes, edges

    def process_value(self, entity_type, value):
        if value is None:
            return None
        elif isinstance(value, list):
            # Controllo se la lista contiene altre liste
            if all(isinstance(x, list) for x in value):
                return [self.process_value(entity_type, sublist) for sublist in value]
            # Controllo se la lista contiene solo int
            elif all(isinstance(x, int) for x in value):
                if entity_type == 'IfcCartesianPoint' or entity_type == 'IfcDirection':
                    return [float(x) for x in value]
                return [int(x) for x in value]
            # Controllo se la lista contiene solo float o una combinazione di int e float
            elif all(isinstance(x, (int, float)) for x in value):
                return [float(x) for x in value]
            else:
                return value
        else:
            return value

    def create_ifc_entity(self, ifc_file, node):
        entity_type = node['name']
        attributes = {key: value for key, value in node.items() if key not in ['_id', '_key', '_rev', 'name', 'row']}

        for key, value in attributes.items():
            attributes[key] = self.process_value(entity_type, value)

        attributes = {k: v for k, v in attributes.items() if v is not None}

        try:
            entity = ifc_file.create_entity(entity_type, **attributes)
            return entity
        except Exception as e:
            print(f"Error creating entity {entity_type} after conversion with attributes {attributes}: {e}")
            return None

    @staticmethod
    def create_ifc_relationship(edge, created_entities):
        from_key = edge['_from'].split('/')[-1]
        to_keys = [to.split('/')[-1] for to in edge['_to']]
        rel_name = edge['rel_type']

        if from_key in created_entities:
            relating_object = created_entities[from_key]
            related_objects = [created_entities[to_key] for to_key in to_keys if to_key in created_entities]

            """print("")
            print(f"{from_key} è presente in created_entities")
            print(f"Oggetto del from: {relating_object}")
            print(f"Oggetti che sono in relazione (_to): {related_objects}")
            print(f"Numero di related_objects: {len(related_objects)}")
            print(f"Numero di to_keys: {len(to_keys)}")
            print("")"""

            if len(related_objects) == len(to_keys):
                try:
                    value_to_set = related_objects[0] if len(related_objects) == 1 else related_objects
                    setattr(relating_object, rel_name, value_to_set)
                except Exception as single_exception:
                    try:
                        if len(related_objects) == 1:
                            setattr(relating_object, rel_name, related_objects)
                    except Exception as list_exception:
                        print(f"Error creating {rel_name} relationship with both single and list approach: {single_exception}, {list_exception}")
            else:
                missing_keys = [to_key for to_key in to_keys if to_key not in created_entities]
                print(f"Missing related objects for keys: {missing_keys}")

    def build_ifc_file(self, nodes_name, edges_name, output_file_path):
        ifc_file = ifcopenshell.file()
        nodes, edges = self.extract_collections(nodes_name, edges_name)

        created_entities = {}
        for node in nodes:
            ifc_entity = self.create_ifc_entity(ifc_file, node)
            if ifc_entity:
                created_entities[node['_key']] = ifc_entity

        for edge in edges:
            self.create_ifc_relationship(edge, created_entities)

        try:
            ifc_file.write(f"./app/src/{output_file_path}")
        except Exception as e:
            print(f"Error writing IFC file: {e}")

        print(f"IFC file written at: {output_file_path}")

        return output_file_path

    def export_ifc(self, filename):
        nodes_name = f"{filename}_nodes"
        edges_name = f"{filename}_edges"
        output_file_path = f"{filename}_exported.ifc"

        output_file_path = self.build_ifc_file(nodes_name, edges_name, output_file_path)
        print(f"IFC file created at: {output_file_path}")

        return output_file_path
