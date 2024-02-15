import * as WEBIFC from "web-ifc";
import { IfcCivil, IfcGeometries } from "./types";
export declare class GeometryReader {
    private _webIfc?;
    saveLocations: boolean;
    items: IfcGeometries;
    locations: {
        [itemID: number]: [number, number, number];
    };
    CivilItems: IfcCivil;
    get webIfc(): WEBIFC.IfcAPI;
    cleanUp(): void;
    streamMesh(webifc: WEBIFC.IfcAPI, mesh: WEBIFC.FlatMesh, forceTransparent?: boolean): void;
    streamAlignment(webifc: WEBIFC.IfcAPI): void;
    streamCrossSection(webifc: WEBIFC.IfcAPI): void;
    private newBufferGeometry;
    private getIndices;
    private getVertices;
    private constructBuffer;
}
