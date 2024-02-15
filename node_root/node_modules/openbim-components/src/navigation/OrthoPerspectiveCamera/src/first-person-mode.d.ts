import * as THREE from "three";
import { NavigationMode } from "./types";
import { Event } from "../../../base-types";
/**
 * A {@link NavigationMode} that allows first person navigation,
 * simulating FPS video games.
 */
export declare class FirstPersonMode implements NavigationMode {
    private camera;
    /** {@link NavigationMode.enabled} */
    enabled: boolean;
    /** {@link NavigationMode.id} */
    readonly id = "FirstPerson";
    /** {@link NavigationMode.projectionChanged} */
    readonly projectionChanged: Event<THREE.Camera>;
    constructor(camera: any);
    /** {@link NavigationMode.toggle} */
    toggle(active: boolean): void;
    private setupFirstPersonCamera;
}
