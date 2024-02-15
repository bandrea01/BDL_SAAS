import CameraControls from "camera-controls";
import { Event } from "../../../base-types";
/**
 * A {@link NavigationMode} that allows to navigate floorplans in 2D,
 * like many BIM tools.
 */
export class PlanMode {
    constructor(camera) {
        this.camera = camera;
        /** {@link NavigationMode.enabled} */
        this.enabled = false;
        /** {@link NavigationMode.id} */
        this.id = "Plan";
        /** {@link NavigationMode.projectionChanged} */
        this.projectionChanged = new Event();
        this.mouseInitialized = false;
        this.defaultAzimuthSpeed = camera.controls.azimuthRotateSpeed;
        this.defaultPolarSpeed = camera.controls.polarRotateSpeed;
    }
    /** {@link NavigationMode.toggle} */
    toggle(active) {
        this.enabled = active;
        const controls = this.camera.controls;
        controls.azimuthRotateSpeed = active ? 0 : this.defaultAzimuthSpeed;
        controls.polarRotateSpeed = active ? 0 : this.defaultPolarSpeed;
        if (!this.mouseInitialized) {
            this.mouseAction1 = controls.touches.one;
            this.mouseAction2 = controls.touches.two;
            this.mouseInitialized = true;
        }
        if (active) {
            controls.mouseButtons.left = CameraControls.ACTION.TRUCK;
            controls.touches.one = CameraControls.ACTION.TOUCH_TRUCK;
            controls.touches.two = CameraControls.ACTION.TOUCH_ZOOM;
        }
        else {
            controls.mouseButtons.left = CameraControls.ACTION.ROTATE;
            controls.touches.one = this.mouseAction1;
            controls.touches.two = this.mouseAction2;
        }
    }
}
//# sourceMappingURL=plan-mode.js.map