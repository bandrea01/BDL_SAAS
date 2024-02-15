import { Vector2 } from "three";
import { Component, Event, } from "../../base-types";
import { tooeenRandomId } from "../../utils";
export class SVGText extends Component {
    constructor(components, text, startPoint) {
        super(components);
        this.id = tooeenRandomId();
        this.name = "SVGRectangle";
        this.enabled = true;
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        this._startPoint = new Vector2();
        this._text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        this._text.setAttribute("fill", "red");
        this._text.classList.add("text-2xl", "font-medium");
        this.text = text !== null && text !== void 0 ? text : "";
        this.startPoint = startPoint !== null && startPoint !== void 0 ? startPoint : this.startPoint;
        this._text.id = this.id;
    }
    async dispose() {
        this._text.remove();
        await this.onDisposed.trigger();
        this.onDisposed.reset();
    }
    setStyle(style) {
        var _a;
        this._text.setAttribute("fill", (_a = style === null || style === void 0 ? void 0 : style.strokeColor) !== null && _a !== void 0 ? _a : "red");
    }
    set text(value) {
        this._text.textContent = value;
    }
    get text() {
        var _a;
        return (_a = this._text.textContent) !== null && _a !== void 0 ? _a : "";
    }
    reset() {
        this.x = 0;
        this.y = 0;
    }
    clone() {
        return new SVGText(this.components, this.text, this.startPoint);
    }
    set x(value) {
        this._startPoint.x = value;
        this._text.setAttribute("x", value.toString());
    }
    set y(value) {
        this._startPoint.y = value;
        this._text.setAttribute("y", value.toString());
    }
    set startPoint(point) {
        this.x = point.x;
        this.y = point.y;
    }
    get startPoint() {
        return this._startPoint;
    }
    get() {
        return this._text;
    }
}
//# sourceMappingURL=index.js.map