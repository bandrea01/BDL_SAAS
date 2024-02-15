import { Vector2 } from "three";
import { BaseSVGAnnotation, UIElement } from "../../base-types";
import { Button } from "../../ui";
import { DrawManager } from "../DrawManager";
import { SVGCircle } from "../SVGCircle";
export class CircleAnnotation extends BaseSVGAnnotation {
    constructor(components) {
        super(components);
        this.name = "CircleAnnotation";
        this.canvas = null;
        this.uiElement = new UIElement();
        this._cursorPosition = new Vector2();
        this.start = (e) => {
            var _a, _b;
            if (!this.canDraw) {
                return null;
            }
            const drawManager = this.components.tools.get(DrawManager);
            if (!this._isDrawing) {
                this._isDrawing = true;
                this._previewElement.setStyle(drawManager.viewport.config);
                this._previewElement.cx = e.clientX;
                this._previewElement.cy = e.clientY;
                (_a = this.svgViewport) === null || _a === void 0 ? void 0 : _a.append(this._previewElement.get());
            }
            else {
                const circle = this._previewElement.clone();
                circle.setStyle(drawManager.viewport.config);
                (_b = this.svgViewport) === null || _b === void 0 ? void 0 : _b.append(circle.get());
                this.cancel();
                return circle;
            }
            return null;
        };
        this.cancel = () => {
            if (!this._isDrawing) {
                return;
            }
            this._isDrawing = false;
            this._previewElement.reset();
            this._previewElement.get().remove();
        };
        this.draw = (e) => {
            if (!this.canDraw || !this._isDrawing) {
                return;
            }
            this._cursorPosition.x = e.clientX;
            this._cursorPosition.y = e.clientY;
            this._previewElement.radius = this._cursorPosition.distanceTo(this._previewElement.centerPoint);
        };
        this._previewElement = new SVGCircle(components);
        const drawManager = this.components.tools.get(DrawManager);
        if (components.uiEnabled) {
            this.setUI();
        }
        drawManager.addDrawingTool("circle_annotation", this);
    }
    setUI() {
        const drawManager = this.components.tools.get(DrawManager);
        const main = new Button(this.components);
        main.label = "Circle";
        main.materialIcon = "radio_button_unchecked";
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