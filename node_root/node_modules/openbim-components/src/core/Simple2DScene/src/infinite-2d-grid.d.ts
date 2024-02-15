import * as THREE from "three";
/**
 * An infinite lightweight 2D grid that can be used for any
 * kind of 2d viewports.
 */
export declare class Infinite2dGrid {
    grids: {
        main: THREE.LineSegments;
        secondary: THREE.LineSegments;
    };
    numbers: THREE.Group<THREE.Object3DEventMap>;
    maxRegenerateRetrys: number;
    gridsFactor: number;
    scaleX: number;
    scaleY: number;
    private _group;
    private _frustum;
    private _frustumMat;
    private _camera;
    private _container;
    private _regenerateDelay;
    private _regenerateCounter;
    constructor(camera: THREE.Camera, container: HTMLElement);
    get(): THREE.Group<THREE.Object3DEventMap>;
    dispose(): void;
    regenerate(): void;
    private fillIndices;
    private newNumber;
    private newGrid;
    private isGridReady;
}
