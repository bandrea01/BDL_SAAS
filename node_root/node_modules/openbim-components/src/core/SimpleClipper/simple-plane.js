import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { Component, Event } from "../../base-types";
/**
 * Each of the planes created by {@link SimpleClipper}.
 */
export class SimplePlane extends Component {
    /** {@link Component.enabled} */
    get enabled() {
        return this._enabled;
    }
    /** {@link Component.enabled} */
    set enabled(state) {
        this._enabled = state;
        this.components.renderer.togglePlane(state, this._plane);
    }
    /** {@link Hideable.visible } */
    get visible() {
        return this._visible;
    }
    /** {@link Hideable.visible } */
    set visible(state) {
        this._visible = state;
        this._controls.visible = state;
        this._helper.visible = state;
        this.toggleControls(state);
    }
    /** The meshes used for raycasting */
    get meshes() {
        return [this._planeMesh, this._arrowBoundBox];
    }
    /** The material of the clipping plane representation. */
    get planeMaterial() {
        return this._planeMesh.material;
    }
    /** The material of the clipping plane representation. */
    set planeMaterial(material) {
        this._planeMesh.material = material;
    }
    /** The size of the clipping plane representation. */
    get size() {
        return this._planeMesh.scale.x;
    }
    /** Sets the size of the clipping plane representation. */
    set size(size) {
        this._planeMesh.scale.set(size, size, size);
    }
    constructor(components, origin, normal, material, size = 5, activateControls = true) {
        super(components);
        /** {@link Component.name} */
        this.name = "SimplePlane";
        /** Event that fires when the user starts dragging a clipping plane. */
        this.onDraggingStarted = new Event();
        /** Event that fires when the user stops dragging a clipping plane. */
        this.onDraggingEnded = new Event();
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        this._plane = new THREE.Plane();
        // TODO: Make all planes share the same geometry
        // TODO: Clean up unnecessary attributes, clean up constructor
        this._visible = true;
        this._enabled = true;
        this._controlsActive = false;
        this._arrowBoundBox = new THREE.Mesh();
        this._hiddenMaterial = new THREE.MeshBasicMaterial({
            visible: false,
        });
        /** {@link Updateable.update} */
        this.update = () => {
            if (!this._enabled)
                return;
            this._plane.setFromNormalAndCoplanarPoint(this.normal, this._helper.position);
        };
        this.changeDrag = (event) => {
            this._visible = !event.value;
            this.preventCameraMovement();
            this.notifyDraggingChanged(event);
        };
        this.normal = normal;
        this.origin = origin;
        this.components.renderer.togglePlane(true, this._plane);
        this._planeMesh = SimplePlane.newPlaneMesh(size, material);
        this._helper = this.newHelper();
        this._controls = this.newTransformControls();
        this._plane.setFromNormalAndCoplanarPoint(normal, origin);
        if (activateControls) {
            this.toggleControls(true);
        }
    }
    setFromNormalAndCoplanarPoint(normal, point) {
        this.normal.copy(normal);
        this.origin.copy(point);
        this._helper.lookAt(normal);
        this._helper.position.copy(point);
        this._helper.updateMatrix();
        this.update();
    }
    /** {@link Component.get} */
    get() {
        return this._plane;
    }
    /** {@link Disposable.dispose} */
    async dispose() {
        this._enabled = false;
        this.onDraggingStarted.reset();
        this.onDraggingEnded.reset();
        this._helper.removeFromParent();
        this.components.renderer.togglePlane(false, this._plane);
        this._arrowBoundBox.removeFromParent();
        this._arrowBoundBox.geometry.dispose();
        this._planeMesh.geometry.dispose();
        this._controls.removeFromParent();
        this._controls.dispose();
        await this.onDisposed.trigger();
        this.onDisposed.reset();
    }
    toggleControls(state) {
        if (state) {
            if (this._controlsActive)
                return;
            this._controls.addEventListener("change", this.update);
            this._controls.addEventListener("dragging-changed", this.changeDrag);
        }
        else {
            this._controls.removeEventListener("change", this.update);
            this._controls.removeEventListener("dragging-changed", this.changeDrag);
        }
        this._controlsActive = state;
    }
    newTransformControls() {
        const camera = this.components.camera.get();
        const container = this.components.renderer.get().domElement;
        const controls = new TransformControls(camera, container);
        this.initializeControls(controls);
        this.components.scene.get().add(controls);
        return controls;
    }
    initializeControls(controls) {
        controls.attach(this._helper);
        controls.showX = false;
        controls.showY = false;
        controls.setSpace("local");
        this.createArrowBoundingBox();
        controls.children[0].children[0].add(this._arrowBoundBox);
    }
    createArrowBoundingBox() {
        this._arrowBoundBox.geometry = new THREE.CylinderGeometry(0.18, 0.18, 1.2);
        this._arrowBoundBox.material = this._hiddenMaterial;
        this._arrowBoundBox.rotateX(Math.PI / 2);
        this._arrowBoundBox.updateMatrix();
        this._arrowBoundBox.geometry.applyMatrix4(this._arrowBoundBox.matrix);
    }
    notifyDraggingChanged(event) {
        if (event.value) {
            this.onDraggingStarted.trigger();
        }
        else {
            this.onDraggingEnded.trigger();
        }
    }
    preventCameraMovement() {
        this.components.camera.enabled = this._visible;
    }
    newHelper() {
        const helper = new THREE.Object3D();
        helper.lookAt(this.normal);
        helper.position.copy(this.origin);
        this._planeMesh.position.z += 0.01;
        helper.add(this._planeMesh);
        this.components.scene.get().add(helper);
        return helper;
    }
    static newPlaneMesh(size, material) {
        const planeGeom = new THREE.PlaneGeometry(1);
        const mesh = new THREE.Mesh(planeGeom, material);
        mesh.scale.set(size, size, size);
        return mesh;
    }
}
//# sourceMappingURL=simple-plane.js.map