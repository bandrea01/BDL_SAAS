import { Vector2 } from "three";
import { Component, Disposable, SVGAnnotationStyle, Event } from "../../base-types";
import { Components } from "../../core";
export declare class SVGCircle extends Component<SVGCircleElement> implements Disposable {
    id: string;
    name: string;
    enabled: boolean;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    private _circle;
    private _centerPoint;
    private _radius;
    constructor(components: Components, centerPoint?: Vector2, radius?: number);
    dispose(): Promise<void>;
    setStyle(style?: Partial<SVGAnnotationStyle>): void;
    reset(): void;
    clone(): SVGCircle;
    set radius(value: number);
    get radius(): number;
    set cx(value: number);
    set cy(value: number);
    set centerPoint(point: Vector2);
    get centerPoint(): Vector2;
    get(): SVGCircleElement;
}
