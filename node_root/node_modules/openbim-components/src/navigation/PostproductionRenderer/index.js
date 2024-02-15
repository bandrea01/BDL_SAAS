import { SimpleRenderer } from "../../core/SimpleRenderer";
import { Postproduction } from "./src/postproduction";
/**
 * Renderer that uses efficient postproduction effects (e.g. Ambient Occlusion).
 */
export class PostproductionRenderer extends SimpleRenderer {
    constructor(components, container, parameters) {
        super(components, container, parameters);
        this.postproduction = new Postproduction(components, this._renderer);
        this.setPostproductionSize();
        this.onResize.add((size) => this.resizePostproduction(size));
    }
    /** {@link Updateable.update} */
    async update() {
        if (!this.enabled)
            return;
        await this.onBeforeUpdate.trigger();
        const scene = this.overrideScene || this.components.scene.get();
        const camera = this.overrideCamera || this.components.camera.get();
        if (!scene || !camera)
            return;
        if (this.postproduction.enabled) {
            this.postproduction.composer.render();
        }
        else {
            this._renderer.render(scene, camera);
        }
        this._renderer2D.render(scene, camera);
        await this.onAfterUpdate.trigger();
    }
    /** {@link Disposable.dispose}. */
    async dispose() {
        await super.dispose();
        await this.postproduction.dispose();
    }
    resizePostproduction(size) {
        if (this.postproduction) {
            this.setPostproductionSize(size);
        }
    }
    setPostproductionSize(size) {
        if (!this.container)
            return;
        const width = size ? size.x : this.container.clientWidth;
        const height = size ? size.y : this.container.clientHeight;
        this.postproduction.setSize(width, height);
    }
}
//# sourceMappingURL=index.js.map