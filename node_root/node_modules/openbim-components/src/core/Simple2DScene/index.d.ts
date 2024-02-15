import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Component, Updateable, UI, Disposable, Event, UIElement, Resizeable } from "../../base-types";
import { SimpleUIComponent } from "../../ui";
import { Components } from "../Components";
import { SimpleRenderer } from "../SimpleRenderer";
import { PostproductionRenderer } from "../../navigation/PostproductionRenderer";
import { Infinite2dGrid } from "./src";
/**
 * A simple floating 2D scene that you can use to easily draw 2D graphics
 * with all the power of Three.js.
 */
export declare class Simple2DScene extends Component<THREE.Group> implements UI, Updateable, Disposable, Resizeable {
    static readonly uuid: "b48b7194-0f9a-43a4-a718-270b1522595f";
    /** {@link Updateable.onAfterUpdate} */
    readonly onAfterUpdate: Event<unknown>;
    /** {@link Updateable.onBeforeUpdate} */
    readonly onBeforeUpdate: Event<unknown>;
    /** {@link Resizeable.onResize} */
    onResize: Event<THREE.Vector2>;
    /** {@link Component.enabled} */
    enabled: boolean;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    /** {@link UI.uiElement} */
    uiElement: UIElement<{
        container: SimpleUIComponent;
    }>;
    /** The camera controls that move around in the scene. */
    controls: OrbitControls;
    /** The camera that renders the scene. */
    readonly camera: THREE.OrthographicCamera;
    readonly scene: THREE.Scene;
    renderer: SimpleRenderer | PostproductionRenderer;
    grid: Infinite2dGrid;
    private _scaleX;
    private _scaleY;
    private readonly _root;
    private readonly _size;
    private readonly _frustumSize;
    get scaleX(): number;
    set scaleX(value: number);
    get scaleY(): number;
    set scaleY(value: number);
    constructor(components: Components, postproduction?: boolean);
    /**
     * {@link Component.get}
     * @returns the 2D scene.
     */
    get(): THREE.Group<THREE.Object3DEventMap>;
    /** {@link Disposable.dispose} */
    dispose(): Promise<void>;
    /** {@link Updateable.update} */
    update(): Promise<void>;
    /** {@link Resizeable.getSize} */
    getSize(): THREE.Vector2;
    setSize(height: number, width: number): void;
    /** {@link Resizeable.resize} */
    resize: () => void;
}
