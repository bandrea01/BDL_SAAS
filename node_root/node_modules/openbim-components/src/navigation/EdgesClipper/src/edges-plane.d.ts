import * as THREE from "three";
import { SimplePlane, Components } from "../../../core";
import { ClippingEdges } from "./clipping-edges";
import { EdgesStyles } from "./edges-styles";
/**
 * A more advanced version of {@link SimpleClipper} that also includes
 * {@link ClippingEdges} with customizable lines.
 */
export declare class EdgesPlane extends SimplePlane {
    readonly edges: ClippingEdges;
    /**
     * The max rate in milliseconds at which edges can be regenerated.
     * To disable this behaviour set this to 0.
     */
    edgesMaxUpdateRate: number;
    private lastUpdate;
    private updateTimeout;
    constructor(components: Components, origin: THREE.Vector3, normal: THREE.Vector3, material: THREE.Material, styles: EdgesStyles);
    /** {@link Component.enabled} */
    set enabled(state: boolean);
    /** {@link Component.enabled} */
    get enabled(): boolean;
    /** {@link Disposable.dispose} */
    dispose(): Promise<void>;
    /** {@link Component.enabled} */
    setEnabled(state: boolean): Promise<void>;
    setVisible(state: boolean): Promise<void>;
    updateFill: () => Promise<void>;
    /** {@link Updateable.update} */
    update: () => Promise<void>;
    private hideFills;
}
