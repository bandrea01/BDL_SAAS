import { Vector2 } from "three";
import { Component, Disposable, SVGAnnotationStyle, Event } from "../../base-types";
import { Components } from "../../core";
export declare class SVGRectangle extends Component<SVGRectElement> implements Disposable {
    id: string;
    name: string;
    enabled: boolean;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    private _startPoint;
    private _endPoint;
    private _dimensions;
    private _rect;
    constructor(components: Components, startPoint?: Vector2, endPoint?: Vector2);
    dispose(): Promise<void>;
    setStyle(style?: Partial<SVGAnnotationStyle>): void;
    reset(): void;
    clone(): SVGRectangle;
    set x1(value: number);
    set y1(value: number);
    set startPoint(point: Vector2);
    get startPoint(): Vector2;
    set x2(value: number);
    set y2(value: number);
    set endPoint(point: Vector2);
    get endPoint(): Vector2;
    set width(value: number);
    get width(): number;
    set height(value: number);
    get height(): number;
    set dimensions(value: Vector2);
    get dimensions(): Vector2;
    get(): SVGRectElement;
}
