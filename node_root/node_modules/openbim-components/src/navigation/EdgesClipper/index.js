import { SimpleClipper } from "../../core";
import { EdgesPlane } from "./src/edges-plane";
import { EdgesStyles } from "./src/edges-styles";
export * from "./src/edges-plane";
/**
 * A more advanced version of {@link SimpleClipper} that also supports
 * {@link ClippingEdges} with customizable lines.
 */
export class EdgesClipper extends SimpleClipper {
    constructor(components) {
        super(components);
        this.components.tools.list[EdgesClipper.uuid] = this;
        this.PlaneType = EdgesPlane;
        this.styles = new EdgesStyles(components);
    }
    /** {@link Component.get} */
    async dispose() {
        await super.dispose();
        await this.styles.dispose();
    }
    /**
     * Updates all the lines of the {@link ClippingEdges}.
     */
    async updateEdges(updateFills = false) {
        if (!this.enabled)
            return;
        for (const plane of this._planes) {
            if (updateFills) {
                await plane.updateFill();
            }
            else {
                await plane.update();
            }
        }
    }
    newPlaneInstance(point, normal) {
        return new this.PlaneType(this.components, point, normal, this._material, this.styles);
    }
}
//# sourceMappingURL=index.js.map