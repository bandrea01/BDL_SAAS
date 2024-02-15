import { Event } from "../../base-types";
import { Toolbar } from "../ToolbarComponent";
import { Components } from "../../core";
import { SimpleUIComponent } from "../SimpleUIComponent";
interface IButtonOptions {
    materialIconName?: string;
    iconURL?: string;
    id?: string;
    name?: string;
    tooltip?: string;
    closeOnClick?: boolean;
}
export declare class Button extends SimpleUIComponent<HTMLButtonElement> {
    name: string;
    menu: Toolbar;
    readonly onClick: Event<any>;
    static Class: {
        Base: string;
        Label: string;
        Tooltip: string;
    };
    protected _parent: Toolbar | null;
    private _closeOnClick;
    private _popper;
    set tooltip(value: string | null);
    get tooltip(): string | null;
    set label(value: string | null);
    get label(): string | null;
    set parent(toolbar: Toolbar | null);
    get parent(): Toolbar | null;
    set alignment(value: "start" | "center" | "end");
    set materialIcon(name: string | null);
    get materialIcon(): string | null;
    get customIcon(): string;
    innerElements: {
        icon: HTMLSpanElement;
        customIcon: HTMLSpanElement;
        label: HTMLParagraphElement;
        tooltip: HTMLSpanElement;
    };
    constructor(components: Components, options?: IButtonOptions);
    dispose(onlyChildren?: boolean): Promise<void>;
    addChild(...button: Button[]): void;
    closeMenus(): void;
    setCustomIcon(url: string | null): Promise<void>;
    private updateMenuPlacement;
    private isButton;
}
export {};
