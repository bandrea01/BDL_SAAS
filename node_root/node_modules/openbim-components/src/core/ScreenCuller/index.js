import * as THREE from "three";
import { FragmentMesh } from "bim-fragment";
import { Component, Event } from "../../base-types";
import { readPixelsAsync } from "./src/screen-culler-helper";
import { Disposer } from "../Disposer";
import { ToolComponent } from "../ToolsComponent";
import { FragmentManager } from "../../fragments/FragmentManager";
import { FragmentHighlighter } from "../../fragments/FragmentHighlighter";
/**
 * A tool to handle big scenes efficiently by automatically hiding the objects
 * that are not visible to the camera.
 */
export class ScreenCuller extends Component {
    constructor(components) {
        super(components);
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        /** Fires after hiding the objects that were not visible to the camera. */
        this.onViewUpdated = new Event();
        /** {@link Component.enabled} */
        this.enabled = true;
        /**
         * Needs to check whether there are objects that need to be hidden or shown.
         * You can bind this to the camera movement, to a certain interval, etc.
         */
        this.needsUpdate = false;
        /**
         * Render the internal scene used to determine the object visibility. Used
         * for debugging purposes.
         */
        this.renderDebugFrame = false;
        this.renderTarget = null;
        this.bufferSize = null;
        this._meshColorMap = new Map();
        this._visibleMeshes = [];
        this._colorMeshes = new Map();
        this._meshes = new Map();
        this._currentVisibleMeshes = new Set();
        this._recentlyHiddenMeshes = new Set();
        this._transparentMat = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
        });
        this._colors = { r: 0, g: 0, b: 0, i: 0 };
        // Alternative scene and meshes to make the visibility check
        this._scene = new THREE.Scene();
        this._buffer = null;
        this.config = {
            updateInterval: 1000,
            rtWidth: 512,
            rtHeight: 512,
            autoUpdate: true,
        };
        this.onSetup = new Event();
        /**
         * The function that the culler uses to reprocess the scene. Generally it's
         * better to call needsUpdate, but you can also call this to force it.
         * @param force if true, it will refresh the scene even if needsUpdate is
         * not true.
         */
        this.updateVisibility = async (force) => {
            if (!(this.enabled && this._buffer))
                return;
            if (!this.needsUpdate && !force)
                return;
            const camera = this.components.camera.get();
            camera.updateMatrix();
            this.renderer.setSize(this.config.rtWidth, this.config.rtHeight);
            this.renderer.setRenderTarget(this.renderTarget);
            this.renderer.render(this._scene, camera);
            const context = this.renderer.getContext();
            await readPixelsAsync(context, 0, 0, this.config.rtWidth, this.config.rtHeight, context.RGBA, context.UNSIGNED_BYTE, this._buffer);
            this.renderer.setRenderTarget(null);
            if (this.renderDebugFrame) {
                this.renderer.render(this._scene, camera);
            }
            this.worker.postMessage({
                buffer: this._buffer,
            });
            this.needsUpdate = false;
        };
        this.handleWorkerMessage = async (event) => {
            const colors = event.data.colors;
            this._recentlyHiddenMeshes = new Set(this._currentVisibleMeshes);
            this._currentVisibleMeshes.clear();
            this._visibleMeshes = [];
            // Make found meshes visible
            for (const code of colors.values()) {
                const mesh = this._meshColorMap.get(code);
                if (mesh) {
                    this._visibleMeshes.push(mesh);
                    mesh.visible = true;
                    this._currentVisibleMeshes.add(mesh.uuid);
                    this._recentlyHiddenMeshes.delete(mesh.uuid);
                    if (mesh instanceof FragmentMesh) {
                        const highlighter = this.components.tools.get(FragmentHighlighter);
                        const { cullHighlightMeshes, selectName } = highlighter.config;
                        if (!cullHighlightMeshes) {
                            continue;
                        }
                        const fragments = mesh.fragment.fragments;
                        for (const name in fragments) {
                            if (name === selectName) {
                                continue;
                            }
                            const fragment = fragments[name];
                            fragment.mesh.visible = true;
                        }
                    }
                }
            }
            // Hide meshes that were visible before but not anymore
            for (const uuid of this._recentlyHiddenMeshes) {
                const mesh = this._meshes.get(uuid);
                if (mesh === undefined)
                    continue;
                mesh.visible = false;
                if (mesh instanceof FragmentMesh) {
                    const highlighter = this.components.tools.get(FragmentHighlighter);
                    const { cullHighlightMeshes, selectName } = highlighter.config;
                    if (!cullHighlightMeshes) {
                        continue;
                    }
                    const fragments = mesh.fragment.fragments;
                    for (const name in fragments) {
                        if (name === selectName) {
                            continue;
                        }
                        const fragment = fragments[name];
                        fragment.mesh.visible = false;
                    }
                }
            }
            await this.onViewUpdated.trigger();
        };
        components.tools.add(ScreenCuller.uuid, this);
        this.renderer = new THREE.WebGLRenderer();
        const planes = this.components.renderer.clippingPlanes;
        this.renderer.clippingPlanes = planes;
        this.materialCache = new Map();
        const code = `
      addEventListener("message", (event) => {
        const { buffer } = event.data;
        const colors = new Set();
        for (let i = 0; i < buffer.length; i += 4) {
            const r = buffer[i];
            const g = buffer[i + 1];
            const b = buffer[i + 2];
            const code = "" + r + "-" + g + "-" + b;
            colors.add(code);
        }
        postMessage({ colors });
      });
    `;
        const blob = new Blob([code], { type: "application/javascript" });
        this.worker = new Worker(URL.createObjectURL(blob));
        this.worker.addEventListener("message", this.handleWorkerMessage);
    }
    async setup(config) {
        this.config = { ...this.config, ...config };
        const { autoUpdate, updateInterval, rtHeight, rtWidth } = this.config;
        this.renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);
        this.bufferSize = rtWidth * rtHeight * 4;
        this._buffer = new Uint8Array(this.bufferSize);
        if (autoUpdate)
            window.setInterval(this.updateVisibility, updateInterval);
        this.onSetup.trigger(this);
    }
    /**
     * {@link Component.get}.
     * @returns the map of internal meshes used to determine visibility.
     */
    get() {
        return this._colorMeshes;
    }
    /** {@link Disposable.dispose} */
    async dispose() {
        var _a;
        this.enabled = false;
        this._currentVisibleMeshes.clear();
        this._recentlyHiddenMeshes.clear();
        this._scene.children.length = 0;
        this.onViewUpdated.reset();
        this.onSetup.reset();
        this.worker.terminate();
        this.renderer.dispose();
        (_a = this.renderTarget) === null || _a === void 0 ? void 0 : _a.dispose();
        this._buffer = null;
        this._transparentMat.dispose();
        this._meshColorMap.clear();
        this._visibleMeshes = [];
        for (const id in this.materialCache) {
            const material = this.materialCache.get(id);
            if (material) {
                material.dispose();
            }
        }
        const disposer = this.components.tools.get(Disposer);
        for (const id in this._colorMeshes) {
            const mesh = this._colorMeshes.get(id);
            if (mesh) {
                disposer.destroy(mesh);
            }
        }
        this._colorMeshes.clear();
        this._meshes.clear();
        await this.onDisposed.trigger(ScreenCuller.uuid);
        this.onDisposed.reset();
    }
    /**
     * Adds a new mesh to be processed and managed by the culler.
     * @mesh the mesh or instanced mesh to add.
     */
    add(mesh) {
        if (!this.enabled)
            return;
        const isInstanced = mesh instanceof THREE.InstancedMesh;
        const { geometry, material } = mesh;
        const { r, g, b, code } = this.getNextColor();
        const colorMaterial = this.getMaterial(r, g, b);
        let newMaterial;
        if (Array.isArray(material)) {
            let transparentOnly = true;
            const matArray = [];
            for (const mat of material) {
                if (this.isTransparent(mat)) {
                    matArray.push(this._transparentMat);
                }
                else {
                    transparentOnly = false;
                    matArray.push(colorMaterial);
                }
            }
            // If we find that all the materials are transparent then we must remove this from analysis
            if (transparentOnly) {
                colorMaterial.dispose();
                return;
            }
            newMaterial = matArray;
        }
        else if (this.isTransparent(material)) {
            // This material is transparent, so we must remove it from analysis
            colorMaterial.dispose();
            return;
        }
        else {
            newMaterial = colorMaterial;
        }
        this._meshColorMap.set(code, mesh);
        const count = isInstanced ? mesh.count : 1;
        const colorMesh = new THREE.InstancedMesh(geometry, newMaterial, count);
        if (isInstanced) {
            colorMesh.instanceMatrix = mesh.instanceMatrix;
        }
        else {
            colorMesh.setMatrixAt(0, new THREE.Matrix4());
        }
        mesh.visible = false;
        colorMesh.applyMatrix4(mesh.matrix);
        colorMesh.updateMatrix();
        if (mesh instanceof FragmentMesh) {
            const fragment = mesh.fragment;
            const parent = fragment.group;
            if (parent) {
                const manager = this.components.tools.get(FragmentManager);
                const coordinationModel = manager.groups.find((model) => model.uuid === manager.baseCoordinationModel);
                if (coordinationModel) {
                    colorMesh.applyMatrix4(parent.coordinationMatrix.clone().invert());
                    colorMesh.applyMatrix4(coordinationModel.coordinationMatrix);
                }
            }
        }
        this._scene.add(colorMesh);
        this._colorMeshes.set(mesh.uuid, colorMesh);
        this._meshes.set(mesh.uuid, mesh);
    }
    getMaterial(r, g, b) {
        const colorEnabled = THREE.ColorManagement.enabled;
        THREE.ColorManagement.enabled = false;
        const code = `rgb(${r}, ${g}, ${b})`;
        const color = new THREE.Color(code);
        let material = this.materialCache.get(code);
        const clippingPlanes = this.components.renderer.clippingPlanes;
        if (!material) {
            material = new THREE.MeshBasicMaterial({
                color,
                clippingPlanes,
                side: THREE.DoubleSide,
            });
            this.materialCache.set(code, material);
        }
        THREE.ColorManagement.enabled = colorEnabled;
        return material;
    }
    isTransparent(material) {
        return material.transparent && material.opacity < 1;
    }
    getNextColor() {
        if (this._colors.i === 0) {
            this._colors.b++;
            if (this._colors.b === 256) {
                this._colors.b = 0;
                this._colors.i = 1;
            }
        }
        if (this._colors.i === 1) {
            this._colors.g++;
            this._colors.i = 0;
            if (this._colors.g === 256) {
                this._colors.g = 0;
                this._colors.i = 2;
            }
        }
        if (this._colors.i === 2) {
            this._colors.r++;
            this._colors.i = 1;
            if (this._colors.r === 256) {
                this._colors.r = 0;
                this._colors.i = 0;
            }
        }
        return {
            r: this._colors.r,
            g: this._colors.g,
            b: this._colors.b,
            code: `${this._colors.r}-${this._colors.g}-${this._colors.b}`,
        };
    }
}
ScreenCuller.uuid = "69f2a50d-c266-44fc-b1bd-fa4d34be89e6";
ToolComponent.libraryUUIDs.add(ScreenCuller.uuid);
//# sourceMappingURL=index.js.map