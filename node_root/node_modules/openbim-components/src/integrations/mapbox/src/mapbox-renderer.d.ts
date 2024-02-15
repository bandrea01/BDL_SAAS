import * as THREE from "three";
import { Disposable, Event, BaseRenderer } from "../../../base-types";
import { Components } from "../../../core";
/**
 * Minimal renderer that can be used to create a BIM + GIS scene
 * with [Mapbox](https://www.mapbox.com/).
 * [See example](https://ifcjs.github.io/components/examples/mapbox.html).
 */
export declare class MapboxRenderer extends BaseRenderer implements Disposable {
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    /** {@link Component.enabled} */
    enabled: boolean;
    /** {@link Updateable.onBeforeUpdate} */
    readonly onBeforeUpdate: Event<MapboxRenderer>;
    /** {@link Updateable.onAfterUpdate} */
    readonly onAfterUpdate: Event<MapboxRenderer>;
    /**
     * The renderer can only be initialized once Mapbox' map has been loaded. This
     * method triggers when that happens, so any initial logic that depends on the
     * renderer has to subscribe to this.
     */
    readonly onInitialized: Event<THREE.Renderer>;
    private _labelRenderer;
    private _renderer;
    private _map;
    private _components;
    private readonly _initError;
    private _modelTransform;
    constructor(components: Components, map: any, coords: any, rotation?: THREE.Vector3);
    /** {@link Component.get} */
    get(): THREE.WebGLRenderer;
    /** {@link Resizeable.getSize} */
    getSize(): THREE.Vector2;
    /** {@link Resizeable.resize}. Mapbox automatically handles this. */
    resize(): void;
    /** {@link Disposable.dispose} */
    dispose(): Promise<void>;
    private initialize;
    private setupMap;
    private newMapboxLayer;
    private newModelTransform;
    private render;
    private initializeLabelRenderer;
    private updateLabelRendererSize;
    private setup3DBuildings;
    private setupEvents;
}
