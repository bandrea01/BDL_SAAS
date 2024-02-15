import { FragmentsGroup } from "bim-fragment";
import { Components } from "../../../core";
import { SimpleUIComponent, Button } from "../../../ui";
import { Event } from "../../../base-types";
type StringPropTypes = "IfcText" | "IfcLabel" | "IfcIdentifier";
export declare class PsetActionsUI extends SimpleUIComponent<HTMLDivElement> {
    editPsetBtn: Button;
    removePsetBtn: Button;
    addPropBtn: Button;
    modalVisible: boolean;
    private _modal;
    readonly onEditPset: Event<{
        model: FragmentsGroup;
        psetID: number;
        name: string;
        description: string;
    }>;
    readonly onRemovePset: Event<{
        model: FragmentsGroup;
        psetID: number;
    }>;
    readonly onNewProp: Event<{
        model: FragmentsGroup;
        psetID: number;
        name: string;
        type: StringPropTypes;
        value: string;
    }>;
    data: {
        model?: FragmentsGroup;
        psetID?: number;
    };
    constructor(components: Components);
    dispose(onlyChildren?: boolean): Promise<void>;
    private setEditUI;
    private setRemoveUI;
    private setAddPropUI;
}
export {};
