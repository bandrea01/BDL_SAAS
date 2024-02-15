import * as THREE from "three";
import { Component, Configurable, Disposable, Event } from "../../base-types";
import { Components } from "../Components";
export interface SimpleSceneConfig {
    directionalLight: {
        color: THREE.Color;
        intensity: number;
        position: THREE.Vector3;
    };
    ambientLight: {
        color: THREE.Color;
        intensity: number;
    };
}
/**
 * A basic 3D [scene](https://threejs.org/docs/#api/en/scenes/Scene) to add
 * objects hierarchically, and easily dispose them when you are finished with it.
 * @noInheritDoc
 */
export declare class SimpleScene extends Component<THREE.Scene> implements Disposable, Configurable<{}> {
    /** {@link Component.enabled} */
    enabled: boolean;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    private readonly _scene;
    constructor(components: Components);
    /** {@link Component.get} */
    get(): THREE.Scene;
    /** {@link Disposable.dispose} */
    dispose(): Promise<void>;
    config: Required<SimpleSceneConfig>;
    readonly onSetup: Event<SimpleScene>;
    /** Creates a simple and nice default set up for the scene (e.g. lighting). */
    setup(config?: Partial<SimpleSceneConfig>): Promise<void>;
}
