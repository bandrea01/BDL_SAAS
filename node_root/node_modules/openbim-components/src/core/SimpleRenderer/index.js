import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Event, BaseRenderer, } from "../../base-types";
/**
 * A basic renderer capable of rendering 3D and 2D objects
 * ([Objec3Ds](https://threejs.org/docs/#api/en/core/Object3D) and
 * [CSS2DObjects](https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer)
 * respectively).
 */
export class SimpleRenderer extends BaseRenderer {
    constructor(components, container, parameters) {
        super(components);
        /** {@link Component.enabled} */
        this.enabled = true;
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        /** {@link Updateable.onBeforeUpdate} */
        this.onBeforeUpdate = new Event();
        /** {@link Updateable.onAfterUpdate} */
        this.onAfterUpdate = new Event();
        this._renderer2D = new CSS2DRenderer();
        /** {@link Resizeable.resize}. */
        this.resize = (size) => {
            this.updateContainer();
            if (!this.container) {
                return;
            }
            const width = size ? size.x : this.container.clientWidth;
            const height = size ? size.y : this.container.clientHeight;
            this._renderer.setSize(width, height);
            this._renderer2D.setSize(width, height);
            this.onResize.trigger(size);
        };
        this.resizeEvent = () => {
            this.resize();
        };
        this.onContextLost = (event) => {
            event.preventDefault();
            this.components.enabled = false;
        };
        this.onContextBack = () => {
            this._renderer.setRenderTarget(null);
            this._renderer.dispose();
            this._renderer = new THREE.WebGLRenderer({
                canvas: this._canvas,
                antialias: true,
                alpha: true,
                ...this._parameters,
            });
            this.components.enabled = true;
        };
        this.container = container || null;
        this._parameters = parameters;
        this._renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            ...parameters,
        });
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.setupRenderers();
        this.setupEvents(true);
        this.resize();
        this._canvas = this._renderer.domElement;
        const context = this._renderer.getContext();
        const { canvas } = context;
        canvas.addEventListener("webglcontextlost", this.onContextLost, false);
        canvas.addEventListener("webglcontextrestored", this.onContextBack, false);
    }
    /** {@link Component.get} */
    get() {
        return this._renderer;
    }
    /** {@link Updateable.update} */
    async update() {
        if (!this.enabled)
            return;
        await this.onBeforeUpdate.trigger(this);
        const scene = this.overrideScene || this.components.scene.get();
        const camera = this.overrideCamera || this.components.camera.get();
        if (!scene || !camera)
            return;
        this._renderer.render(scene, camera);
        this._renderer2D.render(scene, camera);
        await this.onAfterUpdate.trigger(this);
    }
    /** {@link Disposable.dispose} */
    async dispose() {
        this.enabled = false;
        this.setupEvents(false);
        this._renderer.domElement.remove();
        this._renderer.dispose();
        this._renderer2D.domElement.remove();
        this.onResize.reset();
        this.onAfterUpdate.reset();
        this.onBeforeUpdate.reset();
        await this.onDisposed.trigger();
        this.onDisposed.reset();
    }
    /** {@link Resizeable.getSize}. */
    getSize() {
        return new THREE.Vector2(this._renderer.domElement.clientWidth, this._renderer.domElement.clientHeight);
    }
    setupEvents(active) {
        if (active) {
            window.addEventListener("resize", this.resizeEvent);
        }
        else {
            window.removeEventListener("resize", this.resizeEvent);
        }
    }
    setupRenderers() {
        this._renderer.localClippingEnabled = true;
        this._renderer2D.domElement.style.position = "absolute";
        this._renderer2D.domElement.style.top = "0px";
        this._renderer2D.domElement.style.pointerEvents = "none";
        if (this.container) {
            this.container.appendChild(this._renderer.domElement);
            this.container.appendChild(this._renderer2D.domElement);
        }
        this.updateContainer();
    }
    updateContainer() {
        if (!this.container) {
            const parent = this._renderer.domElement.parentElement;
            if (parent) {
                this.container = parent;
                parent.appendChild(this._renderer2D.domElement);
            }
        }
    }
}
//# sourceMappingURL=index.js.map