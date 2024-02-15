import { MapboxBuilding, MapboxParameters } from "./src/types";
/**
 * The main element to create a mapbox-IFC.js application.
 */
export declare class MapboxWindow {
    minTargetZoom: number;
    private readonly _components;
    private readonly _map;
    private readonly _center;
    private readonly _style;
    private _labels;
    private _buildings;
    /**
     * @param config: information needed to initialize the scene, including
     * the Mapbox access token and the HTML div element to display the scene.
     */
    constructor(config: MapboxParameters);
    /**
     * Add a new set of buildings to the GIS scene.
     *
     * @param buildings The array of {@link MapboxBuilding} to add.
     * @param fitToScreen Whether to center the camera to see all buildings.
     */
    add(buildings: MapboxBuilding[], fitToScreen?: boolean): void;
    /**
     * Removes a building from the map.
     *
     * @param id The {@link MapboxBuilding} to remove.
     */
    remove(id: string): void;
    /**
     * Removes all buildings from the map.
     */
    removeAll(): void;
    /**
     * Disposes all the data of the map. This needs to be called if the
     * component that contains the map is deleted: otherwise, a memory leak
     * will be created.
     */
    dispose(): Promise<void>;
    centerMapToBuildings(): void;
    private newMap;
    private setupComponents;
    private setupScene;
}
