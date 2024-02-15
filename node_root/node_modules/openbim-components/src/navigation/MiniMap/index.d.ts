import * as THREE from "three";
import { Event, Resizeable, UI, Updateable, Component, Disposable, UIElement } from "../../base-types";
import { Canvas, Button } from "../../ui";
import { Components } from "../../core";
export declare class MiniMap extends Component<THREE.OrthographicCamera> implements UI, Resizeable, Updateable, Disposable {
    static readonly uuid: "39ad6aad-84c8-4adf-a1e0-7f25313a9e7f";
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    readonly uiElement: UIElement<{
        main: Button;
        canvas: Canvas;
    }>;
    readonly onAfterUpdate: Event<unknown>;
    readonly onBeforeUpdate: Event<unknown>;
    readonly onResize: Event<THREE.Vector2>;
    frontOffset: number;
    overrideMaterial: THREE.MeshDepthMaterial;
    backgroundColor: THREE.Color;
    private _enabled;
    private _lockRotation;
    private _components;
    private _camera;
    private _renderer;
    private _plane;
    private _size;
    private _tempVector1;
    private _tempVector2;
    private _tempTarget;
    private readonly down;
    get lockRotation(): boolean;
    set lockRotation(active: boolean);
    get zoom(): number;
    set zoom(value: number);
    get enabled(): boolean;
    set enabled(active: boolean);
    constructor(components: Components);
    dispose(): Promise<void>;
    get(): THREE.OrthographicCamera;
    update(): Promise<void>;
    getSize(): THREE.Vector2;
    resize(size?: THREE.Vector2): Promise<void>;
    private updatePlanes;
}
