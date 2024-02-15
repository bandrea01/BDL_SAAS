import { Components } from "../../core";
import { Event } from "../../base-types";
import { SimpleUIComponent } from "../SimpleUIComponent";
export declare class RangeInput extends SimpleUIComponent<HTMLDivElement> {
    name: string;
    readonly onChange: Event<number>;
    set value(value: number);
    get value(): number;
    set label(value: string | null);
    get label(): string | null;
    set min(value: number);
    get min(): number;
    set max(value: number);
    get max(): number;
    set step(value: number);
    get step(): number;
    innerElements: {
        label: HTMLLabelElement;
        input: HTMLInputElement;
    };
    constructor(components: Components);
}
