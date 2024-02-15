import { IfcProperties } from "bim-fragment";
export declare class IfcPropertiesUtils {
    static getUnits(properties: IfcProperties): number;
    static findItemByGuid(properties: IfcProperties, guid: string): {
        [attribute: string]: any;
    } | null;
    static findItemOfType(properties: IfcProperties, type: number): {
        [attribute: string]: any;
    } | null;
    static getAllItemsOfType(properties: IfcProperties, type: number): any[];
    static getRelationMap(properties: IfcProperties, relationType: number, onElementsFound?: (relatingID: number, relatedIDs: number[]) => void): {
        [relatingID: number]: number[];
    };
    static getQsetQuantities(properties: IfcProperties, expressID: number, onQuantityFound?: (expressID: number) => void): number[] | null;
    static getPsetProps(properties: IfcProperties, expressID: number, onPropFound?: (expressID: number) => void): number[] | null;
    static getPsetRel(properties: IfcProperties, psetID: number): number | null;
    static getQsetRel(properties: IfcProperties, qsetID: number): number | null;
    static getEntityName(properties: IfcProperties, entityID: number): {
        key: string | null;
        name: string | null;
    };
    static getQuantityValue(properties: IfcProperties, quantityID: number): {
        key: string | null;
        value: number | null;
    };
    static isRel(expressID: number): boolean;
    static attributeExists(properties: IfcProperties, expressID: number, attribute: string): boolean;
    static groupEntitiesByType(properties: IfcProperties, expressIDs: Set<number> | number[]): Map<number, Set<number>>;
}
