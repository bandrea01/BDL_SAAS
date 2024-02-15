import { Component } from "../../base-types/component";
import { ToolComponent } from "../ToolsComponent";
/**
 * A tool to safely remove meshes and geometries from memory to
 * [prevent memory leaks](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).
 */
export class Disposer extends Component {
    constructor(components) {
        super(components);
        this._disposedComponents = new Set();
        /** {@link Component.enabled} */
        this.enabled = true;
        components.tools.add(Disposer.uuid, this);
    }
    /**
     * {@link Component.uuid}.
     * @return the list of UUIDs of deleted components.
     */
    get() {
        return this._disposedComponents;
    }
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
    destroy(object, materials = true, recursive = true) {
        object.removeFromParent();
        const item = object;
        if (item.dispose) {
            item.dispose();
        }
        this.disposeGeometryAndMaterials(object, materials);
        if (recursive && item.children && item.children.length) {
            this.disposeChildren(item);
        }
        object.children.length = 0;
    }
    /**
     * Disposes a geometry from memory.
     *
     * @param geometry - the
     * [geometry](https://threejs.org/docs/#api/en/core/BufferGeometry)
     * to remove.
     */
    disposeGeometry(geometry) {
        if (geometry.boundsTree) {
            geometry.disposeBoundsTree();
        }
        geometry.dispose();
    }
    disposeGeometryAndMaterials(mesh, materials) {
        const item = mesh;
        if (item.geometry) {
            this.disposeGeometry(item.geometry);
        }
        if (materials && item.material) {
            Disposer.disposeMaterial(item);
        }
        item.material = [];
        item.geometry = null;
    }
    disposeChildren(mesh) {
        for (const child of mesh.children) {
            this.destroy(child);
        }
    }
    static disposeMaterial(mesh) {
        if (mesh.material) {
            if (Array.isArray(mesh.material)) {
                for (const mat of mesh.material) {
                    mat.dispose();
                }
            }
            else {
                mesh.material.dispose();
            }
        }
    }
}
Disposer.uuid = "76e9cd8e-ad8f-4753-9ef6-cbc60f7247fe";
ToolComponent.libraryUUIDs.add(Disposer.uuid);
//# sourceMappingURL=index.js.map