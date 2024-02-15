import * as THREE from "three";
import { NavigationMode } from "./types";
import { Event } from "../../../base-types";
/**
 * A {@link NavigationMode} that allows 3D navigation and panning
 * like in many 3D and CAD softwares.
 */
export declare class OrbitMode implements NavigationMode {
    camera: any;
    /** {@link NavigationMode.enabled} */
    enabled: boolean;
    /** {@link NavigationMode.id} */
    readonly id = "Orbit";
    /** {@link NavigationMode.projectionChanged} */
    readonly projectionChanged: Event<THREE.Camera>;
    constructor(camera: any);
    /** {@link NavigationMode.toggle} */
    toggle(active: boolean): void;
    private activateOrbitControls;
}
