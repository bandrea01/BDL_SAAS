import { Createable, Disposable, Event, UI, Component, UIElement } from "../../base-types";
import { Components } from "../../core";
import { Button } from "../../ui";
import { SimpleDimensionLine } from "../SimpleDimensionLine";
export declare class EdgeMeasurement extends Component<void> implements Createable, UI, Disposable {
    static readonly uuid: "e7be5749-89df-4514-8d25-83aa38ce12d8";
    uiElement: UIElement<{
        main: Button;
    }>;
    preview: SimpleDimensionLine;
    tolerance: number;
    readonly onBeforeCreate: Event<any>;
    readonly onAfterCreate: Event<any>;
    readonly onBeforeCancel: Event<any>;
    readonly onAfterCancel: Event<any>;
    readonly onBeforeDelete: Event<any>;
    readonly onAfterDelete: Event<any>;
    readonly onDisposed: Event<any>;
    private _enabled;
    private _lineMaterial;
    set enabled(value: boolean);
    get enabled(): boolean;
    constructor(components: Components);
    dispose(): Promise<void>;
    private setUI;
    create: () => Promise<void>;
    delete(): Promise<void>;
    deleteAll(): Promise<void>;
    endCreation(): void;
    cancelCreation(): void;
    get(): number[][];
    set(dimensions: number[][]): void;
    private setupEvents;
    private onMouseMove;
    private onKeydown;
    private updateSelection;
}
