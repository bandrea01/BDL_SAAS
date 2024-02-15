import * as THREE from "three";
import { Component, Configurable, Disposable, Event } from "../../base-types";
import { Components } from "../Components";
export interface ScreenCullerConfig {
    updateInterval?: number;
    rtWidth?: number;
    rtHeight?: number;
    autoUpdate?: boolean;
}
/**
 * A tool to handle big scenes efficiently by automatically hiding the objects
 * that are not visible to the camera.
 */
export declare class ScreenCuller extends Component<Map<string, THREE.InstancedMesh>> implements Disposable, Configurable<ScreenCullerConfig> {
    static readonly uuid: "69f2a50d-c266-44fc-b1bd-fa4d34be89e6";
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    /** Fires after hiding the objects that were not visible to the camera. */
    readonly onViewUpdated: Event<unknown>;
    /** {@link Component.enabled} */
    enabled: boolean;
    /**
     * Needs to check whether there are objects that need to be hidden or shown.
     * You can bind this to the camera movement, to a certain interval, etc.
     */
    needsUpdate: boolean;
    /**
     * Render the internal scene used to determine the object visibility. Used
     * for debugging purposes.
     */
    renderDebugFrame: boolean;
    readonly renderer: THREE.WebGLRenderer;
    private renderTarget;
    private bufferSize;
    private readonly materialCache;
    private readonly worker;
    private _meshColorMap;
    private _visibleMeshes;
    private _colorMeshes;
    private _meshes;
    private _currentVisibleMeshes;
    private _recentlyHiddenMeshes;
    private readonly _transparentMat;
    private _colors;
    private readonly _scene;
    private _buffer;
    constructor(components: Components);
    config: Required<ScreenCullerConfig>;
    readonly onSetup: Event<ScreenCuller>;
    setup(config?: Partial<ScreenCullerConfig>): Promise<void>;
    /**
     * {@link Component.get}.
     * @returns the map of internal meshes used to determine visibility.
     */
    get(): Map<string, THREE.InstancedMesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[]>>;
    /** {@link Disposable.dispose} */
    dispose(): Promise<void>;
    /**
     * Adds a new mesh to be processed and managed by the culler.
     * @mesh the mesh or instanced mesh to add.
     */
    add(mesh: THREE.Mesh | THREE.InstancedMesh): void;
    /**
     * The function that the culler uses to reprocess the scene. Generally it's
     * better to call needsUpdate, but you can also call this to force it.
     * @param force if true, it will refresh the scene even if needsUpdate is
     * not true.
     */
    updateVisibility: (force?: boolean) => Promise<void>;
    private handleWorkerMessage;
    private getMaterial;
    private isTransparent;
    private getNextColor;
}
