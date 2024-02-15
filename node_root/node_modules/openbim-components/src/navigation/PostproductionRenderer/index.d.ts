import * as THREE from "three";
import { SimpleRenderer } from "../../core/SimpleRenderer";
import { Components } from "../../core/Components";
import { Postproduction } from "./src/postproduction";
/**
 * Renderer that uses efficient postproduction effects (e.g. Ambient Occlusion).
 */
export declare class PostproductionRenderer extends SimpleRenderer {
    /** Helper object to handle the postproduction effects applied. */
    postproduction: Postproduction;
    constructor(components: Components, container?: HTMLElement, parameters?: Partial<THREE.WebGLRendererParameters>);
    /** {@link Updateable.update} */
    update(): Promise<void>;
    /** {@link Disposable.dispose}. */
    dispose(): Promise<void>;
    private resizePostproduction;
    private setPostproductionSize;
}
