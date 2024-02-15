import * as THREE from "three";
import { Simple2DMarker, Components } from "../../../core";
import { Hideable, Event, Disposable, Component } from "../../../base-types";
interface Area {
    points: THREE.Vector3[];
    workingPlane: THREE.Plane | null;
    area: number;
}
export declare class AreaMeasureElement extends Component<Area> implements Hideable, Disposable {
    name: string;
    enabled: boolean;
    visible: boolean;
    points: THREE.Vector3[];
    workingPlane: THREE.Plane | null;
    labelMarker: Simple2DMarker;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    private _rotationMatrix;
    private _dimensionLines;
    private _defaultLineMaterial;
    readonly onAreaComputed: Event<number>;
    readonly onWorkingPlaneComputed: Event<THREE.Plane>;
    readonly onPointAdded: Event<THREE.Vector3>;
    readonly onPointRemoved: Event<THREE.Vector3>;
    constructor(components: Components, points?: THREE.Vector3[]);
    setPoint(point: THREE.Vector3, index?: number): void;
    removePoint(index: number): void;
    toggleLabel(): void;
    private addDimensionLine;
    private getLinesBetweenIndex;
    computeWorkingPlane(): void;
    computeArea(): number;
    dispose(): Promise<void>;
    get(): Area;
}
export {};
