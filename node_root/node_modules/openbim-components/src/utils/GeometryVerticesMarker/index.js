import { Component } from "../../base-types/component";
import { Simple2DMarker } from "../../core/Simple2DMarker";
import { Event } from "../../base-types/base-types";
export class GeometryVerticesMarker extends Component {
    set visible(value) {
        this._visible = value;
        for (const marker of this._markers)
            marker.visible = value;
    }
    get visible() {
        return this._visible;
    }
    constructor(components, geometry) {
        super(components);
        this.name = "GeometryVerticesMarker";
        this.enabled = true;
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        this._markers = [];
        this._visible = true;
        const position = geometry.getAttribute("position");
        for (let index = 0; index < position.count; index++) {
            const marker = new Simple2DMarker(components);
            marker
                .get()
                .position.set(position.getX(index), position.getY(index), position.getZ(index));
            this._markers.push(marker);
        }
    }
    async dispose() {
        for (const marker of this._markers) {
            await marker.dispose();
        }
        this._markers = [];
        await this.onDisposed.trigger();
        this.onDisposed.reset();
    }
    get() {
        return this._markers;
    }
}
//# sourceMappingURL=index.js.map