import { Components } from "../../core";
import { Event } from "../../base-types";
import { SimpleUIComponent } from "../SimpleUIComponent";
export declare class CheckboxInput extends SimpleUIComponent<HTMLDivElement> {
    name: string;
    readonly onChange: Event<boolean>;
    set value(value: boolean);
    get value(): boolean;
    set label(value: string | null);
    get label(): string | null;
    innerElements: {
        label: HTMLLabelElement;
        input: HTMLInputElement;
    };
    constructor(components: Components);
    dispose(onlyChildren?: boolean): Promise<void>;
}
