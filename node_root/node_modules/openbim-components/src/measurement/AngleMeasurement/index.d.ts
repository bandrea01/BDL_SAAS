import * as THREE from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { Createable, Event, UI, Component, Disposable, UIElement } from "../../base-types";
import { Components } from "../../core";
import { Button } from "../../ui";
import { AngleMeasureElement } from "./src";
export declare class AngleMeasurement extends Component<AngleMeasureElement[]> implements Createable, UI, Disposable {
    static readonly uuid: "622fb2c9-528c-4b0a-8a0e-6a1375f0a3aa";
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    uiElement: UIElement<{
        main: Button;
    }>;
    private _lineMaterial;
    private _enabled;
    private _vertexPicker;
    private _currentAngleElement;
    private _clickCount;
    private _measurements;
    readonly onBeforeCreate: Event<any>;
    readonly onAfterCreate: Event<AngleMeasureElement>;
    readonly onBeforeCancel: Event<any>;
    readonly onAfterCancel: Event<any>;
    readonly onBeforeDelete: Event<any>;
    readonly onAfterDelete: Event<any>;
    set lineMaterial(material: LineMaterial);
    get lineMaterial(): LineMaterial;
    set enabled(value: boolean);
    get enabled(): boolean;
    set workingPlane(plane: THREE.Plane | null);
    get workingPlane(): THREE.Plane | null;
    constructor(components: Components);
    dispose(): Promise<void>;
    create: () => void;
    delete(): void;
    /** Deletes all the dimensions that have been previously created. */
    deleteAll(): Promise<void>;
    endCreation(): void;
    cancelCreation(): void;
    get(): AngleMeasureElement[];
    private setUI;
    private setupEvents;
    private onMouseMove;
    private onKeyDown;
}
