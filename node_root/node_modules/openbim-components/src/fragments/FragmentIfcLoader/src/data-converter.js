import * as THREE from "three";
import * as WEBIFC from "web-ifc";
import * as FRAGS from "bim-fragment";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import { IfcAlignmentData } from "bim-fragment";
import { IfcCategories } from "../../../ifc/ifc-categories";
import { IfcJsonExporter } from "../../../ifc/IfcJsonExporter";
import { SpatialStructure } from "./spatial-structure";
import { IfcFragmentSettings } from "./ifc-fragment-settings";
import { toCompositeID } from "../../../utils";
import { FragmentBoundingBox } from "../../FragmentBoundingBox";
export class DataConverter {
    constructor(components) {
        this.settings = new IfcFragmentSettings();
        this.categories = {};
        this._model = new FRAGS.FragmentsGroup();
        this._ifcCategories = new IfcCategories();
        this._fragmentKey = 0;
        this._keyFragmentMap = {};
        this._itemKeyMap = {};
        this._propertyExporter = new IfcJsonExporter();
        this._spatialTree = new SpatialStructure();
        this.components = components;
    }
    cleanUp() {
        this._fragmentKey = 0;
        this._spatialTree.cleanUp();
        this.categories = {};
        this._model = new FRAGS.FragmentsGroup();
        this._ifcCategories = new IfcCategories();
        this._propertyExporter = new IfcJsonExporter();
        this._keyFragmentMap = {};
        this._itemKeyMap = {};
    }
    saveIfcCategories(webIfc) {
        this.categories = this._ifcCategories.getAll(webIfc, 0);
    }
    async generate(webIfc, geometries, civilItems) {
        await this._spatialTree.setUp(webIfc);
        this.createAllFragments(geometries, civilItems);
        await this.saveModelData(webIfc);
        return this._model;
    }
    async saveModelData(webIfc) {
        const itemsData = this.getFragmentsGroupData();
        this._model.keyFragments = this._keyFragmentMap;
        this._model.data = itemsData;
        this._model.coordinationMatrix = this.getCoordinationMatrix(webIfc);
        this._model.properties = await this.getModelProperties(webIfc);
        this._model.uuid = this.getProjectID(webIfc) || this._model.uuid;
        this._model.ifcMetadata = this.getIfcMetadata(webIfc);
        this._model.boundingBox = await this.getBoundingBox();
    }
    async getBoundingBox() {
        const bbox = await this.components.tools.get(FragmentBoundingBox);
        bbox.reset();
        bbox.add(this._model);
        return bbox.get();
    }
    getIfcMetadata(webIfc) {
        const { FILE_NAME, FILE_DESCRIPTION } = WEBIFC;
        const name = this.getMetadataEntry(webIfc, FILE_NAME);
        const description = this.getMetadataEntry(webIfc, FILE_DESCRIPTION);
        const schema = webIfc.GetModelSchema(0) || "IFC2X3";
        const maxExpressID = webIfc.GetMaxExpressID(0);
        return { name, description, schema, maxExpressID };
    }
    getMetadataEntry(webIfc, type) {
        let description = "";
        const descriptionData = webIfc.GetHeaderLine(0, type) || "";
        if (!descriptionData)
            return description;
        for (const arg of descriptionData.arguments) {
            if (arg === null || arg === undefined) {
                continue;
            }
            if (Array.isArray(arg)) {
                for (const subArg of arg) {
                    if (!subArg)
                        continue;
                    description += `${subArg.value}|`;
                }
            }
            else {
                description += `${arg.value}|`;
            }
        }
        return description;
    }
    getProjectID(webIfc) {
        const projectsIDs = webIfc.GetLineIDsWithType(0, WEBIFC.IFCPROJECT);
        const projectID = projectsIDs.get(0);
        const project = webIfc.GetLine(0, projectID);
        return project.GlobalId.value;
    }
    getCoordinationMatrix(webIfc) {
        const coordArray = webIfc.GetCoordinationMatrix(0);
        return new THREE.Matrix4().fromArray(coordArray);
    }
    async getModelProperties(webIfc) {
        if (!this.settings.includeProperties) {
            return {};
        }
        return new Promise((resolve) => {
            this._propertyExporter.onPropertiesSerialized.add((properties) => {
                resolve(properties);
            });
            this._propertyExporter.export(webIfc, 0);
        });
    }
    createAllFragments(geometries, civilItems) {
        const uniqueItems = {};
        const matrix = new THREE.Matrix4();
        const color = new THREE.Color();
        // Add alignments data
        if (civilItems.IfcAlignment) {
            const horizontalAlignments = new IfcAlignmentData();
            const verticalAlignments = new IfcAlignmentData();
            const realAlignments = new IfcAlignmentData();
            let countH = 0;
            let countV = 0;
            let countR = 0;
            const valuesH = [];
            const valuesV = [];
            const valuesR = [];
            for (const alignment of civilItems.IfcAlignment) {
                horizontalAlignments.alignmentIndex.push(countH);
                verticalAlignments.alignmentIndex.push(countV);
                if (alignment.horizontal) {
                    for (const hAlignment of alignment.horizontal) {
                        horizontalAlignments.curveIndex.push(countH);
                        for (const point of hAlignment.points) {
                            valuesH.push(point.x);
                            valuesH.push(point.y);
                            countH++;
                        }
                    }
                }
                if (alignment.vertical) {
                    for (const vAlignment of alignment.vertical) {
                        verticalAlignments.curveIndex.push(countV);
                        for (const point of vAlignment.points) {
                            valuesV.push(point.x);
                            valuesV.push(point.y);
                            countV++;
                        }
                    }
                }
                if (alignment.curve3D) {
                    for (const rAlignment of alignment.curve3D) {
                        realAlignments.curveIndex.push(countR);
                        for (const point of rAlignment.points) {
                            valuesR.push(point.x);
                            valuesR.push(point.y);
                            valuesR.push(point.z);
                            countR++;
                        }
                    }
                }
            }
            horizontalAlignments.coordinates = new Float32Array(valuesH);
            verticalAlignments.coordinates = new Float32Array(valuesV);
            realAlignments.coordinates = new Float32Array(valuesR);
            this._model.ifcCivil = {
                horizontalAlignments,
                verticalAlignments,
                realAlignments,
            };
        }
        for (const id in geometries) {
            const { buffer, instances } = geometries[id];
            const transparent = instances[0].color.w !== 1;
            const opacity = transparent ? 0.4 : 1;
            const material = new THREE.MeshLambertMaterial({ transparent, opacity });
            // This prevents z-fighting for ifc spaces
            if (opacity !== 1) {
                material.depthWrite = false;
                material.polygonOffset = true;
                material.polygonOffsetFactor = 5;
                material.polygonOffsetUnits = 1;
            }
            if (instances.length === 1) {
                const instance = instances[0];
                const { x, y, z, w } = instance.color;
                const matID = `${x}-${y}-${z}-${w}`;
                if (!uniqueItems[matID]) {
                    material.color = new THREE.Color().setRGB(x, y, z, "srgb");
                    uniqueItems[matID] = { material, geometries: [], expressIDs: [] };
                }
                matrix.fromArray(instance.matrix);
                buffer.applyMatrix4(matrix);
                uniqueItems[matID].geometries.push(buffer);
                uniqueItems[matID].expressIDs.push(instance.expressID.toString());
                continue;
            }
            const fragment = new FRAGS.Fragment(buffer, material, instances.length);
            this._keyFragmentMap[this._fragmentKey] = fragment.id;
            const previousIDs = new Set();
            for (let i = 0; i < instances.length; i++) {
                const instance = instances[i];
                matrix.fromArray(instance.matrix);
                const { expressID } = instance;
                let instanceID = expressID.toString();
                let isComposite = false;
                if (!previousIDs.has(expressID)) {
                    previousIDs.add(expressID);
                }
                else {
                    if (!fragment.composites[expressID]) {
                        fragment.composites[expressID] = 1;
                    }
                    const count = fragment.composites[expressID];
                    instanceID = toCompositeID(expressID, count);
                    isComposite = true;
                    fragment.composites[expressID]++;
                }
                fragment.setInstance(i, {
                    ids: [instanceID],
                    transform: matrix,
                });
                const { x, y, z } = instance.color;
                color.setRGB(x, y, z, "srgb");
                fragment.mesh.setColorAt(i, color);
                if (!isComposite) {
                    this.saveExpressID(expressID.toString());
                }
            }
            fragment.mesh.updateMatrix();
            this._model.items.push(fragment);
            this._model.add(fragment.mesh);
            this._fragmentKey++;
        }
        const transform = new THREE.Matrix4();
        for (const matID in uniqueItems) {
            const { material, geometries, expressIDs } = uniqueItems[matID];
            const geometriesByItem = {};
            for (let i = 0; i < expressIDs.length; i++) {
                const id = expressIDs[i];
                if (!geometriesByItem[id]) {
                    geometriesByItem[id] = [];
                }
                geometriesByItem[id].push(geometries[i]);
            }
            const sortedGeometries = [];
            const sortedIDs = [];
            for (const id in geometriesByItem) {
                sortedIDs.push(id);
                const geometries = geometriesByItem[id];
                if (geometries.length) {
                    const merged = mergeGeometries(geometries);
                    sortedGeometries.push(merged);
                }
                else {
                    sortedGeometries.push(geometries[0]);
                }
                for (const geometry of geometries) {
                    geometry.dispose();
                }
            }
            const geometry = FRAGS.GeometryUtils.merge([sortedGeometries], true);
            const fragment = new FRAGS.Fragment(geometry, material, 1);
            this._keyFragmentMap[this._fragmentKey] = fragment.id;
            for (const id of sortedIDs) {
                this.saveExpressID(id);
            }
            this._fragmentKey++;
            fragment.setInstance(0, { ids: sortedIDs, transform });
            this._model.items.push(fragment);
            this._model.add(fragment.mesh);
        }
    }
    saveExpressID(expressID) {
        if (!this._itemKeyMap[expressID]) {
            this._itemKeyMap[expressID] = [];
        }
        this._itemKeyMap[expressID].push(this._fragmentKey);
    }
    getFragmentsGroupData() {
        const itemsData = {};
        for (const id in this._itemKeyMap) {
            const keys = [];
            const rels = [];
            const idNum = parseInt(id, 10);
            const level = this._spatialTree.itemsByFloor[idNum] || 0;
            const category = this.categories[idNum] || 0;
            rels.push(level, category);
            for (const key of this._itemKeyMap[id]) {
                keys.push(key);
            }
            itemsData[idNum] = [keys, rels];
        }
        return itemsData;
    }
}
//# sourceMappingURL=data-converter.js.map