import { Disposable, UI, Event } from "./base-types";
import { Component } from "./component";
import { Button } from "../ui";
import { UIElement } from "./ui-element";
export interface SVGAnnotationStyle {
    fillColor: string;
    strokeWidth: number;
    strokeColor: string;
}
export declare abstract class BaseSVGAnnotation extends Component<null> implements UI, Disposable {
    id: string;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    abstract uiElement: UIElement<{
        main: Button;
    }>;
    protected _enabled: boolean;
    protected _isDrawing: boolean;
    protected _svgViewport?: SVGElement | null;
    set svgViewport(value: SVGElement | undefined | null);
    get svgViewport(): SVGElement | undefined | null;
    set enabled(value: boolean);
    get enabled(): boolean;
    get canDraw(): false | SVGElement | null | undefined;
    get(): null;
    dispose(): Promise<void>;
    private setupEvents;
    start: (_event: MouseEvent) => Component<SVGGElement> | null;
    draw: (_event: MouseEvent) => void;
    end: (_event: MouseEvent) => void;
    cancel: (event: any) => any;
}
