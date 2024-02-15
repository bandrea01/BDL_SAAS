import { Vector2 } from "three";
import { BaseSVGAnnotation, UIElement } from "../../base-types";
import { Button } from "../../ui";
import { DrawManager } from "../DrawManager";
import { SVGRectangle } from "../SVGRectangle";
export class RectangleAnnotation extends BaseSVGAnnotation {
    constructor(components) {
        super(components);
        this.name = "RectangleAnnotation";
        this.canvas = null;
        this.uiElement = new UIElement();
        this._startPoint = new Vector2();
        this.start = (e) => {
            var _a, _b;
            if (!this.canDraw) {
                return null;
            }
            const drawManager = this.components.tools.get(DrawManager);
            if (!this._isDrawing) {
                this._isDrawing = true;
                this._previewElement.setStyle(drawManager.viewport.config);
                this._startPoint.set(e.clientX, e.clientY);
                (_a = this.svgViewport) === null || _a === void 0 ? void 0 : _a.append(this._previewElement.get());
            }
            else {
                const rectangle = this._previewElement.clone();
                rectangle.setStyle(drawManager.viewport.config);
                (_b = this.svgViewport) === null || _b === void 0 ? void 0 : _b.append(rectangle.get());
                this.cancel();
                return rectangle;
            }
            return null;
        };
        this.cancel = () => {
            if (!this._isDrawing) {
                return;
            }
            this._isDrawing = false;
            this._startPoint.x = 0;
            this._startPoint.y = 0;
            this._previewElement.reset();
            this._previewElement.get().remove();
        };
        this.draw = (e) => {
            if (!this.canDraw || !this._isDrawing) {
                return;
            }
            this._previewElement.x1 = this._startPoint.x;
            this._previewElement.y1 = this._startPoint.y;
            this._previewElement.x2 = e.clientX;
            this._previewElement.y2 = e.clientY;
        };
        this._previewElement = new SVGRectangle(components);
        const drawManager = this.components.tools.get(DrawManager);
        if (components.uiEnabled) {
            this.setUI();
        }
        drawManager.addDrawingTool(this.name, this);
    }
    setUI() {
        const drawManager = this.components.tools.get(DrawManager);
        const main = new Button(this.components);
        main.label = "Rectangle";
        main.materialIcon = "crop_square";
        main.onClick.add(() => {
            drawManager.activateTool(this);
        });
        this.uiElement.set({ main });
    }
    async dispose() {
        await super.dispose();
        this._previewElement.dispose();
    }
}
//# sourceMappingURL=index.js.map