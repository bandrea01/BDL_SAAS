import { Vector2 } from "three";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { Event } from "../../base-types";
import { Components } from "../../core";
export declare class FloatingWindow extends SimpleUIComponent<HTMLDivElement> {
    private _resizeable;
    private _movable;
    static Class: {
        Base: string;
        Description: string;
    };
    onMoved: Event<FloatingWindow>;
    onResized: Event<unknown>;
    private _isMouseDown;
    private _offsetX;
    private _offsetY;
    referencePoints: {
        topLeft: Vector2;
        top: Vector2;
        topRight: Vector2;
        left: Vector2;
        center: Vector2;
        right: Vector2;
        bottomLeft: Vector2;
        bottom: Vector2;
        bottomRight: Vector2;
    };
    get containerSize(): {
        height: number;
        width: number;
    };
    get viewerContainer(): HTMLElement;
    set description(value: string | null);
    get description(): string | null;
    set title(value: string | null);
    get title(): string | null;
    set resizeable(value: boolean);
    get resizeable(): boolean;
    set movable(value: boolean);
    get movable(): boolean;
    innerElements: {
        title: HTMLHeadingElement;
        description: HTMLHeadingElement;
        titleContainer: HTMLDivElement;
        closeBtn: HTMLSpanElement;
    };
    slots: {
        content: SimpleUIComponent<HTMLDivElement>;
    };
    constructor(components: Components, id?: string);
    dispose(onlyChildren?: boolean): Promise<void>;
    private setMovableListeners;
    addChild(...items: SimpleUIComponent[]): void;
    updateReferencePoints(): void;
    private setupEvents;
    private onMOuseDown;
    private onMouseUp;
    private onMouseMove;
}
