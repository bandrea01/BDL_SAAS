import { Vector2 } from "three";
import { Component, Disposable, SVGAnnotationStyle, Event } from "../../base-types";
import { Components } from "../../core";
export declare class SVGArrow extends Component<SVGGElement> implements Disposable {
    name: string;
    enabled: boolean;
    id: string;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    private _line;
    private _polygon;
    private _marker;
    private _arrow;
    private _startPoint;
    private _endPoint;
    constructor(components: Components, startPoint?: Vector2, endPoint?: Vector2);
    dispose(): Promise<void>;
    setStyle(style?: Partial<SVGAnnotationStyle>): void;
    reset(): void;
    clone(): SVGArrow;
    set x1(value: number);
    set y1(value: number);
    set startPoint(point: Vector2);
    get startPoint(): Vector2;
    set x2(value: number);
    set y2(value: number);
    set endPoint(point: Vector2);
    get endPoint(): Vector2;
    get(): SVGGElement;
}
