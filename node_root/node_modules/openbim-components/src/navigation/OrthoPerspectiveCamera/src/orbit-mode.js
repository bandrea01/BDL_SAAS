import * as THREE from "three";
import { Event } from "../../../base-types";
/**
 * A {@link NavigationMode} that allows 3D navigation and panning
 * like in many 3D and CAD softwares.
 */
export class OrbitMode {
    constructor(camera) {
        this.camera = camera;
        /** {@link NavigationMode.enabled} */
        this.enabled = true;
        /** {@link NavigationMode.id} */
        this.id = "Orbit";
        /** {@link NavigationMode.projectionChanged} */
        this.projectionChanged = new Event();
        this.activateOrbitControls();
    }
    /** {@link NavigationMode.toggle} */
    toggle(active) {
        this.enabled = active;
        if (active) {
            this.activateOrbitControls();
        }
    }
    activateOrbitControls() {
        const controls = this.camera.controls;
        controls.minDistance = 1;
        controls.maxDistance = 300;
        const position = new THREE.Vector3();
        controls.getPosition(position);
        const distance = position.length();
        controls.distance = distance;
        controls.truckSpeed = 2;
        const { rotation } = this.camera.get();
        const direction = new THREE.Vector3(0, 0, -1).applyEuler(rotation);
        const target = position.addScaledVector(direction, distance);
        controls.moveTo(target.x, target.y, target.z);
    }
}
//# sourceMappingURL=orbit-mode.js.map