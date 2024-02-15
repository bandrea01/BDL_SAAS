import * as THREE from "three";
import { Component, Createable, Disposable, Event, Hideable, UI, UIElement } from "../../base-types";
import { SimplePlane } from "./simple-plane";
import { Components } from "../Components";
import { Button } from "../../ui";
export * from "./simple-plane";
/**
 * A lightweight component to easily create and handle
 * [clipping planes](https://threejs.org/docs/#api/en/materials/Material.clippingPlanes).
 *
 * @param components - the instance of {@link Components} used.
 * @param planeType - the type of plane to be used by the clipper.
 * E.g. {@link SimplePlane}.
 */
export declare class SimpleClipper<T extends SimplePlane> extends Component<T[]> implements Createable, Disposable, Hideable, UI {
    static readonly uuid: "66290bc5-18c4-4cd1-9379-2e17a0617611";
    /** {@link Createable.onAfterCreate} */
    readonly onAfterCreate: Event<T>;
    /** {@link Createable.onAfterDelete} */
    readonly onAfterDelete: Event<T>;
    /** Event that fires when the user starts dragging a clipping plane. */
    readonly onBeforeDrag: Event<void>;
    /** Event that fires when the user stops dragging a clipping plane. */
    readonly onAfterDrag: Event<void>;
    onBeforeCreate: Event<unknown>;
    onBeforeCancel: Event<unknown>;
    onAfterCancel: Event<unknown>;
    onBeforeDelete: Event<unknown>;
    /** {@link UI.uiElement} */
    uiElement: UIElement<{
        main: Button;
    }>;
    /**
     * Whether to force the clipping plane to be orthogonal in the Y direction
     * (up). This is desirable when clipping a building horizontally and a
     * clipping plane is created in it's roof, which might have a slight
     * slope for draining purposes.
     */
    orthogonalY: boolean;
    /**
     * The tolerance that determines whether a horizontallish clipping plane
     * will be forced to be orthogonal to the Y direction. {@link orthogonalY}
     * has to be `true` for this to apply.
     */
    toleranceOrthogonalY: number;
    protected _planes: T[];
    protected PlaneType: new (...args: any) => SimplePlane | T;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    /** The material used in all the clipping planes. */
    protected _material: THREE.Material;
    private _size;
    private _enabled;
    private _visible;
    /** {@link Component.enabled} */
    get enabled(): boolean;
    /** {@link Component.enabled} */
    set enabled(state: boolean);
    /** {@link Hideable.visible } */
    get visible(): boolean;
    /** {@link Hideable.visible } */
    set visible(state: boolean);
    /** The material of the clipping plane representation. */
    get material(): THREE.Material;
    /** The material of the clipping plane representation. */
    set material(material: THREE.Material);
    /** The size of the geometric representation of the clippings planes. */
    get size(): number;
    /** The size of the geometric representation of the clippings planes. */
    set size(size: number);
    constructor(components: Components);
    endCreation(): void;
    cancelCreation(): void;
    /** {@link Component.get} */
    get(): T[];
    /** {@link Disposable.dispose} */
    dispose(): Promise<void>;
    /** {@link Createable.create} */
    create(): void;
    /**
     * Creates a plane in a certain place and with a certain orientation,
     * without the need of the mouse.
     *
     * @param normal - the orientation of the clipping plane.
     * @param point - the position of the clipping plane.
     * @param isPlan - whether this is a clipping plane used for floor plan
     * navigation.
     */
    createFromNormalAndCoplanarPoint(normal: THREE.Vector3, point: THREE.Vector3): T;
    /**
     * {@link Createable.delete}
     *
     * @param plane - the plane to delete. If undefined, the the first plane
     * found under the cursor will be deleted.
     */
    delete(plane?: T): void;
    /** Deletes all the existing clipping planes. */
    deleteAll(): void;
    private deletePlane;
    private setUI;
    private pickPlane;
    private getAllPlaneMeshes;
    private createPlaneFromIntersection;
    private getWorldNormal;
    private normalizePlaneDirectionY;
    private newPlane;
    protected newPlaneInstance(point: THREE.Vector3, normal: THREE.Vector3): T;
    private updateMaterialsAndPlanes;
    private _onStartDragging;
    private _onEndDragging;
}
