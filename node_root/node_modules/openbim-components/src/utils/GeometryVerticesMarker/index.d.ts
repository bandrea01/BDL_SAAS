import * as THREE from "three";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";
import { Simple2DMarker } from "../../core/Simple2DMarker";
import { Disposable, Hideable, Event } from "../../base-types/base-types";
export declare class GeometryVerticesMarker extends Component<Simple2DMarker[]> implements Disposable, Hideable {
    name: string;
    enabled: boolean;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    private _markers;
    private _visible;
    set visible(value: boolean);
    get visible(): boolean;
    constructor(components: Components, geometry: THREE.BufferGeometry);
    dispose(): Promise<void>;
    get(): Simple2DMarker[];
}
