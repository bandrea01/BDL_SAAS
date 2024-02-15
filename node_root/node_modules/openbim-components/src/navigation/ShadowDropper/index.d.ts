import * as THREE from "three";
import { Component, Disposable, Event } from "../../base-types";
import { Components } from "../../core";
export interface Shadow {
    root: THREE.Group;
    rt: THREE.WebGLRenderTarget;
    rtBlur: THREE.WebGLRenderTarget;
    blurPlane: THREE.Mesh;
    camera: THREE.Camera;
}
export interface Shadows {
    [id: string]: Shadow;
}
export declare class ShadowDropper extends Component<Shadows> implements Disposable {
    static readonly uuid: "f833a09a-a3ab-4c58-b03e-da5298c7a1b6";
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    enabled: boolean;
    cameraHeight: number;
    darkness: number;
    opacity: number;
    resolution: number;
    amount: number;
    planeColor: number;
    shadowOffset: number;
    shadowExtraScaleFactor: number;
    private shadows;
    private tempMaterial;
    private depthMaterial;
    constructor(components: Components);
    /** {@link Component.get} */
    get(): Shadows;
    /** {@link Disposable.dispose} */
    dispose(): Promise<void>;
    /**
     * Creates a blurred dropped shadow of the given mesh.
     *
     * @param model - the mesh whose shadow to generate.
     * @param id - the name of this shadow.
     */
    renderShadow(model: THREE.Mesh[], id: string): THREE.Group<THREE.Object3DEventMap>;
    /**
     * Deletes the specified shadow (if it exists).
     *
     * @param id - the name of this shadow.
     */
    deleteShadow(id: string): void;
    private createPlanes;
    private initializeShadow;
    private bakeShadow;
    private static initializeCamera;
    private static initializeRenderTargets;
    private initializeRoot;
    private createBasePlane;
    private static createBlurPlane;
    private createPlaneMaterial;
    private initializeDepthMaterial;
    private createShadow;
    private createCamera;
    private getSizeCenterMin;
    private blurShadow;
}
