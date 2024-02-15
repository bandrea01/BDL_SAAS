import * as THREE from "three";
import { Event } from "./base-types";
/**
 * A helper to easily get the real position of the mouse in the Three.js canvas
 * to work with tools like the
 * [raycaster](https://threejs.org/docs/#api/en/core/Raycaster), even if it has
 * been transformed through CSS or doesn't occupy the whole screen.
 */
export class Mouse {
    constructor(dom) {
        this.dom = dom;
        this._position = new THREE.Vector2();
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        this.updateMouseInfo = (event) => {
            this._event = event;
        };
        this.setupEvents(true);
    }
    /**
     * The real position of the mouse of the Three.js canvas.
     */
    get position() {
        if (this._event) {
            const bounds = this.dom.getBoundingClientRect();
            this._position.x = this.getPositionX(bounds, this._event);
            this._position.y = this.getPositionY(bounds, this._event);
        }
        return this._position;
    }
    /** {@link Disposable.dispose} */
    async dispose() {
        this.setupEvents(false);
        await this.onDisposed.trigger();
        this.onDisposed.reset();
    }
    getPositionY(bound, event) {
        return -((event.clientY - bound.top) / (bound.bottom - bound.top)) * 2 + 1;
    }
    getPositionX(bound, event) {
        return ((event.clientX - bound.left) / (bound.right - bound.left)) * 2 - 1;
    }
    setupEvents(active) {
        if (active) {
            this.dom.addEventListener("mousemove", this.updateMouseInfo);
        }
        else {
            this.dom.removeEventListener("mousemove", this.updateMouseInfo);
        }
    }
}
//# sourceMappingURL=mouse.js.map