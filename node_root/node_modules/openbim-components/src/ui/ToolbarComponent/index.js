import { SimpleUIComponent } from "../SimpleUIComponent";
// export class Toolbar extends SimpleUIComponent<HTMLDivElement> {
export class Toolbar extends SimpleUIComponent {
    set visible(visible) {
        this._visible = visible && this.hasElements;
        if (visible && this.hasElements) {
            this.domElement.classList.remove("hidden");
            this.onVisible.trigger(this.get());
        }
        else {
            this.domElement.classList.add("hidden");
            this.onHidden.trigger(this.get());
        }
    }
    get visible() {
        return this._visible;
    }
    set enabled(enabled) {
        this.closeMenus();
        this.children.forEach((button) => {
            button.enabled = enabled;
            button.menu.enabled = enabled;
        });
        this._enabled = enabled;
    }
    set position(position) {
        this._position = position;
        this.updateElements();
    }
    get position() {
        return this._position;
    }
    constructor(components, options) {
        var _a, _b;
        const _options = {
            position: "bottom",
            ...options,
        };
        const template = `
    <div class="${Toolbar.Class.Base}"></div> 
    `;
        super(components, template);
        this.children = [];
        this._parent = null;
        this.name = (_a = _options.name) !== null && _a !== void 0 ? _a : "Toolbar";
        this.position = (_b = _options.position) !== null && _b !== void 0 ? _b : "bottom";
        this.visible = true;
    }
    get hasElements() {
        return this.children.length > 0;
    }
    get() {
        return this.domElement;
    }
    addChild(...button) {
        button.forEach((btn) => {
            btn.parent = this;
            this.children.push(btn);
            this.domElement.append(btn.domElement);
        });
        this._components.ui.updateToolbars();
    }
    updateElements() {
        this.children.forEach((button) => (button.parent = this));
    }
    closeMenus() {
        this.children.forEach((button) => button.closeMenus());
    }
    setDirection(direction = "horizontal") {
        this.domElement.classList.remove("flex-col");
        const directionClass = direction === "horizontal" ? ["flex"] : ["flex-col"];
        this.domElement.classList.add(...directionClass);
    }
}
Toolbar.Class = {
    Base: `flex shadow-md w-fit h-fit gap-x-2 gap-y-2 p-2 text-white rounded pointer-events-auto backdrop-blur-xl 
           bg-ifcjs-100 z-50`,
};
//# sourceMappingURL=index.js.map