import { BaseSVGAnnotation, UIElement } from "../../base-types";
import { Components } from "../../core";
import { Button } from "../../ui";
import { SVGCircle } from "../SVGCircle";
export declare class CircleAnnotation extends BaseSVGAnnotation {
    readonly name: string;
    canvas: HTMLCanvasElement | null;
    uiElement: UIElement<{
        main: Button;
    }>;
    private _previewElement;
    private _cursorPosition;
    constructor(components: Components);
    private setUI;
    dispose(): Promise<void>;
    start: (e: MouseEvent) => SVGCircle | null;
    cancel: () => void;
    draw: (e: MouseEvent) => void;
}
