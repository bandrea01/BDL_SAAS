import * as THREE from "three";
import { Component, Event, UIElement, } from "../../base-types";
import { SimplePlane } from "./simple-plane";
import { Button } from "../../ui";
import { ToolComponent } from "../ToolsComponent";
export * from "./simple-plane";
// TODO: Clean up UI element
/**
 * A lightweight component to easily create and handle
 * [clipping planes](https://threejs.org/docs/#api/en/materials/Material.clippingPlanes).
 *
 * @param components - the instance of {@link Components} used.
 * @param planeType - the type of plane to be used by the clipper.
 * E.g. {@link SimplePlane}.
 */
export class SimpleClipper extends Component {
    /** {@link Component.enabled} */
    get enabled() {
        return this._enabled;
    }
    /** {@link Component.enabled} */
    set enabled(state) {
        this._enabled = state;
        for (const plane of this._planes) {
            plane.enabled = state;
        }
        this.updateMaterialsAndPlanes();
        if (this.components.uiEnabled) {
            this.uiElement.get("main").active = state;
        }
    }
    /** {@link Hideable.visible } */
    get visible() {
        return this._visible;
    }
    /** {@link Hideable.visible } */
    set visible(state) {
        this._visible = state;
        for (const plane of this._planes) {
            plane.visible = state;
        }
    }
    /** The material of the clipping plane representation. */
    get material() {
        return this._material;
    }
    /** The material of the clipping plane representation. */
    set material(material) {
        this._material = material;
        for (const plane of this._planes) {
            plane.planeMaterial = material;
        }
    }
    /** The size of the geometric representation of the clippings planes. */
    get size() {
        return this._size;
    }
    /** The size of the geometric representation of the clippings planes. */
    set size(size) {
        this._size = size;
        for (const plane of this._planes) {
            plane.size = size;
        }
    }
    constructor(components) {
        super(components);
        /** {@link Createable.onAfterCreate} */
        this.onAfterCreate = new Event();
        /** {@link Createable.onAfterDelete} */
        this.onAfterDelete = new Event();
        /** Event that fires when the user starts dragging a clipping plane. */
        this.onBeforeDrag = new Event();
        /** Event that fires when the user stops dragging a clipping plane. */
        this.onAfterDrag = new Event();
        this.onBeforeCreate = new Event();
        this.onBeforeCancel = new Event();
        this.onAfterCancel = new Event();
        this.onBeforeDelete = new Event();
        /** {@link UI.uiElement} */
        this.uiElement = new UIElement();
        /**
         * Whether to force the clipping plane to be orthogonal in the Y direction
         * (up). This is desirable when clipping a building horizontally and a
         * clipping plane is created in it's roof, which might have a slight
         * slope for draining purposes.
         */
        this.orthogonalY = false;
        /**
         * The tolerance that determines whether a horizontallish clipping plane
         * will be forced to be orthogonal to the Y direction. {@link orthogonalY}
         * has to be `true` for this to apply.
         */
        this.toleranceOrthogonalY = 0.7;
        this._planes = [];
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        /** The material used in all the clipping planes. */
        this._material = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.2,
        });
        this._size = 5;
        this._enabled = false;
        this._visible = false;
        this._onStartDragging = () => {
            this.onBeforeDrag.trigger();
        };
        this._onEndDragging = () => {
            this.onAfterDrag.trigger();
        };
        this.components.tools.add(SimpleClipper.uuid, this);
        this.PlaneType = SimplePlane;
        if (components.uiEnabled) {
            this.setUI(components);
        }
    }
    endCreation() { }
    cancelCreation() { }
    /** {@link Component.get} */
    get() {
        return this._planes;
    }
    /** {@link Disposable.dispose} */
    async dispose() {
        this._enabled = false;
        for (const plane of this._planes) {
            await plane.dispose();
        }
        this._planes.length = 0;
        this.uiElement.dispose();
        this._material.dispose();
        this.onBeforeCreate.reset();
        this.onBeforeCancel.reset();
        this.onBeforeDelete.reset();
        this.onBeforeDrag.reset();
        this.onAfterCreate.reset();
        this.onAfterCancel.reset();
        this.onAfterDelete.reset();
        this.onAfterDrag.reset();
        await this.onDisposed.trigger(SimpleClipper.uuid);
        this.onDisposed.reset();
    }
    /** {@link Createable.create} */
    create() {
        if (!this.enabled)
            return;
        const intersects = this.components.raycaster.castRay();
        if (!intersects)
            return;
        this.createPlaneFromIntersection(intersects);
    }
    /**
     * Creates a plane in a certain place and with a certain orientation,
     * without the need of the mouse.
     *
     * @param normal - the orientation of the clipping plane.
     * @param point - the position of the clipping plane.
     * @param isPlan - whether this is a clipping plane used for floor plan
     * navigation.
     */
    createFromNormalAndCoplanarPoint(normal, point) {
        const plane = this.newPlane(point, normal);
        this.updateMaterialsAndPlanes();
        return plane;
    }
    /**
     * {@link Createable.delete}
     *
     * @param plane - the plane to delete. If undefined, the the first plane
     * found under the cursor will be deleted.
     */
    delete(plane) {
        if (!this.enabled)
            return;
        if (!plane) {
            plane = this.pickPlane();
        }
        if (!plane) {
            return;
        }
        this.deletePlane(plane);
    }
    /** Deletes all the existing clipping planes. */
    deleteAll() {
        while (this._planes.length > 0) {
            this.delete(this._planes[0]);
        }
    }
    deletePlane(plane) {
        const index = this._planes.indexOf(plane);
        if (index !== -1) {
            this._planes.splice(index, 1);
            this.components.renderer.togglePlane(false, plane.get());
            plane.dispose();
            this.updateMaterialsAndPlanes();
            this.onAfterDelete.trigger(plane);
        }
    }
    setUI(components) {
        const main = new Button(components);
        main.materialIcon = "content_cut";
        main.onClick.add(() => {
            main.active = !main.active;
            this.enabled = main.active;
            this.visible = main.active;
        });
        this.uiElement.set({ main });
    }
    pickPlane() {
        const meshes = this.getAllPlaneMeshes();
        const intersects = this.components.raycaster.castRay(meshes);
        if (intersects) {
            const found = intersects.object;
            return this._planes.find((p) => p.meshes.includes(found));
        }
        return undefined;
    }
    getAllPlaneMeshes() {
        const meshes = [];
        for (const plane of this._planes) {
            meshes.push(...plane.meshes);
        }
        return meshes;
    }
    createPlaneFromIntersection(intersect) {
        var _a;
        const constant = intersect.point.distanceTo(new THREE.Vector3(0, 0, 0));
        const normal = (_a = intersect.face) === null || _a === void 0 ? void 0 : _a.normal;
        if (!constant || !normal)
            return;
        const worldNormal = this.getWorldNormal(intersect, normal);
        const plane = this.newPlane(intersect.point, worldNormal.negate());
        this.components.renderer.togglePlane(true, plane.get());
        this.updateMaterialsAndPlanes();
    }
    getWorldNormal(intersect, normal) {
        const object = intersect.object;
        let transform = intersect.object.matrixWorld.clone();
        const isInstance = object instanceof THREE.InstancedMesh;
        if (isInstance && intersect.instanceId !== undefined) {
            const temp = new THREE.Matrix4();
            object.getMatrixAt(intersect.instanceId, temp);
            transform = temp.multiply(transform);
        }
        const normalMatrix = new THREE.Matrix3().getNormalMatrix(transform);
        const worldNormal = normal.clone().applyMatrix3(normalMatrix).normalize();
        this.normalizePlaneDirectionY(worldNormal);
        return worldNormal;
    }
    normalizePlaneDirectionY(normal) {
        if (this.orthogonalY) {
            if (normal.y > this.toleranceOrthogonalY) {
                normal.x = 0;
                normal.y = 1;
                normal.z = 0;
            }
            if (normal.y < -this.toleranceOrthogonalY) {
                normal.x = 0;
                normal.y = -1;
                normal.z = 0;
            }
        }
    }
    newPlane(point, normal) {
        const plane = this.newPlaneInstance(point, normal);
        plane.onDraggingStarted.add(this._onStartDragging);
        plane.onDraggingEnded.add(this._onEndDragging);
        this._planes.push(plane);
        this.onAfterCreate.trigger(plane);
        return plane;
    }
    newPlaneInstance(point, normal) {
        return new this.PlaneType(this.components, point, normal, this._material);
    }
    updateMaterialsAndPlanes() {
        this.components.renderer.updateClippingPlanes();
        const planes = this.components.renderer.clippingPlanes;
        for (const model of this.components.meshes) {
            if (Array.isArray(model.material)) {
                for (const mat of model.material) {
                    mat.clippingPlanes = planes;
                }
            }
            else {
                model.material.clippingPlanes = planes;
            }
        }
    }
}
SimpleClipper.uuid = "66290bc5-18c4-4cd1-9379-2e17a0617611";
ToolComponent.libraryUUIDs.add(SimpleClipper.uuid);
//# sourceMappingURL=index.js.map