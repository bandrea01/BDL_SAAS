import { Vector2 } from "three";
import { Component, Disposable, SVGAnnotationStyle, UI, UIElement, Event, Configurable } from "../../base-types";
import { FloatingWindow, Toolbar } from "../../ui";
import { Components } from "../Components";
export interface SVGViewportConfig extends SVGAnnotationStyle {
}
export declare class SimpleSVGViewport extends Component<SVGElement> implements UI, Disposable, Configurable<SVGViewportConfig> {
    uiElement: UIElement<{
        toolbar: Toolbar;
        settingsWindow: FloatingWindow;
    }>;
    id: string;
    private _enabled;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    private _viewport;
    private _size;
    private _undoList;
    get enabled(): boolean;
    set enabled(value: boolean);
    constructor(components: Components);
    config: Required<SVGViewportConfig>;
    readonly onSetup: Event<SimpleSVGViewport>;
    setup(config?: Partial<SVGViewportConfig>): Promise<void>;
    dispose(): Promise<void>;
    get(): SVGElement;
    clear(): void;
    getDrawing(): NodeListOf<ChildNode>;
    /** {@link Resizeable.resize}. */
    resize(): void;
    /** {@link Resizeable.getSize}. */
    getSize(): Vector2;
    private setupEvents;
    private onResize;
    private setUI;
}
