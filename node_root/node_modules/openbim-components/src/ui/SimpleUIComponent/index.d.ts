import { Component, Disposable, Event, Hideable } from "../../base-types";
import { Components } from "../../core";
export declare class SimpleUIComponent<T extends HTMLElement = HTMLElement> extends Component<T> implements Hideable, Disposable {
    name: string;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    id: string;
    children: SimpleUIComponent<any>[];
    data: Record<string, any>;
    slots: {
        [name: string]: SimpleUIComponent;
    };
    innerElements: {
        [name: string]: HTMLElement;
    };
    static Class: {
        Base: string;
        [elementName: string]: string;
    };
    readonly onVisible: Event<unknown>;
    readonly onHidden: Event<unknown>;
    readonly onEnabled: Event<unknown>;
    readonly onDisabled: Event<unknown>;
    protected _domElement?: T;
    protected _components: Components;
    protected _parent: SimpleUIComponent<any> | null;
    protected _enabled: boolean;
    protected _visible: boolean;
    protected _active: boolean;
    get domElement(): T;
    set domElement(ele: T);
    set parent(value: SimpleUIComponent<any> | null);
    get parent(): SimpleUIComponent<any> | null;
    get active(): boolean;
    set active(active: boolean);
    get visible(): boolean;
    set visible(value: boolean);
    get enabled(): boolean;
    set enabled(value: boolean);
    get hasElements(): boolean;
    private set template(value);
    constructor(components: Components, template?: string, id?: string);
    cleanData(): void;
    get(): T;
    dispose(onlyChildren?: boolean): Promise<void>;
    addChild(...items: SimpleUIComponent[]): void;
    removeChild(...items: SimpleUIComponent[]): void;
    removeFromParent(): void;
    getInnerElement<T extends HTMLElement>(id: string): T | null;
    setSlot(name: string, uiComponent: SimpleUIComponent): void;
    setSlots(): void;
}
