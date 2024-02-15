import { Components } from "../../../core";
import { CameraProjection } from "./types";
/**
 * Object to control the {@link CameraProjection} of the {@link OrthoPerspectiveCamera}.
 */
export declare class ProjectionManager {
    private components;
    get projection(): CameraProjection;
    private _currentProjection;
    private _currentCamera;
    private _camera;
    private _previousDistance;
    matchOrthoDistanceEnabled: boolean;
    constructor(components: Components, camera: any);
    /**
     * Sets the {@link CameraProjection} of the {@link OrthoPerspectiveCamera}.
     *
     * @param projection - the new projection to set. If it is the current projection,
     * it will have no effect.
     */
    setProjection(projection: CameraProjection): Promise<void>;
    private setOrthoCamera;
    private updateActiveCamera;
    private getDims;
    private setupOrthoCamera;
    private getDistance;
    private setPerspectiveCamera;
}
