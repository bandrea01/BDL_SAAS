import { UIElement, Event, } from "../../base-types";
import { Component } from "../../base-types/component";
import { SimpleSVGViewport } from "../../core/SimpleSVGViewport";
import { Button } from "../../ui/ButtonComponent";
import { Toolbar } from "../../ui/ToolbarComponent";
export class DrawManager extends Component {
    get isDrawing() {
        return this._isDrawing;
    }
    set isDrawing(value) {
        this._isDrawing = value;
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        this._enabled = value;
        if (this.components.uiEnabled) {
            this.uiElement.get("main").active = value;
            this.uiElement.get("drawingTools").visible = value;
        }
        this.viewport.enabled = value;
    }
    constructor(components) {
        super(components);
        this.name = "DrawManager";
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        this.uiElement = new UIElement();
        this.drawingTools = {};
        this.drawings = {};
        this._enabled = false;
        this._isDrawing = false;
        components.tools.add(DrawManager.uuid, this);
        this.viewport = new SimpleSVGViewport(components);
        if (components.uiEnabled) {
            this.setUI();
        }
        this.enabled = false;
    }
    async dispose() {
        this.uiElement.dispose();
        await this.viewport.dispose();
        for (const name in this.drawings) {
            this.drawings[name].remove();
        }
        this.drawings = {};
        this.components = null;
        await this.onDisposed.trigger(DrawManager.uuid);
        this.onDisposed.reset();
    }
    saveDrawing(name) {
        const currentDrawing = this.drawings[name];
        currentDrawing === null || currentDrawing === void 0 ? void 0 : currentDrawing.childNodes.forEach((child) => currentDrawing.removeChild(child));
        const drawing = this.viewport.getDrawing();
        const group = currentDrawing !== null && currentDrawing !== void 0 ? currentDrawing : document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.id = name;
        group.append(...drawing);
        this.viewport.get().append(group);
        this.drawings[name] = group;
        return group;
    }
    addDrawingTool(name, tool) {
        const existingTool = this.drawingTools[name];
        if (!existingTool) {
            if (this.components.uiEnabled) {
                const main = tool.uiElement.get("main");
                this.uiElement.get("drawingTools").addChild(main);
            }
            tool.svgViewport = this.viewport.get();
            this.drawingTools[name] = tool;
        }
    }
    activateTool(tool) {
        const tools = Object.values(this.drawingTools);
        const existingTool = tools.find((t) => t === tool);
        if (!existingTool) {
            console.warn("DrawManager: Tried to activate a drawing tool that is not registered yet.");
            return;
        }
        for (const t of tools) {
            t.enabled = false;
        }
        tool.enabled = true;
    }
    get activeTool() {
        const drawingTools = Object.values(this.drawingTools);
        return drawingTools.find((tool) => tool.enabled === true);
    }
    setUI() {
        const viewportToolbar = this.viewport.uiElement.get("toolbar");
        const drawingTools = new Toolbar(this.components, { position: "top" });
        setTimeout(() => {
            drawingTools.visible = false;
            viewportToolbar.visible = false;
        }, 0.001);
        this.components.ui.addToolbar(drawingTools);
        this.components.ui.addToolbar(viewportToolbar);
        const main = new Button(this.components);
        main.materialIcon = "gesture";
        main.onClick.add(() => (this.enabled = !this.enabled));
        this.uiElement.set({ drawingTools, main });
    }
    get() {
        return null;
    }
}
DrawManager.uuid = "4ab8b0f4-665d-4ea2-8f6e-66c98ed04392";
//# sourceMappingURL=index.js.map