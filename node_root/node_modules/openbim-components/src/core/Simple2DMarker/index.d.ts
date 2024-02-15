import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Hideable, Disposable, Event } from "../../base-types";
import { Component } from "../../base-types/component";
import { Components } from "../Components";
export declare class Simple2DMarker extends Component<CSS2DObject> implements Hideable, Disposable {
    /** {@link Component.enabled} */
    enabled: boolean;
    private _visible;
    private _marker;
    set visible(value: boolean);
    get visible(): boolean;
    constructor(components: Components, marker?: HTMLElement);
    /** {@link Component.get} */
    get(): CSS2DObject;
    toggleVisibility(): void;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    dispose(): Promise<void>;
}
