import { Component, Configurable, Disposable, Event, UI, UIElement } from "../../base-types";
import { Button, ColorInput, FloatingWindow, RangeInput, SimpleUIComponent, TextInput } from "../../ui";
import { Components } from "../../core";
export interface ClipStyleCardData {
    name: string;
    fillColor: string;
    lineColor: string;
    lineThickness: number;
    categories: string;
}
export interface FragmentClipStylerConfig {
    force: boolean;
}
export declare class FragmentClipStyler extends Component<ClipStyleCardData[]> implements UI, Disposable, Configurable<FragmentClipStylerConfig> {
    static readonly uuid: "14de9fbd-2151-4c01-8e07-22a2667e1126";
    readonly onChange: Event<unknown>;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    enabled: boolean;
    localStorageID: string;
    styleCards: {
        [id: string]: {
            styleCard: SimpleUIComponent<any>;
            name: TextInput;
            lineThickness: RangeInput;
            categories: TextInput;
            deleteButton: Button;
            lineColor: ColorInput;
            fillColor: ColorInput;
        };
    };
    uiElement: UIElement<{
        mainButton: Button;
        mainWindow: FloatingWindow;
    }>;
    private _defaultStyles;
    constructor(components: Components);
    config: FragmentClipStylerConfig;
    readonly onSetup: Event<FragmentClipStyler>;
    setup(config?: Partial<FragmentClipStylerConfig>): Promise<void>;
    get(): ClipStyleCardData[];
    dispose(): Promise<void>;
    update(ids?: string[]): Promise<void>;
    loadCachedStyles(): Promise<void>;
    private setupUI;
    private cacheStyles;
    private deleteStyleCard;
    private createStyleCard;
}
