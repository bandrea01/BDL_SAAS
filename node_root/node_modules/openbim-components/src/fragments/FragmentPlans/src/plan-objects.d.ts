import * as THREE from "three";
import { Components } from "../../../core";
import { PlanView } from "./types";
import { Button } from "../../../ui";
import { UI, Event, UIElement } from "../../../base-types";
export declare class PlanObjects implements UI {
    offsetFactor: number;
    uiElement: UIElement<{
        main: Button;
    }>;
    planClicked: Event<{
        id: string;
    }>;
    components: Components;
    private _scale;
    private _min;
    private _max;
    private _objects;
    private _visible;
    private _planeGeometry;
    private _linesGeometry;
    private lineMaterial;
    private _material;
    get visible(): boolean;
    set visible(active: boolean);
    constructor(components: Components);
    dispose(): Promise<void>;
    add(config: PlanView): void;
    setBounds(points: THREE.Vector3[], override?: boolean): void;
    private setUI;
    private resetBounds;
    private newScaleMatrix;
    private createPlaneOutlineGeometry;
}
