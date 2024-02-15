import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Event, Disposable, Updateable, Resizeable, BaseRenderer } from "../../base-types";
import { Components } from "../Components";
/**
 * A basic renderer capable of rendering 3D and 2D objects
 * ([Objec3Ds](https://threejs.org/docs/#api/en/core/Object3D) and
 * [CSS2DObjects](https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer)
 * respectively).
 */
export declare class SimpleRenderer extends BaseRenderer implements Disposable, Updateable, Resizeable {
    /** {@link Component.enabled} */
    enabled: boolean;
    /** The HTML container of the THREE.js canvas where the scene is rendered. */
    container: HTMLElement | null;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    /** {@link Updateable.onBeforeUpdate} */
    readonly onBeforeUpdate: Event<SimpleRenderer>;
    /** {@link Updateable.onAfterUpdate} */
    readonly onAfterUpdate: Event<SimpleRenderer>;
    protected _renderer2D: CSS2DRenderer;
    protected _renderer: THREE.WebGLRenderer;
    protected _canvas: HTMLCanvasElement;
    protected _parameters?: Partial<THREE.WebGLRendererParameters>;
    overrideScene?: THREE.Scene;
    overrideCamera?: THREE.Camera;
    constructor(components: Components, container?: HTMLElement, parameters?: Partial<THREE.WebGLRendererParameters>);
    /** {@link Component.get} */
    get(): THREE.WebGLRenderer;
    /** {@link Updateable.update} */
    update(): Promise<void>;
    /** {@link Disposable.dispose} */
    dispose(): Promise<void>;
    /** {@link Resizeable.getSize}. */
    getSize(): THREE.Vector2;
    /** {@link Resizeable.resize}. */
    resize: (size?: THREE.Vector2) => void;
    private resizeEvent;
    setupEvents(active: boolean): void;
    private setupRenderers;
    private onContextLost;
    private onContextBack;
    private updateContainer;
}
