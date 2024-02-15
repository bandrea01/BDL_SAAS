import { SimpleUIComponent } from "../SimpleUIComponent";
import { Components } from "../../core";
export declare class SimpleUICard extends SimpleUIComponent<HTMLDivElement> {
    name: string;
    set title(value: string | null);
    get title(): string | null;
    set description(value: string | null);
    get description(): string | null;
    innerElements: {
        title: HTMLHeadElement;
        description: HTMLParagraphElement;
    };
    slots: {
        rightContainer: SimpleUIComponent;
    };
    constructor(components: Components, id?: string);
    addChild(...items: SimpleUIComponent[]): void;
}
