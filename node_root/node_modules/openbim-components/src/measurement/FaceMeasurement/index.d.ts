import * as THREE from "three";
import { Createable, Disposable, Event, UI, Component, UIElement } from "../../base-types";
import { Components, Simple2DMarker } from "../../core";
import { Button } from "../../ui";
export interface AreaSelection {
    area: number;
    perimeter: number;
    mesh: THREE.Mesh;
    label: Simple2DMarker;
}
export interface SerializedAreaMeasure {
    position: Float32Array;
    perimeter: number;
    area: number;
}
export declare class FaceMeasurement extends Component<void> implements Createable, UI, Disposable {
    static readonly uuid: "30279548-1309-44f6-aa97-ce26eed73522";
    uiElement: UIElement<{
        main: Button;
    }>;
    selection: AreaSelection[];
    preview: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;
    selectionMaterial: THREE.MeshBasicMaterial;
    readonly onBeforeCreate: Event<any>;
    readonly onAfterCreate: Event<any>;
    readonly onBeforeCancel: Event<any>;
    readonly onAfterCancel: Event<any>;
    readonly onBeforeDelete: Event<any>;
    readonly onAfterDelete: Event<any>;
    readonly onDisposed: Event<any>;
    private _enabled;
    private _currentSelelection;
    set enabled(value: boolean);
    get enabled(): boolean;
    constructor(components: Components);
    dispose(): Promise<void>;
    private setUI;
    create: () => void;
    delete(): Promise<void>;
    deleteAll(): Promise<void>;
    endCreation(): void;
    cancelCreation(): void;
    get(): SerializedAreaMeasure[];
    set(serialized: SerializedAreaMeasure[]): void;
    private setupEvents;
    private setVisibility;
    private onMouseMove;
    private onKeydown;
    private unselect;
    private updateSelection;
    private newLabel;
    private regenerateHighlight;
}
