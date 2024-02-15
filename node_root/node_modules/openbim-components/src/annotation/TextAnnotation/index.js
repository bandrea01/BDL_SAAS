import { BaseSVGAnnotation, UIElement } from "../../base-types";
import { Button } from "../../ui";
import { DrawManager } from "../DrawManager";
import { SVGText } from "../SVGText";
export class TextAnnotation extends BaseSVGAnnotation {
    constructor(components) {
        super(components);
        this.name = "TextAnnotation";
        this.uiElement = new UIElement();
        this.canvas = null;
        this.cancel = () => {
            if (!this._isDrawing) {
                return;
            }
            this._isDrawing = false;
            this._previewElement.reset();
            this._previewElement.get().remove();
        };
        this.start = (e) => {
            var _a, _b;
            if (!this.canDraw) {
                return null;
            }
            const drawManager = this.components.tools.get(DrawManager);
            if (!this._isDrawing) {
                this._isDrawing = true;
                const text = prompt("Enter your text", this._previewElement.text);
                if (!text) {
                    this.cancel();
                    return null;
                }
                this._previewElement.setStyle(drawManager.viewport.config);
                this._previewElement.text = text;
                this._previewElement.x = e.clientX;
                this._previewElement.y = e.clientY;
                (_a = this.svgViewport) === null || _a === void 0 ? void 0 : _a.append(this._previewElement.get());
            }
            else {
                const text = this._previewElement.clone();
                text.setStyle(drawManager.viewport.config);
                (_b = this.svgViewport) === null || _b === void 0 ? void 0 : _b.append(text.get());
                this.cancel();
                return text;
            }
            return null;
        };
        this.draw = (e) => {
            if (!this.canDraw || !this._isDrawing) {
                return;
            }
            this._previewElement.x = e.clientX;
            this._previewElement.y = e.clientY;
        };
        this._previewElement = new SVGText(components);
        const drawManager = this.components.tools.get(DrawManager);
        if (components.uiEnabled) {
            this.setUI();
        }
        drawManager.addDrawingTool(this.name, this);
    }
    setUI() {
        const drawManager = this.components.tools.get(DrawManager);
        const main = new Button(this.components);
        main.label = "Text";
        main.materialIcon = "title";
        main.onClick.add(() => {
            drawManager.activateTool(this);
        });
        this.uiElement.set({ main });
    }
    async dispose() {
        await super.dispose();
        await this._previewElement.dispose();
    }
}
//# sourceMappingURL=index.js.map