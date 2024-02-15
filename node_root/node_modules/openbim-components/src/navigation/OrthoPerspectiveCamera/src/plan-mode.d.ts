import * as THREE from "three";
import { NavigationMode } from "./types";
import { Event } from "../../../base-types";
/**
 * A {@link NavigationMode} that allows to navigate floorplans in 2D,
 * like many BIM tools.
 */
export declare class PlanMode implements NavigationMode {
    private camera;
    /** {@link NavigationMode.enabled} */
    enabled: boolean;
    /** {@link NavigationMode.id} */
    readonly id = "Plan";
    /** {@link NavigationMode.projectionChanged} */
    readonly projectionChanged: Event<THREE.Camera>;
    private mouseAction1?;
    private mouseAction2?;
    private mouseInitialized;
    private readonly defaultAzimuthSpeed;
    private readonly defaultPolarSpeed;
    constructor(camera: any);
    /** {@link NavigationMode.toggle} */
    toggle(active: boolean): void;
}
