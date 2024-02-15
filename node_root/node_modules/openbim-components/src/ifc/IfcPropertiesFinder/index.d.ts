import { FragmentsGroup } from "bim-fragment";
import { Disposable, Event, FragmentIdMap, UI, Component, UIElement } from "../../base-types";
import { Button, FloatingWindow } from "../../ui";
import { Components } from "../../core";
import { QueryGroup } from "./src/types";
import { QueryBuilder } from "./src/query-builder";
export interface QueryResult {
    [modelID: string]: {
        modelEntities: Set<number>;
        otherEntities: Set<number>;
    };
}
export interface IndexedModels {
    [modelID: string]: {
        [expressID: number]: Set<number>;
    };
}
export declare class IfcPropertiesFinder extends Component<IndexedModels> implements UI, Disposable {
    readonly onFound: Event<FragmentIdMap>;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    enabled: boolean;
    uiElement: UIElement<{
        main: Button;
        queryWindow: FloatingWindow;
        query: QueryBuilder;
    }>;
    private readonly _conditionFunctions;
    private _localStorageID;
    private _indexedModels;
    private _noHandleAttributes;
    constructor(components: Components);
    private onFragmentsDisposed;
    init(): void;
    get(): IndexedModels;
    dispose(): Promise<void>;
    loadCached(id?: string): void;
    deleteCache(): void;
    private setUI;
    private indexEntityRelations;
    find(queryGroups?: QueryGroup[], queryModels?: FragmentsGroup[]): Promise<FragmentIdMap>;
    private toFragmentMap;
    private simpleQuery;
    private getMatchingEntities;
    private combineArrays;
    private getCommonElements;
    private arrayIntersection;
    private arrayUnion;
    private cache;
    private getConditionFunctions;
}
