import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Component, Event, UIElement, } from "../../base-types";
import { SimpleUIComponent } from "../../ui";
import { Disposer } from "../Disposer";
import { SimpleRenderer } from "../SimpleRenderer";
import { PostproductionRenderer } from "../../navigation/PostproductionRenderer";
import { Infinite2dGrid } from "./src";
// TODO: Make a scene manager as a Tool (so that it as an UUID)
/**
 * A simple floating 2D scene that you can use to easily draw 2D graphics
 * with all the power of Three.js.
 */
export class Simple2DScene extends Component {
    get scaleX() {
        return this._scaleX;
    }
    set scaleX(value) {
        this._scaleX = value;
        this._root.scale.x = value;
        this.grid.scaleX = value;
        this.grid.regenerate();
    }
    get scaleY() {
        return this._scaleY;
    }
    set scaleY(value) {
        this._scaleY = value;
        this._root.scale.y = value;
        this.grid.scaleY = value;
        this.grid.regenerate();
    }
    constructor(components, postproduction = false) {
        super(components);
        /** {@link Updateable.onAfterUpdate} */
        this.onAfterUpdate = new Event();
        /** {@link Updateable.onBeforeUpdate} */
        this.onBeforeUpdate = new Event();
        /** {@link Resizeable.onResize} */
        this.onResize = new Event();
        /** {@link Component.enabled} */
        this.enabled = true;
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        /** {@link UI.uiElement} */
        this.uiElement = new UIElement();
        this._scaleX = 1;
        this._scaleY = 1;
        this._root = new THREE.Group();
        this._size = new THREE.Vector2();
        this._frustumSize = 50;
        /** {@link Resizeable.resize} */
        this.resize = () => {
            const { height, width } = this._size;
            const aspect = width / height;
            this.camera.left = (-this._frustumSize * aspect) / 2;
            this.camera.right = (this._frustumSize * aspect) / 2;
            this.camera.top = this._frustumSize / 2;
            this.camera.bottom = -this._frustumSize / 2;
            this.camera.updateProjectionMatrix();
            this.camera.updateProjectionMatrix();
            this.renderer.resize(this._size);
        };
        if (!components.uiEnabled) {
            throw new Error("The Simple2DScene component needs to use UI elements (TODO: Decouple from them).");
        }
        const container = new SimpleUIComponent(components);
        container.domElement.classList.add("relative");
        this.uiElement.set({ container });
        this.scene = new THREE.Scene();
        this._size.set(window.innerWidth, window.innerHeight);
        const { width, height } = this._size;
        // Creates the camera (point of view of the user)
        this.camera = new THREE.OrthographicCamera(75, width / height);
        this.scene.add(this.camera);
        this.camera.position.z = 10;
        const domContainer = container.domElement;
        this.scene.add(this._root);
        this.grid = new Infinite2dGrid(this.camera, domContainer);
        const gridObject = this.grid.get();
        this.scene.add(gridObject);
        if (postproduction) {
            this.renderer = new PostproductionRenderer(this.components, domContainer);
        }
        else {
            this.renderer = new SimpleRenderer(this.components, domContainer);
        }
        const renderer = this.renderer.get();
        renderer.localClippingEnabled = false;
        this.renderer.setupEvents(false);
        this.renderer.overrideScene = this.scene;
        this.renderer.overrideCamera = this.camera;
        this.controls = new OrbitControls(this.camera, renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.enableRotate = false;
        this.controls.enableZoom = true;
        this.controls.addEventListener("change", () => this.grid.regenerate());
    }
    /**
     * {@link Component.get}
     * @returns the 2D scene.
     */
    get() {
        return this._root;
    }
    /** {@link Disposable.dispose} */
    async dispose() {
        const disposer = this.components.tools.get(Disposer);
        for (const child of this.scene.children) {
            const item = child;
            if (item instanceof THREE.Object3D) {
                disposer.destroy(item);
            }
        }
        await this.renderer.dispose();
        await this.uiElement.dispose();
        await this.onDisposed.trigger(Simple2DScene.uuid);
        this.onDisposed.reset();
    }
    /** {@link Updateable.update} */
    async update() {
        await this.onBeforeUpdate.trigger();
        this.controls.update();
        await this.renderer.update();
        await this.onAfterUpdate.trigger();
    }
    /** {@link Resizeable.getSize} */
    getSize() {
        return new THREE.Vector2(this._size.width, this._size.height);
    }
    setSize(height, width) {
        this._size.width = width;
        this._size.height = height;
        this.resize();
    }
}
Simple2DScene.uuid = "b48b7194-0f9a-43a4-a718-270b1522595f";
//# sourceMappingURL=index.js.map