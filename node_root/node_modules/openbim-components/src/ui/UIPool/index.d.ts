import { Component } from "../../base-types";
import { Components } from "../../core";
import { SimpleUIComponent } from "../SimpleUIComponent";
type UIClass<T extends SimpleUIComponent> = new (components: Components, ...args: any[]) => T;
export declare class UIPool<T extends SimpleUIComponent> extends Component<T> {
    name: string;
    enabled: boolean;
    list: T[];
    private _components;
    private _uiClass;
    constructor(components: Components, uiClass: UIClass<T>);
    return(element: T): void;
    get(): T;
}
export {};
