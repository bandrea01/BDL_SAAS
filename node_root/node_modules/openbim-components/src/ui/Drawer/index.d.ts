import { Components } from "../../core";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { Event } from "../../base-types";
export declare class Drawer extends SimpleUIComponent<HTMLDivElement> {
    onResized: Event<unknown>;
    protected _size: string;
    protected _visible: boolean;
    protected _type: "top" | "bottom" | "left" | "right";
    slots: {
        content: SimpleUIComponent<HTMLDivElement>;
    };
    get visible(): boolean;
    set visible(value: boolean);
    get size(): string;
    set size(value: string);
    set alignment(value: typeof Drawer.prototype._type);
    constructor(components: Components);
    addChild(...items: SimpleUIComponent[]): void;
}
