import * as THREE from "three";
import { Component } from "./component";
import { Event, Resizeable } from "./base-types";
/**
 * A base component for other components whose main mission is to render a
 * [scene](https://threejs.org/docs/#api/en/scenes/Scene).
 * @noInheritDoc
 */
export declare abstract class BaseRenderer extends Component<THREE.WebGLRenderer> implements Resizeable {
    /** {@link Resizeable.getSize}. */
    abstract getSize(): THREE.Vector2;
    /** {@link Resizeable.resize}. */
    abstract resize(): void;
    /** {@link Resizeable.onResize} */
    readonly onResize: Event<any>;
    /**
     * Event that fires when there has been a change to the list of clipping
     * planes used by the active renderer.
     */
    readonly onClippingPlanesUpdated: Event<unknown>;
    /**
     * The list of [clipping planes](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.clippingPlanes) used by this
     * instance of the renderer.
     */
    clippingPlanes: THREE.Plane[];
    /**
     * Forces the update of the clipping planes and all components that depend
     * on them that are subscribed to `onClippingPlanesUpdated`.
     */
    updateClippingPlanes(): Promise<void>;
    /**
     * Adds or removes a
     * [clipping plane](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.clippingPlanes)
     * to the renderer.
     */
    togglePlane(active: boolean, plane: THREE.Plane, isLocal?: boolean): void;
}
