import * as THREE from "three";
import CameraControls from "camera-controls";
import { Event } from "../../../base-types";
/**
 * A {@link NavigationMode} that allows first person navigation,
 * simulating FPS video games.
 */
export class FirstPersonMode {
    constructor(camera) {
        this.camera = camera;
        /** {@link NavigationMode.enabled} */
        this.enabled = false;
        /** {@link NavigationMode.id} */
        this.id = "FirstPerson";
        /** {@link NavigationMode.projectionChanged} */
        this.projectionChanged = new Event();
    }
    /** {@link NavigationMode.toggle} */
    toggle(active) {
        this.enabled = active;
        if (active) {
            const projection = this.camera.getProjection();
            if (projection !== "Perspective") {
                this.camera.setNavigationMode("Orbit");
                return;
            }
            this.setupFirstPersonCamera();
        }
    }
    setupFirstPersonCamera() {
        const controls = this.camera.controls;
        const newTargetPosition = new THREE.Vector3();
        controls.distance--;
        controls.getPosition(newTargetPosition);
        controls.minDistance = 1;
        controls.maxDistance = 1;
        controls.distance = 1;
        controls.moveTo(newTargetPosition.x, newTargetPosition.y, newTargetPosition.z);
        controls.truckSpeed = 50;
        controls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;
        controls.touches.two = CameraControls.ACTION.TOUCH_ZOOM_TRUCK;
    }
}
//# sourceMappingURL=first-person-mode.js.map