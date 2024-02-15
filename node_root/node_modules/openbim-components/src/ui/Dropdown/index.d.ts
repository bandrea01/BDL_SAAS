import { Components } from "../../core";
import { Event } from "../../base-types";
import { SimpleUIComponent } from "../SimpleUIComponent";
export declare class Dropdown extends SimpleUIComponent<HTMLDivElement> {
    name: string;
    options: string[];
    readonly onChange: Event<string>;
    private _allowSearch;
    set value(value: string | null);
    get value(): string | null;
    set allowSearch(value: boolean);
    get allowSearch(): boolean;
    set label(value: string | null);
    get label(): string | null;
    innerElements: {
        label: HTMLLabelElement;
        button: HTMLButtonElement;
        dropdown: HTMLDivElement;
        search: HTMLDivElement;
        searchInput: HTMLInputElement;
        dropdownList: HTMLUListElement;
    };
    constructor(components: Components, name?: string);
    dispose(onlyChildren?: boolean): Promise<void>;
    toggle(): void;
    addOption(...value: string[]): this;
    removeOption(...value: string[]): this;
    private setSearch;
    private setupEvents;
    private hide;
}
