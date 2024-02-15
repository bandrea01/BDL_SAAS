import { Component, Disposable, Event } from "../../base-types";
import { Toolbar } from "../ToolbarComponent";
import { Components } from "../../core";
import { SimpleUIComponent } from "../SimpleUIComponent";
export type IContainerPosition = "top" | "right" | "bottom" | "left";
type IContainerAlingment = "start" | "center" | "end";
/**
 * A component that handles all UI components.
 */
export declare class UIManager extends Component<Toolbar[]> implements Disposable {
    name: string;
    enabled: boolean;
    toolbars: Toolbar[];
    contextMenu: Toolbar;
    tooltipsEnabled: boolean;
    children: SimpleUIComponent[];
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    private _components;
    private _contextMenuContainer;
    private _mouseMoved;
    private _mouseDown;
    private _popperInstance;
    private _containers;
    static Class: {
        Label: string;
    };
    get viewerContainer(): HTMLElement;
    constructor(components: Components);
    get(): Toolbar[];
    dispose(): Promise<void>;
    init(): Promise<void>;
    add(...uiComponents: SimpleUIComponent[]): void;
    closeMenus(): void;
    setContainerAlignment(container: IContainerPosition, alingment: IContainerAlingment): void;
    addToolbar(...toolbar: Toolbar[]): void;
    updateToolbars(): void;
    private setupEvents;
    private onMouseUp;
    private onMouseMoved;
    private onMouseDown;
    private onContextMenu;
}
export {};
