import { Components } from "../../../core";
import { SimpleUIComponent, Dropdown, Button, TextInput } from "../../../ui";
import { AttributeQuery } from "./types";
export declare class AttributeQueryUI extends SimpleUIComponent {
    operator: Dropdown;
    attribute: Dropdown;
    condition: Dropdown;
    value: TextInput;
    ifcTypes: Dropdown;
    removeBtn: Button;
    negate: Dropdown;
    get query(): AttributeQuery;
    set query(value: AttributeQuery);
    private getTypeConstant;
    constructor(components: Components);
    dispose(onlyChildren?: boolean): Promise<void>;
}
