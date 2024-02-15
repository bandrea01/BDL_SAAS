import * as THREE from "three";
import { Event, Component, UIElement, } from "../../base-types";
import { Simple2DMarker, ToolComponent } from "../../core";
import { Button } from "../../ui";
import { DimensionLabelClassName } from "../SimpleDimensionLine";
import { FragmentBoundingBox } from "../../fragments";
// TODO: Make it work more similar to face measure?
export class VolumeMeasurement extends Component {
    set enabled(value) {
        this._enabled = value;
        if (this.components.uiEnabled) {
            const main = this.uiElement.get("main");
            main.active = value;
        }
        this.setupEvents(value);
        if (!value) {
            this.cancelCreation();
        }
    }
    get enabled() {
        return this._enabled;
    }
    constructor(components) {
        super(components);
        this.uiElement = new UIElement();
        this._enabled = false;
        this.onBeforeCreate = new Event();
        this.onAfterCreate = new Event();
        this.onBeforeCancel = new Event();
        this.onAfterCancel = new Event();
        this.onBeforeDelete = new Event();
        this.onAfterDelete = new Event();
        this.onDisposed = new Event();
        this.create = () => {
            if (!this.enabled)
                return;
            const result = this.components.raycaster.castRay();
            if (!result || !result.object)
                return;
            const { object } = result;
            if (object instanceof THREE.Mesh) {
                const volume = this.getVolumeOfMesh(object);
                console.log(volume);
            }
        };
        this.onMouseMove = () => { };
        this.onKeydown = (_e) => { };
        this.components.tools.add(VolumeMeasurement.uuid, this);
        this.label = this.newLabel();
        this.label.get().removeFromParent();
        if (components.uiEnabled) {
            this.setUI();
        }
    }
    async dispose() {
        this.setupEvents(false);
        await this.label.dispose();
        this.onBeforeCreate.reset();
        this.onAfterCreate.reset();
        this.onBeforeCancel.reset();
        this.onAfterCancel.reset();
        this.onBeforeDelete.reset();
        this.onAfterDelete.reset();
        await this.uiElement.dispose();
        await this.onDisposed.trigger();
        this.onDisposed.reset();
        this.components = null;
    }
    setUI() {
        const main = new Button(this.components);
        main.materialIcon = "check_box_outline_blank";
        main.onClick.add(() => {
            if (!this.enabled) {
                main.active = true;
                this.enabled = true;
            }
            else {
                this.enabled = false;
                main.active = false;
            }
        });
        this.uiElement.set({ main });
    }
    delete() { }
    /** Deletes all the dimensions that have been previously created. */
    async deleteAll() { }
    endCreation() { }
    cancelCreation() { }
    get() { }
    getVolumeFromMeshes(meshes) {
        let volume = 0;
        for (const mesh of meshes) {
            volume += this.getVolumeOfMesh(mesh);
        }
        const scene = this.components.scene.get();
        const labelObject = this.label.get();
        scene.add(labelObject);
        const bbox = this.components.tools.get(FragmentBoundingBox);
        for (const mesh of meshes) {
            mesh.geometry.computeBoundingSphere();
            bbox.addMesh(mesh);
        }
        const sphere = bbox.getSphere();
        bbox.reset();
        labelObject.position.copy(sphere.center);
        const formattedVolume = Math.trunc(volume * 100) / 100;
        labelObject.element.textContent = formattedVolume.toString();
        return volume;
    }
    newLabel() {
        const htmlText = document.createElement("div");
        htmlText.className = DimensionLabelClassName;
        return new Simple2DMarker(this.components, htmlText);
    }
    setupEvents(active) {
        const viewerContainer = this.components.ui.viewerContainer;
        if (active) {
            viewerContainer.addEventListener("click", this.create);
            viewerContainer.addEventListener("mousemove", this.onMouseMove);
            window.addEventListener("keydown", this.onKeydown);
        }
        else {
            viewerContainer.removeEventListener("click", this.create);
            viewerContainer.removeEventListener("mousemove", this.onMouseMove);
            window.removeEventListener("keydown", this.onKeydown);
        }
    }
    // https://stackoverflow.com/a/1568551
    getVolumeOfMesh(mesh) {
        let volume = 0;
        const p1 = new THREE.Vector3();
        const p2 = new THREE.Vector3();
        const p3 = new THREE.Vector3();
        const { index } = mesh.geometry;
        const pos = mesh.geometry.attributes.position.array;
        if (!index) {
            console.warn("Geometry must be indexed to compute its volume!");
            return 0;
        }
        // prettier-ignore
        const instances = [];
        if (mesh instanceof THREE.InstancedMesh) {
            for (let i = 0; i < mesh.count; i++) {
                const matrix = new THREE.Matrix4();
                mesh.getMatrixAt(i, matrix);
                instances.push(matrix);
            }
        }
        else {
            instances.push(new THREE.Matrix4().identity());
        }
        const { matrixWorld } = mesh;
        for (let i = 0; i < index.array.length - 2; i += 3) {
            for (const instance of instances) {
                const transform = instance.multiply(matrixWorld);
                const i1 = index.array[i] * 3;
                const i2 = index.array[i + 1] * 3;
                const i3 = index.array[i + 2] * 3;
                p1.set(pos[i1], pos[i1 + 1], pos[i1 + 2]).applyMatrix4(transform);
                p2.set(pos[i2], pos[i2 + 1], pos[i2 + 2]).applyMatrix4(transform);
                p3.set(pos[i3], pos[i3 + 1], pos[i3 + 2]).applyMatrix4(transform);
                volume += this.getSignedVolumeOfTriangle(p1, p2, p3);
            }
        }
        return Math.abs(volume);
    }
    getSignedVolumeOfTriangle(p1, p2, p3) {
        const v321 = p3.x * p2.y * p1.z;
        const v231 = p2.x * p3.y * p1.z;
        const v312 = p3.x * p1.y * p2.z;
        const v132 = p1.x * p3.y * p2.z;
        const v213 = p2.x * p1.y * p3.z;
        const v123 = p1.x * p2.y * p3.z;
        return (1.0 / 6.0) * (-v321 + v231 + v312 - v132 - v213 + v123);
    }
}
VolumeMeasurement.uuid = "811da532-7af3-4635-b592-1c06ae494af5";
ToolComponent.libraryUUIDs.add(VolumeMeasurement.uuid);
//# sourceMappingURL=index.js.map