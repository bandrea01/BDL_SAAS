import * as WEBIFC from "web-ifc";
import { FragmentsGroup } from "bim-fragment";
import { Component, Disposable, Event, UI, UIElement } from "../../base-types";
import { Components } from "../../core";
import { EntityActionsUI } from "./src/entity-actions";
import { PsetActionsUI } from "./src/pset-actions";
import { PropActionsUI } from "./src/prop-actions";
import { Button } from "../../ui";
type BooleanPropTypes = "IfcBoolean" | "IfcLogical";
type StringPropTypes = "IfcText" | "IfcLabel" | "IfcIdentifier";
type NumericPropTypes = "IfcInteger" | "IfcReal";
interface ChangeMap {
    [modelID: string]: Set<number>;
}
interface AttributeListener {
    [modelID: string]: {
        [expressID: number]: {
            [attributeName: string]: Event<String | Boolean | Number>;
        };
    };
}
export declare class IfcPropertiesManager extends Component<ChangeMap> implements Disposable, UI {
    static readonly uuid: "58c2d9f0-183c-48d6-a402-dfcf5b9a34df";
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    readonly onRequestFile: Event<unknown>;
    ifcToExport: ArrayBuffer | null;
    readonly onElementToPset: Event<{
        model: FragmentsGroup;
        psetID: number;
        elementID: number;
    }>;
    readonly onPropToPset: Event<{
        model: FragmentsGroup;
        psetID: number;
        propID: number;
    }>;
    readonly onPsetRemoved: Event<{
        model: FragmentsGroup;
        psetID: number;
    }>;
    readonly onDataChanged: Event<{
        model: FragmentsGroup;
        expressID: number;
    }>;
    wasm: {
        path: string;
        absolute: boolean;
    };
    enabled: boolean;
    attributeListeners: AttributeListener;
    selectedModel?: FragmentsGroup;
    uiElement: UIElement<{
        entityActions: EntityActionsUI;
        psetActions: PsetActionsUI;
        propActions: PropActionsUI;
        exportButton: Button;
    }>;
    private _changeMap;
    constructor(components: Components);
    get(): ChangeMap;
    dispose(): Promise<void>;
    private setUI;
    private setUIEvents;
    private increaseMaxID;
    static getIFCInfo(model: FragmentsGroup): {
        properties: import("bim-fragment").IfcProperties;
        schema: import("bim-fragment").IfcSchema;
    };
    private newGUID;
    private getOwnerHistory;
    private registerChange;
    setData(model: FragmentsGroup, ...dataToSave: Record<string, any>[]): Promise<void>;
    newPset(model: FragmentsGroup, name: string, description?: string): Promise<{
        pset: WEBIFC.IFC2X3.IfcPropertySet | WEBIFC.IFC4.IfcPropertySet | WEBIFC.IFC4X3.IfcPropertySet;
        rel: WEBIFC.IFC4X3.IfcRelDefinesByProperties | WEBIFC.IFC4.IfcRelDefinesByProperties | WEBIFC.IFC2X3.IfcRelDefinesByProperties;
    }>;
    removePset(model: FragmentsGroup, ...psetID: number[]): Promise<void>;
    private newSingleProperty;
    newSingleStringProperty(model: FragmentsGroup, type: StringPropTypes, name: string, value: string): Promise<WEBIFC.IFC2X3.IfcPropertySingleValue | WEBIFC.IFC4.IfcPropertySingleValue | WEBIFC.IFC4X3.IfcPropertySingleValue>;
    newSingleNumericProperty(model: FragmentsGroup, type: NumericPropTypes, name: string, value: number): Promise<WEBIFC.IFC2X3.IfcPropertySingleValue | WEBIFC.IFC4.IfcPropertySingleValue | WEBIFC.IFC4X3.IfcPropertySingleValue>;
    newSingleBooleanProperty(model: FragmentsGroup, type: BooleanPropTypes, name: string, value: boolean): Promise<WEBIFC.IFC2X3.IfcPropertySingleValue | WEBIFC.IFC4.IfcPropertySingleValue | WEBIFC.IFC4X3.IfcPropertySingleValue>;
    removePsetProp(model: FragmentsGroup, psetID: number, propID: number): Promise<void>;
    addElementToPset(model: FragmentsGroup, psetID: number, ...elementID: number[]): Promise<void>;
    addPropToPset(model: FragmentsGroup, psetID: number, ...propID: number[]): Promise<void>;
    saveToIfc(model: FragmentsGroup, ifcToSaveOn: Uint8Array): Promise<Uint8Array>;
    setAttributeListener(model: FragmentsGroup, expressID: number, attributeName: string): Event<String | Number | Boolean>;
}
export {};
