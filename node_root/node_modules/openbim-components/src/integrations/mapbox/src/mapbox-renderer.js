import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Event, BaseRenderer } from "../../../base-types";
/**
 * Minimal renderer that can be used to create a BIM + GIS scene
 * with [Mapbox](https://www.mapbox.com/).
 * [See example](https://ifcjs.github.io/components/examples/mapbox.html).
 */
export class MapboxRenderer extends BaseRenderer {
    constructor(components, map, coords, rotation = new THREE.Vector3(Math.PI / 2, 0, 0)) {
        super(components);
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        /** {@link Component.enabled} */
        this.enabled = true;
        /** {@link Updateable.onBeforeUpdate} */
        this.onBeforeUpdate = new Event();
        /** {@link Updateable.onAfterUpdate} */
        this.onAfterUpdate = new Event();
        /**
         * The renderer can only be initialized once Mapbox' map has been loaded. This
         * method triggers when that happens, so any initial logic that depends on the
         * renderer has to subscribe to this.
         */
        this.onInitialized = new Event();
        this._labelRenderer = new CSS2DRenderer();
        this._renderer = new THREE.WebGLRenderer();
        this._initError = "Mapbox scene isn't initialized yet!";
        this.updateLabelRendererSize = () => {
            var _a;
            if ((_a = this._renderer) === null || _a === void 0 ? void 0 : _a.domElement) {
                this._labelRenderer.setSize(this._renderer.domElement.clientWidth, this._renderer.domElement.clientHeight);
            }
        };
        this._components = components;
        this._map = map;
        this._modelTransform = this.newModelTransform(coords, rotation);
        this.setupMap(map);
        this.setup3DBuildings();
    }
    /** {@link Component.get} */
    get() {
        return this._renderer;
    }
    /** {@link Resizeable.getSize} */
    getSize() {
        if (!this._renderer) {
            throw new Error(this._initError);
        }
        return new THREE.Vector2(this._renderer.domElement.clientWidth, this._renderer.domElement.clientHeight);
    }
    /** {@link Resizeable.resize}. Mapbox automatically handles this. */
    resize() { }
    /** {@link Disposable.dispose} */
    async dispose() {
        this.onInitialized.reset();
        this.enabled = false;
        this.setupEvents(false);
        this._renderer.dispose();
        this._map.remove();
        this._map = null;
        await this.onDisposed.trigger();
        this.onDisposed.reset();
    }
    initialize(context) {
        const canvas = this._map.getCanvas();
        const renderer = new THREE.WebGLRenderer({
            canvas,
            context,
            antialias: true,
        });
        this._renderer = renderer;
        this._renderer.autoClear = false;
        this.initializeLabelRenderer();
        this.onInitialized.trigger(renderer);
    }
    setupMap(map) {
        const scene = this._components.scene.get();
        const onAdd = (_map, gl) => this.initialize(gl);
        const render = (_gl, matrix) => this.render(scene, matrix);
        const customLayer = this.newMapboxLayer(onAdd, render);
        map.on("style.load", () => {
            map.addLayer(customLayer, "waterway-label");
        });
    }
    newMapboxLayer(onAdd, render) {
        return {
            id: "3d-model",
            type: "custom",
            renderingMode: "3d",
            onAdd,
            render,
        };
    }
    newModelTransform(coords, rotation) {
        return {
            translateX: coords.x,
            translateY: coords.y,
            translateZ: coords.z,
            rotateX: rotation.x,
            rotateY: rotation.y,
            rotateZ: rotation.z,
            scale: coords.meterInMercatorCoordinateUnits(),
        };
    }
    // Source: https://docs.mapbox.com/mapbox-gl-js/example/add-3d-model/
    render(scene, matrix) {
        if (!this._renderer || !this.enabled)
            return;
        this.onBeforeUpdate.trigger(this);
        const rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), this._modelTransform.rotateX);
        const rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), this._modelTransform.rotateY);
        const rotationZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), this._modelTransform.rotateZ);
        const m = new THREE.Matrix4().fromArray(matrix);
        const l = new THREE.Matrix4()
            .makeTranslation(this._modelTransform.translateX, this._modelTransform.translateY, this._modelTransform.translateZ)
            .scale(new THREE.Vector3(this._modelTransform.scale, -this._modelTransform.scale, this._modelTransform.scale))
            .multiply(rotationX)
            .multiply(rotationY)
            .multiply(rotationZ);
        const camera = this._components.camera.get();
        camera.projectionMatrix = m.multiply(l);
        this._renderer.resetState();
        this._renderer.render(scene, camera);
        this._labelRenderer.render(scene, camera);
        this._map.triggerRepaint();
        this.onAfterUpdate.trigger(this);
    }
    initializeLabelRenderer() {
        var _a, _b;
        this.updateLabelRendererSize();
        this.setupEvents(true);
        this._labelRenderer.domElement.style.position = "absolute";
        this._labelRenderer.domElement.style.top = "0px";
        const dom = this._labelRenderer.domElement;
        (_b = (_a = this._renderer) === null || _a === void 0 ? void 0 : _a.domElement.parentElement) === null || _b === void 0 ? void 0 : _b.appendChild(dom);
    }
    // Source: https://docs.mapbox.com/mapbox-gl-js/example/3d-buildings/
    setup3DBuildings() {
        this._map.on("load", () => {
            const layers = this._map.getStyle().layers;
            const labelLayerId = layers.find((layer) => layer.type === "symbol" && layer.layout["text-field"]).id;
            this._map.addLayer({
                id: "add-3d-buildings",
                source: "composite",
                "source-layer": "building",
                filter: ["==", "extrude", "true"],
                type: "fill-extrusion",
                minzoom: 15,
                paint: {
                    "fill-extrusion-color": "#aaa",
                    // Use an 'interpolate' expression to
                    // add a smooth transition effect to
                    // the buildings as the user zooms in.
                    "fill-extrusion-height": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        15,
                        0,
                        15.05,
                        ["get", "height"],
                    ],
                    "fill-extrusion-base": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        15,
                        0,
                        15.05,
                        ["get", "min_height"],
                    ],
                    "fill-extrusion-opacity": 0.6,
                },
            }, labelLayerId);
        });
    }
    setupEvents(active) {
        if (active) {
            window.addEventListener("resize", this.updateLabelRendererSize);
        }
        else {
            window.removeEventListener("resize", this.updateLabelRendererSize);
        }
    }
}
//# sourceMappingURL=mapbox-renderer.js.map