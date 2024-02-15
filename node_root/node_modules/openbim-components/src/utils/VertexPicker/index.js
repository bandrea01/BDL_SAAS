import * as THREE from "three";
import { Event } from "../../base-types/base-types";
import { Component } from "../../base-types/component";
import { Simple2DMarker } from "../../core/Simple2DMarker";
export class VertexPicker extends Component {
    set enabled(value) {
        this._enabled = value;
        if (!value) {
            this._marker.visible = false;
            this._pickedPoint = null;
        }
    }
    get enabled() {
        return this._enabled;
    }
    get _raycaster() {
        return this._components.raycaster;
    }
    constructor(components, config) {
        super(components);
        this.name = "VertexPicker";
        this.afterUpdate = new Event();
        this.beforeUpdate = new Event();
        this._pickedPoint = null;
        this._enabled = false;
        this._workingPlane = null;
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        this.update = () => {
            if (!this.enabled)
                return;
            this.beforeUpdate.trigger(this);
            const intersects = this._raycaster.castRay();
            if (!intersects) {
                this._marker.visible = false;
                this._pickedPoint = null;
                return;
            }
            const point = this.getClosestVertex(intersects);
            if (!point) {
                this._marker.visible = false;
                this._pickedPoint = null;
                return;
            }
            const isOnPlane = !this.workingPlane
                ? true
                : Math.abs(this.workingPlane.distanceToPoint(point)) < 0.001;
            if (!isOnPlane) {
                this._marker.visible = false;
                this._pickedPoint = null;
                return;
            }
            this._pickedPoint = point;
            this._marker.visible = true;
            this._marker
                .get()
                .position.set(this._pickedPoint.x, this._pickedPoint.y, this._pickedPoint.z);
            this.afterUpdate.trigger(this);
        };
        this._components = components;
        this.config = {
            snapDistance: 0.25,
            showOnlyVertex: false,
            ...config,
        };
        this._marker = new Simple2DMarker(components, this.config.previewElement);
        this._marker.visible = false;
        this.setupEvents(true);
        this.enabled = false;
    }
    set workingPlane(plane) {
        this._workingPlane = plane;
    }
    get workingPlane() {
        return this._workingPlane;
    }
    set config(value) {
        this._config = { ...this._config, ...value };
    }
    get config() {
        return this._config;
    }
    async dispose() {
        this.setupEvents(false);
        await this._marker.dispose();
        this.afterUpdate.reset();
        this.beforeUpdate.reset();
        this._components = null;
        await this.onDisposed.trigger();
        this.onDisposed.reset();
    }
    get() {
        return this._pickedPoint;
    }
    getClosestVertex(intersects) {
        let closestVertex = new THREE.Vector3();
        let vertexFound = false;
        let closestDistance = Number.MAX_SAFE_INTEGER;
        const vertices = this.getVertices(intersects);
        vertices === null || vertices === void 0 ? void 0 : vertices.forEach((vertex) => {
            if (!vertex)
                return;
            const distance = intersects.point.distanceTo(vertex);
            if (distance > closestDistance || distance > this._config.snapDistance)
                return;
            vertexFound = true;
            closestVertex = vertex;
            closestDistance = intersects.point.distanceTo(vertex);
        });
        if (vertexFound)
            return closestVertex;
        return this.config.showOnlyVertex ? null : intersects.point;
    }
    getVertices(intersects) {
        const mesh = intersects.object;
        if (!intersects.face || !mesh)
            return null;
        const geom = mesh.geometry;
        return [
            this.getVertex(intersects.face.a, geom),
            this.getVertex(intersects.face.b, geom),
            this.getVertex(intersects.face.c, geom),
        ].map((vertex) => vertex === null || vertex === void 0 ? void 0 : vertex.applyMatrix4(mesh.matrixWorld));
    }
    getVertex(index, geom) {
        if (index === undefined)
            return null;
        const vertices = geom.attributes.position;
        return new THREE.Vector3(vertices.getX(index), vertices.getY(index), vertices.getZ(index));
    }
    setupEvents(active) {
        const container = this.components.renderer.get().domElement.parentElement;
        if (!container)
            return;
        if (active) {
            container.addEventListener("mousemove", this.update);
        }
        else {
            container.removeEventListener("mousemove", this.update);
        }
    }
}
//# sourceMappingURL=index.js.map