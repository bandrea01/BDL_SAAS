import * as THREE from "three";
import { Createable, Disposable, Event, UI, Component, UIElement } from "../../base-types";
import { Components } from "../../core";
import { Button } from "../../ui";
import { AreaMeasureElement } from "./src";
export declare class AreaMeasurement extends Component<AreaMeasureElement[]> implements Createable, UI, Disposable {
    static readonly uuid: "c453a99e-f054-4781-9060-33df617db4a5";
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    uiElement: UIElement<{
        main: Button;
    }>;
    private _enabled;
    private _vertexPicker;
    private _currentAreaElement;
    private _clickCount;
    private _measurements;
    readonly onBeforeCreate: Event<any>;
    readonly onAfterCreate: Event<AreaMeasureElement>;
    readonly onBeforeCancel: Event<any>;
    readonly onAfterCancel: Event<any>;
    readonly onBeforeDelete: Event<any>;
    readonly onAfterDelete: Event<any>;
    set enabled(value: boolean);
    get enabled(): boolean;
    set workingPlane(plane: THREE.Plane | null);
    get workingPlane(): THREE.Plane | null;
    constructor(components: Components);
    dispose(): Promise<void>;
    private setUI;
    create: () => void;
    delete(): void;
    /** Deletes all the dimensions that have been previously created. */
    deleteAll(): Promise<void>;
    endCreation(): void;
    cancelCreation(): void;
    get(): AreaMeasureElement[];
    private setupEvents;
    private onMouseMove;
    private onKeydown;
}
