import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Event } from "../../base-types";
import { Component } from "../../base-types/component";
export class Simple2DMarker extends Component {
    set visible(value) {
        this._visible = value;
        this._marker.visible = value;
    }
    get visible() {
        return this._visible;
    }
    // Define marker as setup configuration?
    constructor(components, marker) {
        super(components);
        /** {@link Component.enabled} */
        this.enabled = true;
        this._visible = true;
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        let _marker;
        if (marker) {
            _marker = marker;
        }
        else {
            _marker = document.createElement("div");
            _marker.className =
                "w-[15px] h-[15px] border-3 border-solid border-red-600";
        }
        this._marker = new CSS2DObject(_marker);
        this.components.scene.get().add(this._marker);
        this.visible = true;
    }
    /** {@link Component.get} */
    get() {
        return this._marker;
    }
    toggleVisibility() {
        this.visible = !this.visible;
    }
    async dispose() {
        this._marker.removeFromParent();
        this._marker.element.remove();
        await this.onDisposed.trigger();
        this.onDisposed.reset();
    }
}
//# sourceMappingURL=index.js.map