import { FragmentsGroup } from "bim-fragment";
import { Button, FloatingWindow, SimpleUIComponent } from "../../ui";
import { Disposable, Event, UI, UIElement, Component } from "../../base-types";
import { Components } from "../../core";
import { IfcPropertiesManager } from "../IfcPropertiesManager";
export * from "./src";
interface IndexMap {
    [modelID: string]: {
        [expressID: string]: Set<number>;
    };
}
export declare class IfcPropertiesProcessor extends Component<IndexMap> implements UI, Disposable {
    static readonly uuid: "23a889ab-83b3-44a4-8bee-ead83438370b";
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    enabled: boolean;
    uiElement: UIElement<{
        topToolbar: SimpleUIComponent;
        propsList: SimpleUIComponent;
        propertiesWindow: FloatingWindow;
        main: Button;
    }>;
    relationsToProcess: number[];
    entitiesToIgnore: number[];
    attributesToIgnore: string[];
    private _indexMap;
    private readonly _renderFunctions;
    private _propertiesManager;
    private _currentUI;
    readonly onPropertiesManagerSet: Event<IfcPropertiesManager>;
    set propertiesManager(manager: IfcPropertiesManager | null);
    get propertiesManager(): IfcPropertiesManager | null;
    constructor(components: Components);
    private onFragmentsDisposed;
    private getRenderFunctions;
    dispose(): Promise<void>;
    getProperties(model: FragmentsGroup, id: string): any[] | null;
    private getNestedPsets;
    private getPsetProperties;
    private setUI;
    cleanPropertiesList(): Promise<void>;
    get(): IndexMap;
    process(model: FragmentsGroup): void;
    renderProperties(model: FragmentsGroup, expressID: number): Promise<void>;
    private newEntityUI;
    private setEntityIndex;
    private newAttributesUI;
    private newPsetUI;
    private newQsetUI;
    private addPsetActions;
    private addEntityActions;
    private newEntityTree;
    private newPropertyTag;
    private cloneProperty;
    private clonePropertyArray;
}
