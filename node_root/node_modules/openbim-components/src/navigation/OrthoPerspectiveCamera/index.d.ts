import * as THREE from "three";
import { Components } from "../../core/Components";
import { SimpleCamera } from "../../core/SimpleCamera";
import { Event, UI, UIElement } from "../../base-types";
import { CameraProjection, NavigationMode, NavModeID } from "./src/types";
import { ProjectionManager } from "./src/projections";
import { Button } from "../../ui";
export * from "./src/types";
/**
 * A flexible camera that uses
 * [yomotsu's cameracontrols](https://github.com/yomotsu/camera-controls) to
 * easily control the camera in 2D and 3D. It supports multiple navigation
 * modes, such as 2D floor plan navigation, first person and 3D orbit.
 */
export declare class OrthoPerspectiveCamera extends SimpleCamera implements UI {
    /**
     * The current {@link NavigationMode}.
     */
    currentMode: NavigationMode;
    /**
     * Event that fires when the {@link CameraProjection} changes.
     */
    readonly projectionChanged: Event<THREE.Camera>;
    protected readonly _orthoCamera: THREE.OrthographicCamera;
    protected readonly _projectionManager: ProjectionManager;
    protected readonly _userInputButtons: any;
    protected readonly _frustumSize = 50;
    protected readonly _navigationModes: Map<NavModeID, NavigationMode>;
    uiElement: UIElement<{
        main: Button;
    }>;
    constructor(components: Components);
    private setUI;
    /** {@link Disposable.dispose} */
    dispose(): Promise<void>;
    /**
     * Similar to {@link Component.get}, but with an optional argument
     * to specify which camera to get.
     *
     * @param projection - The camera corresponding to the
     * {@link CameraProjection} specified. If no projection is specified,
     * the active camera will be returned.
     */
    get(projection?: CameraProjection): THREE.PerspectiveCamera | THREE.OrthographicCamera;
    /** Returns the current {@link CameraProjection}. */
    getProjection(): CameraProjection;
    /** Match Ortho zoom with Perspective distance when changing projection mode */
    set matchOrthoDistanceEnabled(value: boolean);
    /**
     * Changes the current {@link CameraProjection} from Ortographic to Perspective
     * and Viceversa.
     */
    toggleProjection(): Promise<void>;
    /**
     * Sets the current {@link CameraProjection}. This triggers the event
     * {@link projectionChanged}.
     *
     * @param projection - The new {@link CameraProjection} to set.
     */
    setProjection(projection: CameraProjection): Promise<void>;
    /**
     * Allows or prevents all user input.
     *
     * @param active - whether to enable or disable user inputs.
     */
    toggleUserInput(active: boolean): void;
    /**
     * Sets a new {@link NavigationMode} and disables the previous one.
     *
     * @param mode - The {@link NavigationMode} to set.
     */
    setNavigationMode(mode: NavModeID): void;
    /**
     * Make the camera view fit all the specified meshes.
     *
     * @param meshes the meshes to fit. If it is not defined, it will
     * evaluate {@link Components.meshes}.
     * @param offset the distance to the fit object
     */
    fit(meshes?: THREE.Mesh[], offset?: number): Promise<void>;
    private disableUserInput;
    private enableUserInput;
    private newOrthoCamera;
    private setOrthoCameraAspect;
    private toggleEvents;
}
