import { Components } from "../../core";
import { Event } from "../../base-types";
import { SimpleUIComponent } from "../SimpleUIComponent";
export declare class ColorInput extends SimpleUIComponent<HTMLDivElement> {
    name: string;
    readonly onChange: Event<string>;
    set value(value: string);
    get value(): string;
    set label(value: string | null);
    get label(): string | null;
    innerElements: {
        label: HTMLLabelElement;
        input: HTMLInputElement;
    };
    constructor(components: Components);
    dispose(onlyChildren?: boolean): Promise<void>;
}
