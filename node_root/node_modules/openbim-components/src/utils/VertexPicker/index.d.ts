import * as THREE from "three";
import { Disposable, Event } from "../../base-types/base-types";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";
export interface VertexPickerConfig {
    showOnlyVertex: boolean;
    snapDistance: number;
    previewElement: HTMLElement;
}
export declare class VertexPicker extends Component<THREE.Vector3 | null> implements Disposable {
    name: string;
    afterUpdate: Event<VertexPicker>;
    beforeUpdate: Event<VertexPicker>;
    private _pickedPoint;
    private _config;
    private _components;
    private _marker;
    private _enabled;
    private _workingPlane;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    set enabled(value: boolean);
    get enabled(): boolean;
    private get _raycaster();
    constructor(components: Components, config?: Partial<VertexPickerConfig>);
    set workingPlane(plane: THREE.Plane | null);
    get workingPlane(): THREE.Plane | null;
    set config(value: Partial<VertexPickerConfig>);
    get config(): Partial<VertexPickerConfig>;
    dispose(): Promise<void>;
    get(): THREE.Vector3 | null;
    private update;
    private getClosestVertex;
    private getVertices;
    private getVertex;
    private setupEvents;
}
