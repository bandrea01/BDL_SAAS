import * as THREE from "three";
import { Disposable, Mouse, Event } from "../../base-types";
import { Components } from "../Components";
import { BaseRaycaster } from "../../base-types/base-raycaster";
/**
 * A simple [raycaster](https://threejs.org/docs/#api/en/core/Raycaster)
 * that allows to easily get items from the scene using the mouse and touch
 * events.
 */
export declare class SimpleRaycaster extends BaseRaycaster implements Disposable {
    /** {@link Component.enabled} */
    enabled: boolean;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    /** The position of the mouse in the screen. */
    readonly mouse: Mouse;
    private readonly _raycaster;
    constructor(components: Components);
    /** {@link Component.get} */
    get(): THREE.Raycaster;
    /** {@link Disposable.dispose} */
    dispose(): Promise<void>;
    /**
     * Throws a ray from the camera to the mouse or touch event point and returns
     * the first item found. This also takes into account the clipping planes
     * used by the renderer.
     *
     * @param items - the [meshes](https://threejs.org/docs/#api/en/objects/Mesh)
     * to query. If not provided, it will query all the meshes stored in
     * {@link Components.meshes}.
     */
    castRay(items?: THREE.Mesh[]): THREE.Intersection | null;
    castRayFromVector(origin: THREE.Vector3, direction: THREE.Vector3, items?: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>[]): THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>> | null;
    private intersect;
    private filterClippingPlanes;
}
