import * as THREE from "three";
import { Fragment } from "bim-fragment";
import { Disposable, Updateable, Event, FragmentIdMap, Configurable } from "../../base-types";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";
interface HighlightEvents {
    [highlighterName: string]: {
        onHighlight: Event<FragmentIdMap>;
        onClear: Event<null>;
    };
}
interface HighlightMaterials {
    [name: string]: THREE.Material[] | undefined;
}
export interface FragmentHighlighterConfig {
    selectName: string;
    hoverName: string;
    selectionMaterial: THREE.Material;
    hoverMaterial: THREE.Material;
    autoHighlightOnClick: boolean;
    cullHighlightMeshes: boolean;
}
export declare class FragmentHighlighter extends Component<HighlightMaterials> implements Disposable, Updateable, Configurable<FragmentHighlighterConfig> {
    static readonly uuid: "cb8a76f2-654a-4b50-80c6-66fd83cafd77";
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    /** {@link Updateable.onBeforeUpdate} */
    readonly onBeforeUpdate: Event<FragmentHighlighter>;
    /** {@link Updateable.onAfterUpdate} */
    readonly onAfterUpdate: Event<FragmentHighlighter>;
    enabled: boolean;
    highlightMats: HighlightMaterials;
    events: HighlightEvents;
    multiple: "none" | "shiftKey" | "ctrlKey";
    zoomFactor: number;
    zoomToSelection: boolean;
    selection: {
        [selectionID: string]: FragmentIdMap;
    };
    excludeOutline: Set<string>;
    fillEnabled: boolean;
    outlineMaterial: THREE.MeshBasicMaterial;
    private _eventsActive;
    private _outlineEnabled;
    private _outlinedMeshes;
    private _invisibleMaterial;
    private _tempMatrix;
    config: Required<FragmentHighlighterConfig>;
    private _mouseState;
    get outlineEnabled(): boolean;
    set outlineEnabled(value: boolean);
    private get _postproduction();
    constructor(components: Components);
    private onFragmentsDisposed;
    get(): HighlightMaterials;
    getHoveredSelection(): FragmentIdMap;
    private disposeOutlinedMeshes;
    dispose(): Promise<void>;
    add(name: string, material?: THREE.Material[]): Promise<void>;
    /** {@link Updateable.update} */
    update(): Promise<void>;
    highlight(name: string, removePrevious?: boolean, zoomToSelection?: boolean): Promise<{
        id: string;
        fragments: Fragment[];
    } | null>;
    highlightByID(name: string, ids: FragmentIdMap, removePrevious?: boolean, zoomToSelection?: boolean): Promise<void>;
    /**
     * Clears any selection previously made by calling {@link highlight}.
     */
    clear(name?: string): Promise<void>;
    readonly onSetup: Event<FragmentHighlighter>;
    setup(config?: Partial<FragmentHighlighterConfig>): Promise<void>;
    private regenerate;
    private zoomSelection;
    private addComposites;
    private clearStyle;
    private updateFragmentFill;
    private checkSelection;
    private addHighlightToFragment;
    private clearFills;
    private clearOutlines;
    private updateFragmentOutline;
    private setupEvents;
    private onMouseDown;
    private onMouseUp;
    private onMouseMove;
}
export {};
