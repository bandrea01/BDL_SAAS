import { Vector2 } from "three";
import { Component, Disposable, SVGAnnotationStyle, Event } from "../../base-types";
import { Components } from "../../core";
export declare class SVGText extends Component<SVGTextElement> implements Disposable {
    id: string;
    name: string;
    enabled: boolean;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    private _startPoint;
    private _text;
    constructor(components: Components, text?: string, startPoint?: Vector2);
    dispose(): Promise<void>;
    setStyle(style?: Partial<SVGAnnotationStyle>): void;
    set text(value: string);
    get text(): string;
    reset(): void;
    clone(): SVGText;
    set x(value: number);
    set y(value: number);
    set startPoint(point: Vector2);
    get startPoint(): Vector2;
    get(): SVGTextElement;
}
