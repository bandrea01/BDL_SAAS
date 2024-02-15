import { BaseSVGAnnotation, UI, UIElement } from "../../base-types";
import { Components } from "../../core";
import { Button } from "../../ui";
import { SVGText } from "../SVGText";
export declare class TextAnnotation extends BaseSVGAnnotation implements UI {
    readonly name: string;
    uiElement: UIElement<{
        main: Button;
    }>;
    canvas: HTMLCanvasElement | null;
    private _previewElement;
    constructor(components: Components);
    private setUI;
    dispose(): Promise<void>;
    cancel: () => void;
    start: (e: MouseEvent) => SVGText | null;
    draw: (e: MouseEvent) => void;
}
