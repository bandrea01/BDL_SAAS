import { LineBasicMaterial } from "three";
import { Component, Event } from "../../../base-types";
export class EdgesStyles extends Component {
    constructor(components) {
        super(components);
        this.name = "EdgesStyles";
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        this.enabled = true;
        this._styles = {};
        this._defaultLineMaterial = new LineBasicMaterial({
            color: 0x000000,
            linewidth: 0.001,
        });
        this.onAfterUpdate = new Event();
        this.onBeforeUpdate = new Event();
    }
    get() {
        return this._styles;
    }
    async update(_delta) {
        await this.onBeforeUpdate.trigger(this._styles);
        await this.onAfterUpdate.trigger(this._styles);
    }
    // Creates a new style that applies to all clipping edges for generic models
    create(name, meshes, lineMaterial = this._defaultLineMaterial, fillMaterial, outlineMaterial) {
        for (const mesh of meshes) {
            if (!mesh.geometry.boundsTree)
                mesh.geometry.computeBoundsTree();
        }
        const renderer = this.components.renderer;
        lineMaterial.clippingPlanes = renderer.clippingPlanes;
        const newStyle = {
            name,
            lineMaterial,
            meshes,
            fillMaterial,
            outlineMaterial,
            fragments: {},
        };
        this._styles[name] = newStyle;
        return newStyle;
    }
    async dispose() {
        const styles = Object.keys(this._styles);
        for (const style of styles) {
            this.deleteStyle(style);
        }
        this._styles = {};
        await this.onDisposed.trigger();
        this.onDisposed.reset();
    }
    deleteStyle(id, disposeMaterials = true) {
        var _a, _b;
        const style = this._styles[id];
        if (style) {
            style.meshes.clear();
            if (disposeMaterials) {
                style.lineMaterial.dispose();
                (_a = style.fillMaterial) === null || _a === void 0 ? void 0 : _a.dispose();
                (_b = style.outlineMaterial) === null || _b === void 0 ? void 0 : _b.dispose();
            }
        }
        delete this._styles[id];
    }
}
//# sourceMappingURL=edges-styles.js.map