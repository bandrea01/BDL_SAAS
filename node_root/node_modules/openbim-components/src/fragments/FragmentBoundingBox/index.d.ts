import * as THREE from "three";
import { FragmentsGroup } from "bim-fragment";
import { Component, Disposable, Event } from "../../base-types";
import { Components } from "../../core/Components";
/**
 * A simple implementation of bounding box that works for fragments. The resulting bbox is not 100% precise, but
 * it's fast, and should suffice for general use cases such as camera zooming or general boundary determination.
 */
export declare class FragmentBoundingBox extends Component<void> implements Disposable {
    static readonly uuid: "d1444724-dba6-4cdd-a0c7-68ee1450d166";
    /** {@link Component.enabled} */
    enabled: boolean;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    private _absoluteMin;
    private _absoluteMax;
    private _meshes;
    constructor(components: Components);
    static getDimensions(bbox: THREE.Box3): {
        width: number;
        height: number;
        depth: number;
        center: THREE.Vector3;
    };
    static newBound(positive: boolean): THREE.Vector3;
    static getBounds(points: THREE.Vector3[], min?: THREE.Vector3, max?: THREE.Vector3): THREE.Box3;
    /** {@link Disposable.dispose} */
    dispose(): Promise<void>;
    get(): THREE.Box3;
    getSphere(): THREE.Sphere;
    getMesh(): THREE.Mesh<THREE.BoxGeometry, THREE.Material | THREE.Material[], THREE.Object3DEventMap>;
    reset(): void;
    add(group: FragmentsGroup): void;
    addMesh(mesh: THREE.InstancedMesh | THREE.Mesh): void;
    private static getFragmentBounds;
}
