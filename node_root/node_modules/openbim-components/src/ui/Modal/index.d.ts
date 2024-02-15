import { Event } from "../../base-types";
import { Components } from "../../core";
import { SimpleUIComponent } from "../SimpleUIComponent";
export declare class Modal extends SimpleUIComponent<HTMLDialogElement> {
    readonly onAccept: Event<unknown>;
    readonly onCancel: Event<unknown>;
    set description(value: string | null);
    get description(): string | null;
    set title(value: string | null);
    get title(): string | null;
    set visible(value: boolean);
    get visible(): boolean;
    slots: {
        content: SimpleUIComponent<HTMLDivElement>;
        actionButtons: SimpleUIComponent<HTMLDivElement>;
    };
    innerElements: {
        title: HTMLHeadElement;
        description: HTMLParagraphElement;
    };
    constructor(components: Components, title?: string);
    dispose(onlyChildren?: boolean): Promise<void>;
}
