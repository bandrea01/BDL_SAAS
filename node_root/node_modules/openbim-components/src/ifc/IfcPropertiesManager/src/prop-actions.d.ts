import { FragmentsGroup } from "bim-fragment";
import { Components } from "../../../core";
import { SimpleUIComponent, Button } from "../../../ui";
import { Event } from "../../../base-types";
export declare class PropActionsUI extends SimpleUIComponent<HTMLDivElement> {
    editPropBtn: Button;
    removePropBtn: Button;
    modalVisible: boolean;
    private _modal;
    readonly onEditProp: Event<{
        model: FragmentsGroup;
        expressID: number;
        name: string;
        value: string;
    }>;
    readonly onRemoveProp: Event<{
        model: FragmentsGroup;
        expressID: number;
        setID: number;
    }>;
    data: {
        model?: FragmentsGroup;
        expressID?: number;
        setID?: number;
        valueKey?: string;
    };
    constructor(components: Components);
    dispose(onlyChildren?: boolean): Promise<void>;
    private setEditUI;
    private setRemoveUI;
}
