import * as THREE from "three";
import { SimpleDimensionLine } from "../SimpleDimensionLine";
import { Component, Createable, Disposable, Hideable, Updateable, Event, UI, UIElement } from "../../base-types";
import { Components } from "../../core";
import { Button } from "../../ui";
/**
 * A basic dimension tool to measure distances between 2 points in 3D and
 * display a 3D symbol displaying the numeric value.
 */
export declare class LengthMeasurement extends Component<SimpleDimensionLine[]> implements Createable, Hideable, Disposable, Updateable, UI {
    static readonly uuid: "2f9bcacf-18a9-4be6-a293-e898eae64ea1";
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    /** {@link Updateable.onBeforeUpdate} */
    readonly onBeforeUpdate: Event<LengthMeasurement>;
    /** {@link Updateable.onAfterUpdate} */
    readonly onAfterUpdate: Event<LengthMeasurement>;
    /** {@link Createable.onAfterCreate} */
    readonly onAfterCreate: Event<SimpleDimensionLine>;
    /** {@link Createable.onBeforeCreate} */
    readonly onBeforeCreate: Event<LengthMeasurement>;
    /** {@link Createable.onAfterDelete} */
    readonly onAfterDelete: Event<LengthMeasurement>;
    /** {@link Createable.onBeforeDelete} */
    readonly onBeforeDelete: Event<SimpleDimensionLine>;
    /** {@link Createable.onBeforeCancel} */
    readonly onBeforeCancel: Event<LengthMeasurement>;
    /** {@link Createable.onAfterCancel} */
    readonly onAfterCancel: Event<SimpleDimensionLine>;
    uiElement: UIElement<{
        main: Button;
    }>;
    /** The minimum distance to force the dimension cursor to a vertex. */
    snapDistance: number;
    /** The [symbol](https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer)
     * that is displayed where the dimension will be drawn. */
    previewElement?: HTMLElement;
    private _vertexPicker;
    private _lineMaterial;
    private _measurements;
    private _visible;
    private _enabled;
    private _raycaster;
    /** Temporary variables for internal operations */
    private _temp;
    /** {@link Component.enabled} */
    get enabled(): boolean;
    /** {@link Component.enabled} */
    set enabled(value: boolean);
    /** {@link Hideable.visible} */
    get visible(): boolean;
    /** {@link Hideable.visible} */
    set visible(value: boolean);
    /**
     * The [Color](https://threejs.org/docs/#api/en/math/Color)
     * of the geometry of the dimensions.
     */
    set color(color: THREE.Color);
    constructor(components: Components);
    private setUI;
    /** {@link Component.get} */
    get(): SimpleDimensionLine[];
    /** {@link Disposable.dispose} */
    dispose(): Promise<void>;
    /** {@link Updateable.update} */
    update(_delta: number): Promise<void>;
    /**
     * Starts or finishes drawing a new dimension line.
     *
     * @param data - forces the dimension to be drawn on a plane. Use this if you are drawing
     * dimensions in floor plan navigation.
     */
    create: (data?: any) => Promise<void>;
    createOnPoints(p1: THREE.Vector3, p2: THREE.Vector3): void;
    /** Deletes the dimension that the user is hovering over with the mouse or touch event. */
    delete(): Promise<void>;
    deleteMeasurement(measurement: SimpleDimensionLine): Promise<void>;
    /** Deletes all the dimensions that have been previously created. */
    deleteAll(): Promise<void>;
    /** Cancels the drawing of the current dimension. */
    cancelCreation(): void;
    private drawStart;
    private drawInProcess;
    endCreation(): Promise<void>;
    private drawDimension;
    private newEndpoint;
    private getBoundingBoxes;
    private setupEvents;
    private onKeyDown;
}
