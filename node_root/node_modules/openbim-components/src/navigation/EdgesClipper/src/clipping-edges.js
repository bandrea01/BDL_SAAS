import * as THREE from "three";
import { FragmentMesh } from "bim-fragment";
import { Component, Event, } from "../../../base-types";
import { Disposer } from "../../../core";
import { ClippingFills } from "./clipping-fills";
import { PostproductionRenderer } from "../../PostproductionRenderer";
/**
 * The edges that are drawn when the {@link EdgesPlane} sections a mesh.
 */
export class ClippingEdges extends Component {
    /** {@link Hideable.visible} */
    get visible() {
        return this._visible;
    }
    get fillVisible() {
        for (const name in this._edges) {
            const edges = this._edges[name];
            if (edges.fill) {
                return edges.fill.visible;
            }
        }
        return false;
    }
    set fillVisible(visible) {
        for (const name in this._edges) {
            const edges = this._edges[name];
            if (edges.fill) {
                edges.fill.visible = visible;
            }
        }
    }
    constructor(components, plane, styles) {
        super(components);
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        /** {@link Updateable.onAfterUpdate} */
        this.onAfterUpdate = new Event();
        /** {@link Updateable.onBeforeUpdate} */
        this.onBeforeUpdate = new Event();
        /** {@link Component.name} */
        this.name = "ClippingEdges";
        /** {@link Component.enabled}. */
        this.enabled = true;
        this.fillNeedsUpdate = false;
        this.blockByIndex = {};
        this._edges = {};
        this._visible = true;
        this._inverseMatrix = new THREE.Matrix4();
        this._localPlane = new THREE.Plane();
        this._tempLine = new THREE.Line3();
        this._tempVector = new THREE.Vector3();
        this._plane = plane;
        this._styles = styles;
    }
    async setVisible(visible) {
        this._visible = visible;
        const names = Object.keys(this._edges);
        for (const edgeName of names) {
            this.updateEdgesVisibility(edgeName, visible);
        }
        if (visible) {
            await this.update();
        }
    }
    /** {@link Updateable.update} */
    async update() {
        const styles = this._styles.get();
        await this.updateDeletedEdges(styles);
        for (const name in styles) {
            this.drawEdges(name);
        }
        this.fillNeedsUpdate = false;
    }
    /** {@link Component.get} */
    get() {
        return this._edges;
    }
    /** {@link Disposable.dispose} */
    async dispose() {
        const names = Object.keys(this._edges);
        for (const name of names) {
            this.disposeEdge(name);
        }
        await this.onDisposed.trigger();
        this.onDisposed.reset();
    }
    newEdgesMesh(styleName) {
        const styles = this._styles.get();
        const material = styles[styleName].lineMaterial;
        const edgesGeometry = new THREE.BufferGeometry();
        const buffer = new Float32Array(300000);
        const linePosAttr = new THREE.BufferAttribute(buffer, 3, false);
        linePosAttr.setUsage(THREE.DynamicDrawUsage);
        edgesGeometry.setAttribute("position", linePosAttr);
        const lines = new THREE.LineSegments(edgesGeometry, material);
        lines.frustumCulled = false;
        return lines;
    }
    newFillMesh(name, geometry) {
        const styles = this._styles.get();
        const style = styles[name];
        const fillMaterial = style.fillMaterial;
        if (fillMaterial) {
            const fills = new ClippingFills(this.components, this._plane, geometry, fillMaterial);
            this.newFillOutline(name, fills, style);
            return fills;
        }
        return undefined;
    }
    newFillOutline(name, fills, style) {
        if (!style.outlineMaterial)
            return;
        const renderer = this.components.renderer;
        if (renderer instanceof PostproductionRenderer) {
            const pRenderer = renderer;
            const outlines = pRenderer.postproduction.customEffects.outlinedMeshes;
            if (!outlines[name]) {
                outlines[name] = {
                    meshes: new Set(),
                    material: style.outlineMaterial,
                };
            }
            fills.styleName = name;
        }
    }
    // Source: https://gkjohnson.github.io/three-mesh-bvh/example/bundle/clippedEdges.html
    drawEdges(styleName) {
        this.blockByIndex = {};
        const style = this._styles.get()[styleName];
        if (!this._edges[styleName]) {
            this.initializeStyle(styleName);
        }
        const edges = this._edges[styleName];
        let index = 0;
        const posAttr = edges.mesh.geometry.attributes.position;
        // @ts-ignore
        posAttr.array.fill(0);
        const indexes = [];
        let lastIndex = 0;
        for (const mesh of style.meshes) {
            if (!mesh.geometry) {
                continue;
            }
            if (!mesh.geometry.boundsTree) {
                throw new Error("Boundstree not found for clipping edges subset.");
            }
            const instanced = mesh;
            if (instanced.count === 0) {
                continue;
            }
            if (instanced.count > 1) {
                for (let i = 0; i < instanced.count; i++) {
                    // Exclude fragment instances that don't belong to this style
                    const isFragment = instanced instanceof FragmentMesh;
                    const fMesh = instanced;
                    const ids = style.fragments[fMesh.fragment.id];
                    if (isFragment && ids) {
                        const itemID = fMesh.fragment.items[i];
                        if (!ids.has(itemID)) {
                            continue;
                        }
                    }
                    const tempMesh = new THREE.Mesh(mesh.geometry);
                    tempMesh.matrix.copy(mesh.matrix);
                    const tempMatrix = new THREE.Matrix4();
                    instanced.getMatrixAt(i, tempMatrix);
                    tempMesh.applyMatrix4(tempMatrix);
                    tempMesh.applyMatrix4(mesh.matrix);
                    tempMesh.updateMatrix();
                    tempMesh.updateMatrixWorld();
                    this._inverseMatrix.copy(tempMesh.matrixWorld).invert();
                    this._localPlane.copy(this._plane).applyMatrix4(this._inverseMatrix);
                    index = this.shapecast(tempMesh, posAttr, index, style);
                    if (index !== lastIndex) {
                        indexes.push(index);
                        lastIndex = index;
                    }
                }
            }
            else {
                this._inverseMatrix.copy(mesh.matrixWorld).invert();
                this._localPlane.copy(this._plane).applyMatrix4(this._inverseMatrix);
                const isFragment = mesh instanceof FragmentMesh;
                index = this.shapecast(mesh, posAttr, index, style, isFragment);
                if (index !== lastIndex) {
                    indexes.push(index);
                    lastIndex = index;
                }
            }
        }
        // set the draw range to only the new segments and offset the lines so they don't intersect with the geometry
        edges.mesh.geometry.setDrawRange(0, index);
        edges.mesh.position.copy(this._plane.normal).multiplyScalar(0.0001);
        posAttr.needsUpdate = true;
        // Update the edges geometry only if there is no NaN in the output (which means there's been an error)
        const attributes = edges.mesh.geometry.attributes;
        const position = attributes.position;
        if (!Number.isNaN(position.array[0])) {
            const scene = this.components.scene.get();
            scene.add(edges.mesh);
            if (this.fillNeedsUpdate && edges.fill) {
                edges.fill.geometry = edges.mesh.geometry;
                edges.fill.update(indexes, this.blockByIndex);
            }
        }
    }
    initializeStyle(name) {
        const mesh = this.newEdgesMesh(name);
        const geometry = mesh.geometry;
        const fill = this.newFillMesh(name, geometry);
        this._edges[name] = { mesh, name, fill };
    }
    shapecast(mesh, posAttr, index, style, isMultiblockFragment = false) {
        // @ts-ignore
        mesh.geometry.boundsTree.shapecast({
            intersectsBounds: (box) => {
                return this._localPlane.intersectsBox(box);
            },
            // @ts-ignore
            intersectsTriangle: (tri, triangleIndex) => {
                // Exclude triangles of fragment items that don't belong to this style
                if (isMultiblockFragment && style.fragments) {
                    const fMesh = mesh;
                    const ids = style.fragments[fMesh.fragment.id];
                    if (ids !== undefined) {
                        const index = fMesh.geometry.index.array[triangleIndex * 3];
                        const blockID = fMesh.geometry.attributes.blockID.array[index];
                        const id = fMesh.fragment.getItemID(0, blockID);
                        if (!ids.has(id)) {
                            return;
                        }
                    }
                }
                // check each triangle edge to see if it intersects with the plane. If so then
                // add it to the list of segments.
                let count = 0;
                this._tempLine.start.copy(tri.a);
                this._tempLine.end.copy(tri.b);
                if (this._localPlane.intersectLine(this._tempLine, this._tempVector)) {
                    const result = this._tempVector.applyMatrix4(mesh.matrixWorld);
                    posAttr.setXYZ(index, result.x, result.y, result.z);
                    count++;
                    index++;
                }
                this._tempLine.start.copy(tri.b);
                this._tempLine.end.copy(tri.c);
                if (this._localPlane.intersectLine(this._tempLine, this._tempVector)) {
                    const result = this._tempVector.applyMatrix4(mesh.matrixWorld);
                    posAttr.setXYZ(index, result.x, result.y, result.z);
                    count++;
                    index++;
                }
                this._tempLine.start.copy(tri.c);
                this._tempLine.end.copy(tri.a);
                if (this._localPlane.intersectLine(this._tempLine, this._tempVector)) {
                    const result = this._tempVector.applyMatrix4(mesh.matrixWorld);
                    posAttr.setXYZ(index, result.x, result.y, result.z);
                    count++;
                    index++;
                }
                // If we only intersected with one or three sides then just remove it. This could be handled
                // more gracefully.
                if (count !== 2) {
                    index -= count;
                }
                if (count === 2 && isMultiblockFragment) {
                    const fMesh = mesh;
                    const vertexIndex = fMesh.geometry.index.array[triangleIndex * 3];
                    const block = fMesh.geometry.attributes.blockID.array[vertexIndex];
                    this.blockByIndex[index - 2] = block;
                }
            },
        });
        return index;
    }
    updateEdgesVisibility(edgeName, visible) {
        const edges = this._edges[edgeName];
        if (edges.fill) {
            edges.fill.visible = visible;
        }
        edges.mesh.visible = visible;
        if (visible) {
            const scene = this.components.scene.get();
            scene.add(edges.mesh);
        }
        else {
            edges.mesh.removeFromParent();
        }
    }
    async updateDeletedEdges(styles) {
        const names = Object.keys(this._edges);
        for (const name of names) {
            if (styles[name] === undefined) {
                await this.disposeEdge(name);
                this.disposeOutline(name);
            }
        }
    }
    disposeOutline(name) {
        const renderer = this.components.renderer;
        if (renderer instanceof PostproductionRenderer) {
            const outlines = renderer.postproduction.customEffects.outlinedMeshes;
            delete outlines[name];
        }
    }
    disposeEdge(name) {
        const disposer = this.components.tools.get(Disposer);
        const edge = this._edges[name];
        if (edge.fill) {
            edge.fill.dispose();
        }
        disposer.destroy(edge.mesh, false);
        delete this._edges[name];
    }
}
//# sourceMappingURL=clipping-edges.js.map