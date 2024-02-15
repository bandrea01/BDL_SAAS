import * as THREE from "three";
import { Mouse, Event } from "../../base-types";
import { BaseRaycaster } from "../../base-types/base-raycaster";
/**
 * A simple [raycaster](https://threejs.org/docs/#api/en/core/Raycaster)
 * that allows to easily get items from the scene using the mouse and touch
 * events.
 */
export class SimpleRaycaster extends BaseRaycaster {
    constructor(components) {
        super(components);
        /** {@link Component.enabled} */
        this.enabled = true;
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        this._raycaster = new THREE.Raycaster();
        const renderer = components.renderer.get();
        const dom = renderer.domElement;
        this.mouse = new Mouse(dom);
    }
    /** {@link Component.get} */
    get() {
        return this._raycaster;
    }
    /** {@link Disposable.dispose} */
    async dispose() {
        this.mouse.dispose();
        await this.onDisposed.trigger();
        this.onDisposed.reset();
    }
    /**
     * Throws a ray from the camera to the mouse or touch event point and returns
     * the first item found. This also takes into account the clipping planes
     * used by the renderer.
     *
     * @param items - the [meshes](https://threejs.org/docs/#api/en/objects/Mesh)
     * to query. If not provided, it will query all the meshes stored in
     * {@link Components.meshes}.
     */
    castRay(items = this.components.meshes) {
        const camera = this.components.camera.get();
        this._raycaster.setFromCamera(this.mouse.position, camera);
        return this.intersect(items);
    }
    castRayFromVector(origin, direction, items = this.components.meshes) {
        this._raycaster.set(origin, direction);
        return this.intersect(items);
    }
    intersect(items = this.components.meshes) {
        const result = this._raycaster.intersectObjects(items);
        const filtered = this.filterClippingPlanes(result);
        return filtered.length > 0 ? filtered[0] : null;
    }
    filterClippingPlanes(objs) {
        const renderer = this.components.renderer;
        if (!renderer.clippingPlanes) {
            return objs;
        }
        const planes = renderer.clippingPlanes;
        if (objs.length <= 0 || !planes || (planes === null || planes === void 0 ? void 0 : planes.length) <= 0)
            return objs;
        return objs.filter((elem) => planes.every((elem2) => elem2.distanceToPoint(elem.point) > 0));
    }
}
//# sourceMappingURL=index.js.map