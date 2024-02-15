import { FragmentsGroup } from "bim-fragment";
import { SimpleUIComponent } from "../../../ui/SimpleUIComponent";
import { Components } from "../../../core/Components";
import { IfcPropertiesProcessor } from "..";
export declare class PropertyTag extends SimpleUIComponent<HTMLDivElement> {
    name: string;
    expressID: number;
    model: FragmentsGroup;
    protected _propertiesProcessor: IfcPropertiesProcessor;
    get label(): string | null;
    set label(value: string | null);
    get value(): string | number | boolean | null;
    set value(value: string | number | boolean | null);
    innerElements: {
        label: HTMLParagraphElement;
        value: HTMLParagraphElement;
    };
    constructor(components: Components, propertiesProcessor: IfcPropertiesProcessor, model: FragmentsGroup, expressID: number);
    dispose(onlyChildren?: boolean): Promise<void>;
    protected setListeners(): void;
    protected setInitialValues(): void;
}
