import * as THREE from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { Simple2DMarker, Components } from "../../../core";
import { Hideable, Event, Disposable, Component } from "../../../base-types";
interface Angle {
    points: THREE.Vector3[];
    angle: number;
}
export declare class AngleMeasureElement extends Component<Angle> implements Hideable, Disposable {
    enabled: boolean;
    visible: boolean;
    points: THREE.Vector3[];
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    private _components;
    private _lineMaterial;
    private _lineGeometry;
    private _line;
    private _labelMarker;
    readonly onAngleComputed: Event<number>;
    readonly onPointAdded: Event<THREE.Vector3>;
    set lineMaterial(material: LineMaterial);
    get lineMaterial(): LineMaterial;
    set labelMarker(marker: Simple2DMarker);
    get labelMarker(): Simple2DMarker;
    private get scene();
    constructor(components: Components, points?: THREE.Vector3[]);
    setPoint(point: THREE.Vector3, index?: 0 | 1 | 2): void;
    toggleLabel(): void;
    computeAngle(): number;
    dispose(): Promise<void>;
    get(): Angle;
}
export {};
