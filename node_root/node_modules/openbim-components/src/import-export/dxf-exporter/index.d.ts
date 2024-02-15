import { EdgeProjector } from "./src/edge-projector";
import { Component } from "../../base-types";
import { Components } from "../../core";
export declare class DXFExporter extends Component<EdgeProjector> {
    static readonly uuid: "568f2167-24a3-4519-b552-3b04cc74a6a6";
    enabled: boolean;
    precission: number;
    private _projector;
    constructor(components: Components);
    get(): EdgeProjector;
    dispose(): void;
    export(name: string): Promise<string>;
    private drawGeometry;
}
