import { Event } from "./base-types";
import { Component } from "./component";
import { tooeenRandomId } from "../utils/Misc";
export class BaseSVGAnnotation extends Component {
    constructor() {
        super(...arguments);
        this.id = tooeenRandomId();
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        this._enabled = false;
        this._isDrawing = false;
        this._svgViewport = null;
        this.start = (_event) => {
            return null;
        };
        this.draw = (_event) => { };
        this.end = (_event) => { };
        this.cancel = (event) => {
            if (event) {
                event.stopImmediatePropagation();
                if (event.key === "Escape") {
                    this.cancel(event);
                }
            }
        };
    }
    set svgViewport(value) {
        this._svgViewport = value;
    }
    get svgViewport() {
        var _a;
        return (_a = this._svgViewport) !== null && _a !== void 0 ? _a : undefined;
    }
    set enabled(value) {
        this._enabled = value;
        this.setupEvents(value);
        if (this.components.uiEnabled) {
            const main = this.uiElement.get("main");
            main.active = value;
        }
    }
    get enabled() {
        return this._enabled;
    }
    get canDraw() {
        return this.enabled && this._svgViewport;
    }
    get() {
        return null;
    }
    async dispose() {
        if (this._svgViewport) {
            this._svgViewport.remove();
        }
        this.setupEvents(false);
        this.uiElement.dispose();
        await this.onDisposed.trigger();
        this.onDisposed.reset();
    }
    setupEvents(active) {
        if (active) {
            document.addEventListener("keydown", this.cancel);
            if (!this._svgViewport)
                return;
            this._svgViewport.addEventListener("mousemove", this.draw);
            this._svgViewport.addEventListener("mousedown", this.start);
            this._svgViewport.addEventListener("mouseup", this.end);
        }
        else {
            document.removeEventListener("keydown", this.cancel);
            if (!this._svgViewport)
                return;
            this._svgViewport.removeEventListener("mousemove", this.draw);
            this._svgViewport.removeEventListener("mousedown", this.start);
            this._svgViewport.removeEventListener("mouseup", this.end);
        }
    }
}
//# sourceMappingURL=base-svg-annotation.js.map