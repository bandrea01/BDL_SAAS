import * as THREE from "three";
import CameraControls from "camera-controls";
import { Component, Event } from "../../base-types";
/**
 * A basic camera that uses
 * [yomotsu's cameracontrols](https://github.com/yomotsu/camera-controls) to
 * easily control the camera in 2D and 3D. Check out it's API to find out
 * what features it offers.
 */
export class SimpleCamera extends Component {
    /** {@link Component.enabled} */
    get enabled() {
        return this.controls.enabled;
    }
    /** {@link Component.enabled} */
    set enabled(enabled) {
        this.controls.enabled = enabled;
    }
    constructor(components) {
        super(components);
        /** {@link Updateable.onBeforeUpdate} */
        this.onBeforeUpdate = new Event();
        /** {@link Updateable.onAfterUpdate} */
        this.onAfterUpdate = new Event();
        this.onAspectUpdated = new Event();
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        /**
         * Updates the aspect of the camera to match the size of the
         * {@link Components.renderer}.
         */
        this.updateAspect = () => {
            if (this.components.renderer.isResizeable()) {
                const size = this.components.renderer.getSize();
                this._perspectiveCamera.aspect = size.width / size.height;
                this._perspectiveCamera.updateProjectionMatrix();
                this.onAspectUpdated.trigger();
            }
        };
        this._perspectiveCamera = this.setupCamera();
        this.activeCamera = this._perspectiveCamera;
        this.controls = this.setupCameraControls();
        const scene = components.scene.get();
        scene.add(this._perspectiveCamera);
        this.setupEvents(true);
    }
    /** {@link Component.get} */
    get() {
        return this.activeCamera;
    }
    /** {@link Disposable.dispose} */
    async dispose() {
        this.setupEvents(false);
        this.enabled = false;
        this.onAspectUpdated.reset();
        this.onBeforeUpdate.reset();
        this.onAfterUpdate.reset();
        this._perspectiveCamera.removeFromParent();
        this.controls.dispose();
        await this.onDisposed.trigger();
        this.onDisposed.reset();
    }
    /** {@link Updateable.update} */
    async update(_delta) {
        if (this.enabled) {
            await this.onBeforeUpdate.trigger(this);
            this.controls.update(_delta);
            await this.onAfterUpdate.trigger(this);
        }
    }
    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        const camera = new THREE.PerspectiveCamera(60, aspect, 1, 1000);
        camera.position.set(50, 50, 50);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        return camera;
    }
    setupCameraControls() {
        CameraControls.install({ THREE: SimpleCamera.getSubsetOfThree() });
        const dom = this.components.renderer.get().domElement;
        const controls = new CameraControls(this._perspectiveCamera, dom);
        controls.smoothTime = 0.2;
        controls.dollyToCursor = true;
        controls.infinityDolly = true;
        controls.setTarget(0, 0, 0);
        return controls;
    }
    setupEvents(active) {
        if (active) {
            window.addEventListener("resize", this.updateAspect);
        }
        else {
            window.removeEventListener("resize", this.updateAspect);
        }
    }
    static getSubsetOfThree() {
        return {
            MOUSE: THREE.MOUSE,
            Vector2: THREE.Vector2,
            Vector3: THREE.Vector3,
            Vector4: THREE.Vector4,
            Quaternion: THREE.Quaternion,
            Matrix4: THREE.Matrix4,
            Spherical: THREE.Spherical,
            Box3: THREE.Box3,
            Sphere: THREE.Sphere,
            Raycaster: THREE.Raycaster,
            MathUtils: THREE.MathUtils,
        };
    }
}
//# sourceMappingURL=index.js.map