import { FragmentsGroup } from "bim-fragment";
import { Components } from "../../../core";
import { TreeView } from "../../../ui";
import { IfcPropertiesProcessor } from "..";
export declare class AttributeSet extends TreeView {
    name: string;
    model: FragmentsGroup;
    attributesToIgnore: string[];
    private _expressID;
    private _attributes;
    private _generated;
    private _propertiesProcessor;
    set expressID(value: number);
    get expressID(): number;
    constructor(components: Components, propertiesProcessor: IfcPropertiesProcessor, model: FragmentsGroup, expressID: number);
    dispose(onlyChildren?: boolean): Promise<void>;
    private generate;
    update(): void;
}
