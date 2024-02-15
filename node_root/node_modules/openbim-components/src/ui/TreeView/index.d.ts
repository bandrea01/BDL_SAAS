import { Event } from "../../base-types/base-types";
import { Components } from "../../core";
import { SimpleUIComponent } from "../SimpleUIComponent";
export declare class TreeView extends SimpleUIComponent<HTMLDivElement> {
    private _expanded;
    readonly onExpand: Event<unknown>;
    readonly onCollapse: Event<unknown>;
    readonly onClick: Event<PointerEvent>;
    set description(value: string | null);
    get description(): string | null;
    set title(value: string | null);
    get title(): string | null;
    set materialIcon(name: string);
    get expanded(): boolean;
    set expanded(expanded: boolean);
    set onmouseover(listener: (e?: MouseEvent) => void);
    innerElements: {
        titleContainer: HTMLDivElement;
        title: HTMLParagraphElement;
        description: HTMLParagraphElement;
        expandBtn: HTMLSpanElement;
    };
    slots: {
        content: SimpleUIComponent<HTMLDivElement>;
        titleRight: SimpleUIComponent<HTMLDivElement>;
    };
    constructor(components: Components, title?: string);
    dispose(onlyChildren?: boolean): Promise<void>;
    toggle(deep?: boolean): void;
    addChild(...items: SimpleUIComponent[]): void;
    collapse(deep?: boolean): void;
    expand(deep?: boolean): void;
}
