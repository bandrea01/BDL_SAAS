import { UI, BaseSVGAnnotation, Disposable, UIElement, Event } from "../../base-types";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";
import { SimpleSVGViewport } from "../../core/SimpleSVGViewport";
import { Button } from "../../ui/ButtonComponent";
import { Toolbar } from "../../ui/ToolbarComponent";
export declare class DrawManager extends Component<null> implements UI, Disposable {
    static readonly uuid = "4ab8b0f4-665d-4ea2-8f6e-66c98ed04392";
    name: string;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    uiElement: UIElement<{
        main: Button;
        drawingTools: Toolbar;
    }>;
    viewport: SimpleSVGViewport;
    drawingTools: {
        [name: string]: BaseSVGAnnotation;
    };
    drawings: {
        [name: string]: SVGGElement;
    };
    private _enabled;
    private _isDrawing;
    get isDrawing(): boolean;
    set isDrawing(value: boolean);
    get enabled(): boolean;
    set enabled(value: boolean);
    constructor(components: Components);
    dispose(): Promise<void>;
    saveDrawing(name: string): SVGGElement;
    addDrawingTool(name: string, tool: BaseSVGAnnotation): void;
    activateTool(tool: BaseSVGAnnotation): void;
    get activeTool(): BaseSVGAnnotation | undefined;
    private setUI;
    get(): null;
}
