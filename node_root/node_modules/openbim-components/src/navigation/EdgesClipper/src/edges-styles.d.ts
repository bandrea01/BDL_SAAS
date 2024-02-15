import * as THREE from "three";
import { ClipStyle } from "./types";
import { Component, Disposable, Event, Updateable } from "../../../base-types";
import { Components } from "../../../core";
export type LineStyles = {
    [name: string]: ClipStyle;
};
export declare class EdgesStyles extends Component<LineStyles> implements Disposable, Updateable {
    name: string;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    enabled: boolean;
    protected _styles: LineStyles;
    protected _defaultLineMaterial: THREE.LineBasicMaterial;
    constructor(components: Components);
    onAfterUpdate: Event<LineStyles>;
    onBeforeUpdate: Event<LineStyles>;
    get(): LineStyles;
    update(_delta: number): Promise<void>;
    create(name: string, meshes: Set<THREE.Mesh>, lineMaterial?: THREE.LineBasicMaterial, fillMaterial?: THREE.Material, outlineMaterial?: THREE.MeshBasicMaterial): ClipStyle;
    dispose(): Promise<void>;
    deleteStyle(id: string, disposeMaterials?: boolean): void;
}
