import * as THREE from "three";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { Components } from "../../core";
import { Resizeable, Event } from "../../base-types";
export declare class Canvas extends SimpleUIComponent<HTMLCanvasElement> implements Resizeable {
    name: string;
    readonly onResize: Event<THREE.Vector2>;
    private _size;
    constructor(components: Components);
    getSize(): THREE.Vector2;
    resize(size?: THREE.Vector2): void;
}
