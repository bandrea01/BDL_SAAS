import * as THREE from "three";
import { Event, Component, UIElement, } from "../../base-types";
import { Simple2DMarker, ToolComponent } from "../../core";
import { Button } from "../../ui";
import { DimensionLabelClassName } from "../SimpleDimensionLine";
import { getRaycastedFace, getVertices } from "../../utils";
export class FaceMeasurement extends Component {
    set enabled(value) {
        this._enabled = value;
        if (this.components.uiEnabled) {
            const main = this.uiElement.get("main");
            main.active = value;
        }
        this.setupEvents(value);
        if (value) {
            const scene = this.components.scene.get();
            scene.add(this.preview);
        }
        else {
            this.preview.removeFromParent();
            this.cancelCreation();
        }
        this.setVisibility(value);
    }
    get enabled() {
        return this._enabled;
    }
    constructor(components) {
        super(components);
        this.uiElement = new UIElement();
        this.selection = [];
        this.preview = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({
            side: 2,
            depthTest: false,
            transparent: true,
            opacity: 0.25,
            color: "#BCF124",
        }));
        this.selectionMaterial = new THREE.MeshBasicMaterial({
            side: 2,
            depthTest: false,
            transparent: true,
            color: "#BCF124",
            opacity: 0.75,
        });
        this.onBeforeCreate = new Event();
        this.onAfterCreate = new Event();
        this.onBeforeCancel = new Event();
        this.onAfterCancel = new Event();
        this.onBeforeDelete = new Event();
        this.onAfterDelete = new Event();
        this.onDisposed = new Event();
        this._enabled = false;
        this._currentSelelection = null;
        this.create = () => {
            if (!this.enabled || !this._currentSelelection)
                return;
            const scene = this.components.scene.get();
            const geometry = new THREE.BufferGeometry();
            const mesh = new THREE.Mesh(geometry, this.selectionMaterial);
            geometry.setAttribute("position", this.preview.geometry.attributes.position);
            scene.add(mesh);
            geometry.computeBoundingSphere();
            const { area, perimeter } = this._currentSelelection;
            const label = this.newLabel(geometry, area);
            mesh.add(label.get());
            this.selection.push({ area, perimeter, mesh, label });
        };
        this.onMouseMove = () => {
            if (!this.enabled) {
                this.unselect();
                return;
            }
            const result = this.components.raycaster.castRay();
            if (!result || !result.object || result.faceIndex === undefined) {
                this.unselect();
                return;
            }
            const { object, faceIndex } = result;
            if (object instanceof THREE.Mesh || object instanceof THREE.InstancedMesh) {
                this.updateSelection(object, faceIndex, result.instanceId);
            }
            else {
                this.unselect();
            }
        };
        this.onKeydown = (_e) => { };
        this.components.tools.add(FaceMeasurement.uuid, this);
        this.preview.frustumCulled = false;
        if (components.uiEnabled) {
            this.setUI();
        }
    }
    async dispose() {
        this.setupEvents(false);
        await this.deleteAll();
        this.preview.removeFromParent();
        this.preview.material.dispose();
        this.preview.geometry.dispose();
        this.selectionMaterial.dispose();
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
    async delete() {
        const meshes = this.selection.map((item) => item.mesh);
        const result = this.components.raycaster.castRay(meshes);
        if (!result || !result.object) {
            return;
        }
        const found = this.selection.find((item) => item.mesh === result.object);
        if (!found)
            return;
        found.mesh.removeFromParent();
        found.mesh.geometry.dispose();
        await found.label.dispose();
        const index = this.selection.indexOf(found);
        this.selection.splice(index, 1);
    }
    async deleteAll() {
        for (const item of this.selection) {
            item.mesh.removeFromParent();
            item.mesh.geometry.dispose();
            await item.label.dispose();
        }
        this.selection = [];
    }
    endCreation() { }
    cancelCreation() { }
    get() {
        const serialized = [];
        for (const item of this.selection) {
            const geometry = item.mesh.geometry;
            const { area, perimeter } = item;
            const position = geometry.attributes.position.array;
            serialized.push({ position, area, perimeter });
        }
        return serialized;
    }
    set(serialized) {
        const scene = this.components.scene.get();
        for (const item of serialized) {
            const geometry = new THREE.BufferGeometry();
            const mesh = new THREE.Mesh(geometry, this.selectionMaterial);
            scene.add(mesh);
            const attr = new THREE.BufferAttribute(item.position, 3);
            geometry.setAttribute("position", attr);
            geometry.computeBoundingSphere();
            const { area, perimeter } = item;
            const label = this.newLabel(geometry, area);
            mesh.add(label.get());
            this.selection.push({ area, perimeter, mesh, label });
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
    setVisibility(active) {
        const scene = this.components.scene.get();
        for (const item of this.selection) {
            const label = item.label.get();
            if (active) {
                scene.add(item.mesh);
                item.mesh.add(label);
            }
            else {
                item.mesh.removeFromParent();
                label.removeFromParent();
            }
        }
    }
    unselect() {
        this.preview.removeFromParent();
        this._currentSelelection = null;
    }
    updateSelection(mesh, faceIndex, instance) {
        const scene = this.components.scene.get();
        scene.add(this.preview);
        const result = getRaycastedFace(mesh, faceIndex, instance);
        if (!result)
            return;
        const { face, distances } = result;
        const area = this.regenerateHighlight(mesh, face.indices, instance);
        let perimeter = 0;
        for (const id of face.ids) {
            const number = distances[id];
            if (number !== undefined) {
                perimeter += number;
            }
        }
        this._currentSelelection = { perimeter, area };
    }
    newLabel(geometry, area) {
        if (!geometry.boundingSphere) {
            throw new Error("Error computing area geometry");
        }
        const { center } = geometry.boundingSphere;
        const htmlText = document.createElement("div");
        htmlText.className = DimensionLabelClassName;
        const formattedArea = Math.trunc(area * 100) / 100;
        htmlText.textContent = formattedArea.toString();
        const label = new Simple2DMarker(this.components, htmlText);
        const labelObject = label.get();
        labelObject.position.copy(center);
        return label;
    }
    regenerateHighlight(mesh, indices, instance) {
        const position = [];
        const index = [];
        let counter = 0;
        let area = 0;
        const areaTriangle = new THREE.Triangle();
        for (const i of indices) {
            const { v1, v2, v3 } = getVertices(mesh, i, instance);
            position.push(v1.x, v1.y, v1.z);
            position.push(v2.x, v2.y, v2.z);
            position.push(v3.x, v3.y, v3.z);
            areaTriangle.set(v1, v2, v3);
            area += areaTriangle.getArea();
            index.push(counter, counter + 1, counter + 2);
            counter += 3;
        }
        const buffer = new Float32Array(position);
        const attr = new THREE.BufferAttribute(buffer, 3);
        this.preview.geometry.setAttribute("position", attr);
        this.preview.geometry.setIndex(index);
        return area;
    }
}
FaceMeasurement.uuid = "30279548-1309-44f6-aa97-ce26eed73522";
ToolComponent.libraryUUIDs.add(FaceMeasurement.uuid);
//# sourceMappingURL=index.js.map