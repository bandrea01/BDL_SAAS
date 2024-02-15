import * as THREE from "three";
import { Component, Disposable, Event, Hideable } from "../../base-types";
import { Components } from "../Components";
/**
 * Each of the planes created by {@link SimpleClipper}.
 */
export declare class SimplePlane extends Component<THREE.Plane> implements Disposable, Hideable {
    /** {@link Component.name} */
    name: string;
    /** Event that fires when the user starts dragging a clipping plane. */
    readonly onDraggingStarted: Event<void>;
    /** Event that fires when the user stops dragging a clipping plane. */
    readonly onDraggingEnded: Event<void>;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    readonly normal: THREE.Vector3;
    readonly origin: THREE.Vector3;
    protected readonly _helper: THREE.Object3D;
    protected readonly _plane: THREE.Plane;
    protected _visible: boolean;
    protected _enabled: boolean;
    private _controlsActive;
    private readonly _arrowBoundBox;
    private readonly _planeMesh;
    private readonly _controls;
    private readonly _hiddenMaterial;
    /** {@link Component.enabled} */
    get enabled(): boolean;
    /** {@link Component.enabled} */
    set enabled(state: boolean);
    /** {@link Hideable.visible } */
    get visible(): boolean;
    /** {@link Hideable.visible } */
    set visible(state: boolean);
    /** The meshes used for raycasting */
    get meshes(): THREE.Mesh[];
    /** The material of the clipping plane representation. */
    get planeMaterial(): THREE.Material | THREE.Material[];
    /** The material of the clipping plane representation. */
    set planeMaterial(material: THREE.Material | THREE.Material[]);
    /** The size of the clipping plane representation. */
    get size(): number;
    /** Sets the size of the clipping plane representation. */
    set size(size: number);
    constructor(components: Components, origin: THREE.Vector3, normal: THREE.Vector3, material: THREE.Material, size?: number, activateControls?: boolean);
    setFromNormalAndCoplanarPoint(normal: THREE.Vector3, point: THREE.Vector3): void;
    /** {@link Updateable.update} */
    update: () => void;
    /** {@link Component.get} */
    get(): THREE.Plane;
    /** {@link Disposable.dispose} */
    dispose(): Promise<void>;
    protected toggleControls(state: boolean): void;
    private newTransformControls;
    private initializeControls;
    private createArrowBoundingBox;
    private changeDrag;
    private notifyDraggingChanged;
    private preventCameraMovement;
    private newHelper;
    private static newPlaneMesh;
}
