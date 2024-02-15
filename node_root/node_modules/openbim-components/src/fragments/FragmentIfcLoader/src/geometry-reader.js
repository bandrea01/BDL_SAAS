import * as THREE from "three";
export class GeometryReader {
    constructor() {
        this.saveLocations = false;
        this.items = {};
        this.locations = {};
        this.CivilItems = {
            IfcAlignment: [],
            IfcCrossSection2D: [],
            IfcCrossSection3D: [],
        };
    }
    get webIfc() {
        if (!this._webIfc) {
            throw new Error("web-ifc not found!");
        }
        return this._webIfc;
    }
    cleanUp() {
        this.items = {};
        this.locations = {};
        this._webIfc = null;
    }
    streamMesh(webifc, mesh, forceTransparent = false) {
        this._webIfc = webifc;
        const size = mesh.geometries.size();
        const totalTransform = new THREE.Vector3();
        const tempMatrix = new THREE.Matrix4();
        const tempVector = new THREE.Vector3();
        for (let i = 0; i < size; i++) {
            const geometry = mesh.geometries.get(i);
            const geometryID = geometry.geometryExpressID;
            if (this.saveLocations) {
                tempVector.set(0, 0, 0);
                tempMatrix.fromArray(geometry.flatTransformation);
                tempVector.applyMatrix4(tempMatrix);
                totalTransform.add(tempVector);
            }
            // Transparent geometries need to be separated
            const isColorTransparent = geometry.color.w !== 1;
            const isTransparent = isColorTransparent || forceTransparent;
            const prefix = isTransparent ? "-" : "+";
            const idWithTransparency = prefix + geometryID;
            if (forceTransparent)
                geometry.color.w = 0.1;
            if (!this.items[idWithTransparency]) {
                const buffer = this.newBufferGeometry(geometryID);
                if (!buffer)
                    continue;
                this.items[idWithTransparency] = { buffer, instances: [] };
            }
            this.items[idWithTransparency].instances.push({
                color: { ...geometry.color },
                matrix: geometry.flatTransformation,
                expressID: mesh.expressID,
            });
        }
        if (this.saveLocations) {
            const { x, y, z } = totalTransform.divideScalar(size);
            this.locations[mesh.expressID] = [x, y, z];
        }
    }
    streamAlignment(webifc) {
        this.CivilItems.IfcAlignment = webifc.GetAllAlignments(0);
    }
    streamCrossSection(webifc) {
        this.CivilItems.IfcCrossSection2D = webifc.GetAllCrossSections2D(0);
        this.CivilItems.IfcCrossSection3D = webifc.GetAllCrossSections3D(0);
    }
    newBufferGeometry(geometryID) {
        const geometry = this.webIfc.GetGeometry(0, geometryID);
        const verts = this.getVertices(geometry);
        if (!verts.length)
            return null;
        const indices = this.getIndices(geometry);
        if (!indices.length)
            return null;
        const buffer = this.constructBuffer(verts, indices);
        // @ts-ignore
        geometry.delete();
        return buffer;
    }
    getIndices(geometryData) {
        const indices = this.webIfc.GetIndexArray(geometryData.GetIndexData(), geometryData.GetIndexDataSize());
        return indices;
    }
    getVertices(geometryData) {
        const verts = this.webIfc.GetVertexArray(geometryData.GetVertexData(), geometryData.GetVertexDataSize());
        return verts;
    }
    constructBuffer(vertexData, indexData) {
        const geometry = new THREE.BufferGeometry();
        const posFloats = new Float32Array(vertexData.length / 2);
        const normFloats = new Float32Array(vertexData.length / 2);
        for (let i = 0; i < vertexData.length; i += 6) {
            posFloats[i / 2] = vertexData[i];
            posFloats[i / 2 + 1] = vertexData[i + 1];
            posFloats[i / 2 + 2] = vertexData[i + 2];
            normFloats[i / 2] = vertexData[i + 3];
            normFloats[i / 2 + 1] = vertexData[i + 4];
            normFloats[i / 2 + 2] = vertexData[i + 5];
        }
        geometry.setAttribute("position", new THREE.BufferAttribute(posFloats, 3));
        geometry.setAttribute("normal", new THREE.BufferAttribute(normFloats, 3));
        geometry.setIndex(new THREE.BufferAttribute(indexData, 1));
        return geometry;
    }
}
//# sourceMappingURL=geometry-reader.js.map