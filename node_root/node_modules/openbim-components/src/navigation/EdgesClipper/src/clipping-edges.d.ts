import * as THREE from "three";
import { Edge } from "./types";
import { EdgesStyles } from "./edges-styles";
import { Component, Disposable, Hideable, Updateable, Event } from "../../../base-types";
import { Components } from "../../../core";
export type Edges = {
    [name: string]: Edge;
};
/**
 * The edges that are drawn when the {@link EdgesPlane} sections a mesh.
 */
export declare class ClippingEdges extends Component<Edges> implements Hideable, Disposable, Updateable {
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    /** {@link Updateable.onAfterUpdate} */
    onAfterUpdate: Event<Edge[]>;
    /** {@link Updateable.onBeforeUpdate} */
    onBeforeUpdate: Event<Edge[]>;
    /** {@link Component.name} */
    name: string;
    /** {@link Component.enabled}. */
    enabled: boolean;
    fillNeedsUpdate: boolean;
    protected blockByIndex: {
        [index: number]: number;
    };
    protected _edges: Edges;
    protected _styles: EdgesStyles;
    protected _visible: boolean;
    protected _inverseMatrix: THREE.Matrix4;
    protected _localPlane: THREE.Plane;
    protected _tempLine: THREE.Line3;
    protected _tempVector: THREE.Vector3;
    protected _plane: THREE.Plane;
    /** {@link Hideable.visible} */
    get visible(): boolean;
    get fillVisible(): boolean;
    set fillVisible(visible: boolean);
    constructor(components: Components, plane: THREE.Plane, styles: EdgesStyles);
    setVisible(visible: boolean): Promise<void>;
    /** {@link Updateable.update} */
    update(): Promise<void>;
    /** {@link Component.get} */
    get(): Edges;
    /** {@link Disposable.dispose} */
    dispose(): Promise<void>;
    private newEdgesMesh;
    private newFillMesh;
    private newFillOutline;
    private drawEdges;
    private initializeStyle;
    private shapecast;
    private updateEdgesVisibility;
    private updateDeletedEdges;
    private disposeOutline;
    private disposeEdge;
}
