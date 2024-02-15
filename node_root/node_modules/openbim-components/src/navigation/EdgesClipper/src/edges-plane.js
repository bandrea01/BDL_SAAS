import { SimplePlane } from "../../../core";
import { ClippingEdges } from "./clipping-edges";
/**
 * A more advanced version of {@link SimpleClipper} that also includes
 * {@link ClippingEdges} with customizable lines.
 */
export class EdgesPlane extends SimplePlane {
    constructor(components, origin, normal, material, styles) {
        super(components, origin, normal, material, 5, false);
        /**
         * The max rate in milliseconds at which edges can be regenerated.
         * To disable this behaviour set this to 0.
         */
        this.edgesMaxUpdateRate = 50;
        this.lastUpdate = -1;
        this.updateTimeout = -1;
        this.updateFill = async () => {
            this.edges.fillNeedsUpdate = true;
            await this.edges.update();
            if (this._visible) {
                this.edges.fillVisible = true;
            }
        };
        /** {@link Updateable.update} */
        this.update = async () => {
            if (!this.enabled)
                return;
            this._plane.setFromNormalAndCoplanarPoint(this.normal, this._helper.position);
            // Rate limited edges update
            const now = Date.now();
            if (this.lastUpdate + this.edgesMaxUpdateRate < now) {
                this.lastUpdate = now;
                await this.edges.update();
            }
            else if (this.updateTimeout === -1) {
                this.updateTimeout = window.setTimeout(() => {
                    this.update();
                    this.updateTimeout = -1;
                }, this.edgesMaxUpdateRate);
            }
        };
        this.hideFills = () => {
            this.edges.fillVisible = false;
        };
        this.edges = new ClippingEdges(components, this._plane, styles);
        this.toggleControls(true);
        this.edges.setVisible(true);
        this.onDraggingEnded.add(this.updateFill);
        this.onDraggingStarted.add(this.hideFills);
    }
    /** {@link Component.enabled} */
    set enabled(state) {
        this._enabled = state;
        this.components.renderer.togglePlane(state, this._plane);
    }
    /** {@link Component.enabled} */
    get enabled() {
        return super.enabled;
    }
    /** {@link Disposable.dispose} */
    async dispose() {
        await super.dispose();
        await this.edges.dispose();
    }
    /** {@link Component.enabled} */
    async setEnabled(state) {
        super.enabled = state;
        if (state) {
            await this.update();
        }
    }
    async setVisible(state) {
        super.visible = state;
        this.toggleControls(state);
        await this.edges.setVisible(true);
    }
}
//# sourceMappingURL=edges-plane.js.map