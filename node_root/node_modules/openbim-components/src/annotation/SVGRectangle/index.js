import { Vector2 } from "three";
import { Component, Event, } from "../../base-types";
import { tooeenRandomId } from "../../utils";
export class SVGRectangle extends Component {
    constructor(components, startPoint, endPoint) {
        super(components);
        this.id = tooeenRandomId();
        this.name = "SVGRectangle";
        this.enabled = true;
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        this._startPoint = new Vector2();
        this._endPoint = new Vector2();
        this._dimensions = new Vector2();
        this._rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.startPoint = startPoint !== null && startPoint !== void 0 ? startPoint : this.startPoint;
        this.endPoint = endPoint !== null && endPoint !== void 0 ? endPoint : this.endPoint;
        this._rect.setAttribute("rx", "5");
        this._rect.id = this.id;
        this.setStyle();
    }
    async dispose() {
        this._rect.remove();
        this.components = null;
        await this.onDisposed.trigger();
        this.onDisposed.reset();
    }
    setStyle(style) {
        var _a, _b, _c, _d;
        this._rect.setAttribute("stroke", (_a = style === null || style === void 0 ? void 0 : style.strokeColor) !== null && _a !== void 0 ? _a : "red");
        this._rect.setAttribute("stroke-width", (_c = (_b = style === null || style === void 0 ? void 0 : style.strokeWidth) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : "4");
        this._rect.setAttribute("fill", (_d = style === null || style === void 0 ? void 0 : style.fillColor) !== null && _d !== void 0 ? _d : "transparent");
    }
    reset() {
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
    }
    clone() {
        return new SVGRectangle(this.components, this.startPoint, this.endPoint);
    }
    set x1(value) {
        this._startPoint.x = value;
        this._rect.setAttribute("x", value.toString());
    }
    set y1(value) {
        this._startPoint.y = value;
        this._rect.setAttribute("y", value.toString());
    }
    set startPoint(point) {
        this.x1 = point.x;
        this.y1 = point.y;
    }
    get startPoint() {
        return this._startPoint;
    }
    set x2(value) {
        const lessThanStart = value < this.startPoint.x;
        this._endPoint.x = lessThanStart ? this.startPoint.x : value;
        this.x1 = lessThanStart ? value : this.startPoint.x;
        this._dimensions.x = this.endPoint.x - this.startPoint.x;
        this._rect.setAttribute("width", this._dimensions.x.toString());
    }
    set y2(value) {
        const lessThanStart = value < this.startPoint.y;
        this._endPoint.y = lessThanStart ? this.startPoint.y : value;
        this.y1 = lessThanStart ? value : this.startPoint.y;
        this._dimensions.y = this.endPoint.y - this.startPoint.y;
        this._rect.setAttribute("height", this._dimensions.y.toString());
    }
    set endPoint(point) {
        this.x2 = point.x;
        this.y2 = point.y;
    }
    get endPoint() {
        return this._endPoint;
    }
    set width(value) {
        this.x2 = this.startPoint.x + value;
    }
    get width() {
        return this._dimensions.x;
    }
    set height(value) {
        this.y2 = this.startPoint.y + value;
    }
    get height() {
        return this._dimensions.y;
    }
    set dimensions(value) {
        this.width = value.x;
        this.height = value.y;
    }
    get dimensions() {
        return this._dimensions;
    }
    get() {
        return this._rect;
    }
}
//# sourceMappingURL=index.js.map