import { Component, Event } from "../../base-types";
import { Components } from "../../core";
/**
 * An object to easily use the services of That Open Platform.
 */
export declare class CloudStorage extends Component<any[]> {
    tools: Component<any>[];
    static readonly uuid: "6fe6c739-d518-47b8-8057-a22a6c96e722";
    /** {@link Component.name} */
    name: string;
    /** {@link Component.enabled} */
    enabled: boolean;
    modelProcessed: Event<unknown>;
    checkInterval: number;
    private _models;
    private _token?;
    private _urls;
    constructor(components: Components);
    /**
     * Retrieves a tool component by its name.
     */
    get(): any[];
    /**
     * The authentication token generated in
     * [That Open Platform](https://platform.thatopen.com/app)
     */
    get token(): string;
    /**
     * The authentication token generated in
     * [That Open Platform](https://platform.thatopen.com/app)
     */
    set token(value: string);
    update(): Promise<void>;
    upload(fileUrl: string): Promise<void>;
    delete(modelID: string): Promise<any>;
    getModel(modelID: string): Promise<any>;
    private setupModelProcessEvent;
    private createModel;
}
