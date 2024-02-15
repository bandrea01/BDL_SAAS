import { BaseSVGAnnotation, UIElement } from "../../base-types";
import { Components } from "../../core";
import { Button } from "../../ui";
import { SVGArrow } from "../SVGArrow";
export declare class ArrowAnnotation extends BaseSVGAnnotation {
    readonly name: string;
    canvas: HTMLCanvasElement | null;
    uiElement: UIElement<{
        main: Button;
    }>;
    private _previewElement;
    constructor(components: Components);
    private setUI;
    dispose(): Promise<void>;
    cancel: () => void;
    start: (event: MouseEvent) => SVGArrow | null;
    draw: (e: MouseEvent) => void;
}
