import * as WEBIFC from "web-ifc";
import { Event } from "../../base-types";
/**
 * Object to export all the properties from an IFC to a JS object.
 */
export declare class IfcJsonExporter {
    readonly onLoadProgress: Event<{
        progress: number;
        total: number;
    }>;
    readonly onPropertiesSerialized: Event<any>;
    size?: number;
    private _progress;
    /**
     * Exports all the properties of an IFC into an array of JS objects.
     * @webIfc The instance of [web-ifc]{@link https://github.com/ifcjs/web-ifc} to use.
     * @modelID ID of the IFC model whose properties to extract.
     */
    export(webIfc: WEBIFC.IfcAPI, modelID: number): Promise<void>;
    private getAllGeometriesIDs;
    private getStructure;
}
