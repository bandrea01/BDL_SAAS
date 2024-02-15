import * as THREE from "three";
import { Component, Disposable, Hideable, Event } from "../../base-types";
import { Components } from "../Components";
/**
 * An infinite grid. Created by
 * [fyrestar](https://github.com/Fyrestar/THREE.InfiniteGridHelper)
 * and translated to typescript by
 * [dkaraush](https://github.com/dkaraush/THREE.InfiniteGridHelper/blob/master/InfiniteGridHelper.ts).
 */
export declare class SimpleGrid extends Component<THREE.Mesh> implements Hideable, Disposable {
    static readonly uuid: "d1e814d5-b81c-4452-87a2-f039375e0489";
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    /** {@link Component.enabled} */
    enabled: boolean;
    /** {@link Hideable.visible} */
    get visible(): boolean;
    /** {@link Hideable.visible} */
    set visible(visible: boolean);
    /** The material of the grid. */
    get material(): THREE.ShaderMaterial;
    /**
     * Whether the grid should fade away with distance. Recommended to be true for
     * perspective cameras and false for orthographic cameras.
     */
    get fade(): boolean;
    /**
     * Whether the grid should fade away with distance. Recommended to be true for
     * perspective cameras and false for orthographic cameras.
     */
    set fade(active: boolean);
    private readonly _grid;
    private _fade;
    constructor(components: Components, color?: THREE.Color, size1?: number, size2?: number, distance?: number);
    /** {@link Component.get} */
    get(): THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>;
    /** {@link Disposable.dispose} */
    dispose(): Promise<void>;
    private setupEvents;
    private updateZoom;
}
