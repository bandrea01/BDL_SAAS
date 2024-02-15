import * as THREE from "three";
import { Event, Component, UIElement, } from "../../base-types";
import { ToolComponent } from "../../core";
import { Button } from "../../ui";
import { SimpleDimensionLine } from "../SimpleDimensionLine";
import { distanceFromPointToLine, getRaycastedFace } from "../../utils";
import { LengthMeasurement } from "../LengthMeasurement";
export class EdgeMeasurement extends Component {
    set enabled(value) {
        this._enabled = value;
        if (this.components.uiEnabled) {
            const main = this.uiElement.get("main");
            main.active = value;
        }
        this.setupEvents(value);
        if (value) {
            // const scene = this.components.scene.get();
        }
        else {
            this.cancelCreation();
        }
        // this.setVisibility(value);
    }
    get enabled() {
        return this._enabled;
    }
    constructor(components) {
        super(components);
        this.uiElement = new UIElement();
        this.tolerance = 0.3;
        this.onBeforeCreate = new Event();
        this.onAfterCreate = new Event();
        this.onBeforeCancel = new Event();
        this.onAfterCancel = new Event();
        this.onBeforeDelete = new Event();
        this.onAfterDelete = new Event();
        this.onDisposed = new Event();
        this._enabled = false;
        this._lineMaterial = new THREE.LineBasicMaterial({
            color: "#DC2626",
            linewidth: 2,
            depthTest: false,
            transparent: true,
        });
        this.create = async () => {
            if (!this.enabled || !this.preview.visible)
                return;
            const dims = this.components.tools.get(LengthMeasurement);
            const start = this.preview.startPoint.clone();
            const end = this.preview.endPoint.clone();
            dims.createOnPoints(start, end);
        };
        this.onMouseMove = () => {
            if (!this.enabled) {
                this.preview.visible = false;
                return;
            }
            const result = this.components.raycaster.castRay();
            if (!result || !result.object) {
                this.preview.visible = false;
                return;
            }
            const { object, faceIndex, point } = result;
            if (faceIndex === undefined) {
                this.preview.visible = false;
                return;
            }
            if (object instanceof THREE.Mesh || object instanceof THREE.InstancedMesh) {
                this.updateSelection(object, point, faceIndex, result.instanceId);
            }
            else {
                this.preview.visible = false;
            }
        };
        this.onKeydown = (_e) => { };
        this.components.tools.add(EdgeMeasurement.uuid, this);
        const endpointElement = document.createElement("div");
        endpointElement.className = "w-2 h-2 bg-red-600 rounded-full";
        this.preview = new SimpleDimensionLine(this.components, {
            start: new THREE.Vector3(),
            end: new THREE.Vector3(),
            lineMaterial: this._lineMaterial,
            endpointElement,
        });
        this.preview.visible = false;
        if (components.uiEnabled) {
            this.setUI();
        }
    }
    async dispose() {
        await this.preview.dispose();
        this._lineMaterial.dispose();
        this.setupEvents(false);
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
    // TODO: this could be better. Fusion this class with lengthmeasurement?
    async delete() {
        if (!this.enabled)
            return;
        const dims = this.components.tools.get(LengthMeasurement);
        const previous = dims.enabled;
        dims.enabled = true;
        await dims.delete();
        dims.enabled = previous;
    }
    async deleteAll() {
        const dims = this.components.tools.get(LengthMeasurement);
        await dims.deleteAll();
    }
    endCreation() { }
    cancelCreation() { }
    get() {
        const dims = this.components.tools.get(LengthMeasurement);
        const lines = dims.get();
        const serialized = [];
        for (const line of lines) {
            const start = line.startPoint;
            const end = line.endPoint;
            const data = [start.x, start.y, start.z, end.x, end.y, end.z];
            serialized.push(data);
        }
        return serialized;
    }
    set(dimensions) {
        const dims = this.components.tools.get(LengthMeasurement);
        for (const dim of dimensions) {
            const [x1, y1, z1, x2, y2, z2] = dim;
            const v1 = new THREE.Vector3(x1, y1, z1);
            const v2 = new THREE.Vector3(x2, y2, z2);
            dims.createOnPoints(v1, v2);
        }
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
    updateSelection(mesh, point, faceIndex, instance) {
        if (!mesh.geometry.index) {
            return;
        }
        const result = getRaycastedFace(mesh, faceIndex, instance);
        if (!result)
            return;
        const { edges } = result;
        let minDistance = Number.MAX_VALUE;
        let currentEdge = [];
        for (const id in edges) {
            const edge = edges[id];
            const [v1, v2] = edge;
            const distance = distanceFromPointToLine(point, v1, v2, true);
            if (distance < this.tolerance && distance < minDistance) {
                minDistance = distance;
                currentEdge = edge;
            }
        }
        if (!currentEdge.length) {
            this.preview.visible = false;
            return;
        }
        const [start, end] = currentEdge;
        this.preview.startPoint = start;
        this.preview.endPoint = end;
        // const scene = this.components.scene.get();
        this.preview.visible = true;
    }
}
EdgeMeasurement.uuid = "e7be5749-89df-4514-8d25-83aa38ce12d8";
ToolComponent.libraryUUIDs.add(EdgeMeasurement.uuid);
//# sourceMappingURL=index.js.map