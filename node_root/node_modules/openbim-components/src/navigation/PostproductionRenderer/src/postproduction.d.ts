import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { Components } from "../../../core";
import { CustomEffectsPass } from "./custom-effects-pass";
export interface PostproductionSettings {
    gamma?: boolean;
    custom?: boolean;
    ao?: boolean;
}
export declare class Postproduction {
    private components;
    private renderer;
    excludedItems: Set<THREE.Object3D<THREE.Object3DEventMap>>;
    overrideScene?: THREE.Scene;
    overrideCamera?: THREE.Camera;
    overrideClippingPlanes: boolean;
    readonly composer: EffectComposer;
    private _enabled;
    private _initialized;
    private _n8ao?;
    private _customEffects?;
    private _basePass?;
    private _gammaPass?;
    private _depthTexture?;
    private _settings;
    private readonly _renderTarget;
    get basePass(): RenderPass;
    get gammaPass(): ShaderPass;
    get customEffects(): CustomEffectsPass;
    get n8ao(): any;
    get enabled(): boolean;
    set enabled(active: boolean);
    get settings(): {
        gamma?: boolean | undefined;
        custom?: boolean | undefined;
        ao?: boolean | undefined;
    };
    constructor(components: Components, renderer: THREE.WebGLRenderer);
    dispose(): Promise<void>;
    setPasses(settings: PostproductionSettings): void;
    setSize(width: number, height: number): void;
    update(): void;
    updateCamera(): void;
    private initialize;
    updateProjection(camera: THREE.Camera): void;
    private updatePasses;
    private newCustomPass;
    private newGammaPass;
    private newSaoPass;
    private newBasePass;
}
