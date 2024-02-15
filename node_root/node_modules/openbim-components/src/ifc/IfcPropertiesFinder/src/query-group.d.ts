import { Components } from "../../../core";
import { SimpleUIComponent, Button, Dropdown } from "../../../ui";
import { QueryGroup } from "./types";
export declare class QueryGroupUI extends SimpleUIComponent {
    operator: Dropdown;
    removeBtn: Button;
    get query(): QueryGroup;
    set query(value: QueryGroup);
    constructor(components: Components);
    dispose(onlyChildren?: boolean): Promise<void>;
}
