import { FragmentsGroup } from "bim-fragment";
import { Components } from "../../../core/Components";
import { PropertyTag } from "./property-tag";
import { IfcPropertiesProcessor } from "..";
export declare class AttributeTag extends PropertyTag {
    name: string;
    model: FragmentsGroup;
    expressID: number;
    attributeName: string;
    constructor(components: Components, propertiesProcessor: IfcPropertiesProcessor, model: FragmentsGroup, expressID: number, attributeName?: string);
    dispose(onlyChildren?: boolean): Promise<void>;
    protected setListeners(): void;
    protected setInitialValues(): void;
}
