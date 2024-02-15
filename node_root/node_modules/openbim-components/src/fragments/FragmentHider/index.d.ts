import { Components } from "../../core";
import { Component, Disposable, FragmentIdMap, UI, UIElement, Event } from "../../base-types";
import { Button, FloatingWindow } from "../../ui";
export declare class FragmentHider extends Component<void> implements Disposable, UI {
    static readonly uuid: "dd9ccf2d-8a21-4821-b7f6-2949add16a29";
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    enabled: boolean;
    uiElement: UIElement<{
        main: Button;
        window: FloatingWindow;
    }>;
    private _localStorageID;
    private _updateVisibilityOnFound;
    private _filterCards;
    constructor(components: Components);
    private setupUI;
    dispose(): Promise<void>;
    set(visible: boolean, items?: FragmentIdMap): void;
    isolate(items: FragmentIdMap): void;
    get(): void;
    update(): Promise<void>;
    loadCached(): Promise<void>;
    private updateCulledVisibility;
    private createStyleCard;
    private updateQueries;
    private deleteStyleCard;
    private hideAllFinders;
    private cache;
}
