import * as THREE from "three";
import { Component } from "../../base-types/component";
import { Components } from "../Components";
/**
 * A tool to safely remove meshes and geometries from memory to
 * [prevent memory leaks](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).
 */
export declare class Disposer extends Component<Set<string>> {
    private _disposedComponents;
    /** {@link Component.enabled} */
    enabled: boolean;
    static readonly uuid: "76e9cd8e-ad8f-4753-9ef6-cbc60f7247fe";
    constructor(components: Components);
    /**
     * {@link Component.uuid}.
     * @return the list of UUIDs of deleted components.
     */
    get(): Set<string>;
    /**
     * Removes a mesh, its geometry and its materials from memory. If you are
     * using any of these in other parts of the application, make sure that you
     * remove them from the mesh before disposing it.
     *
     * @param object - the [object](https://threejs.org/docs/#api/en/core/Object3D)
     * to remove.
     *
     * @param materials - whether to dispose the materials of the mesh.
     *
     * @param recursive - whether to recursively dispose the children of the mesh.
     */
    destroy(object: THREE.Object3D, materials?: boolean, recursive?: boolean): void;
    /**
     * Disposes a geometry from memory.
     *
     * @param geometry - the
     * [geometry](https://threejs.org/docs/#api/en/core/BufferGeometry)
     * to remove.
     */
    disposeGeometry(geometry: THREE.BufferGeometry): void;
    private disposeGeometryAndMaterials;
    private disposeChildren;
    private static disposeMaterial;
}
