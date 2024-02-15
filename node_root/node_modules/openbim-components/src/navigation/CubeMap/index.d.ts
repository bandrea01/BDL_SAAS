import { Component, Disposable, Event, Hideable, Updateable } from "../../base-types";
import { Components } from "../../core";
type CubeMapPositions = "top-left" | "top-right" | "bottom-right" | "bottom-left";
export type CubeMapFace = "front" | "top" | "bottom" | "right" | "left" | "back";
/**
 * A simple navigation cube to zoom the scene to its basic views (top, bottom,
 * left, right, back and front).
 */
export declare class CubeMap extends Component<HTMLDivElement> implements Updateable, Hideable, Disposable {
    static readonly uuid: "53311ea3-323a-476f-ae4a-d681778e8f67";
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    /** {@link Component.enabled} */
    enabled: boolean;
    /** {@link Updateable.onAfterUpdate} */
    readonly onAfterUpdate: Event<CubeMap>;
    /** {@link Updateable.onBeforeUpdate} */
    readonly onBeforeUpdate: Event<CubeMap>;
    /** The minimum zoom distance to the scene. */
    offset: number;
    private _cubeFaceClass;
    private _cyan;
    private _pink;
    private _blue;
    private _cube;
    private _cubeWrapper;
    private _matrix;
    private _visible;
    private _faceOrientations;
    get visible(): boolean;
    set visible(value: boolean);
    constructor(components: Components);
    dispose(): Promise<void>;
    setSize(value?: string): void;
    setPosition(corner: CubeMapPositions): void;
    orientToFace(orientation: CubeMapFace): void;
    update: () => void;
    private get _viewerContainer();
    private get _camera();
    private getCameraCSSMatrix;
    get(): HTMLDivElement;
}
export {};
