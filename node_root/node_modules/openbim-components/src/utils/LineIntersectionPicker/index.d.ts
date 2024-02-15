import { Vector3 } from "three";
import { Component, Disposable, Event, Updateable } from "../../base-types";
import { Components } from "../../core";
interface LineIntersectionPickerConfig {
    snapDistance: number;
}
export declare class LineIntersectionPicker extends Component<Vector3 | null> implements Updateable, Disposable {
    name: string;
    onAfterUpdate: Event<LineIntersectionPicker>;
    onBeforeUpdate: Event<LineIntersectionPicker>;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    private _pickedPoint;
    private _config;
    private _enabled;
    private _marker;
    private _raycaster;
    private _mouse;
    private _originVector;
    set enabled(value: boolean);
    get enabled(): boolean;
    get config(): Partial<LineIntersectionPickerConfig>;
    set config(value: Partial<LineIntersectionPickerConfig>);
    constructor(components: Components, config?: Partial<LineIntersectionPickerConfig>);
    dispose(): Promise<void>;
    /** {@link Updateable.update} */
    update(): void;
    private findIntersection;
    private updateMarker;
    get(): Vector3 | null;
}
export {};
