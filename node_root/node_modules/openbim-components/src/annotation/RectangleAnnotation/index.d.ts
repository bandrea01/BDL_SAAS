import { BaseSVGAnnotation, UIElement } from "../../base-types";
import { Components } from "../../core";
import { Button } from "../../ui";
import { SVGRectangle } from "../SVGRectangle";
export declare class RectangleAnnotation extends BaseSVGAnnotation {
    readonly name: string;
    canvas: HTMLCanvasElement | null;
    uiElement: UIElement<{
        main: Button;
    }>;
    private _previewElement;
    private _startPoint;
    constructor(components: Components);
    private setUI;
    dispose(): Promise<void>;
    start: (e: MouseEvent) => SVGRectangle | null;
    cancel: () => void;
    draw: (e: MouseEvent) => void;
}
