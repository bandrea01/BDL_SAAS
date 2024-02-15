import { FragmentsGroup } from "bim-fragment";
import { Components } from "../../core";
import { Component, UI, UIElement } from "../../base-types";
import { Drawer, FloatingWindow } from "../../ui";
export declare class RoadNavigator extends Component<any> implements UI {
    /** {@link Component.uuid} */
    static readonly uuid: "85f2c89c-4c6b-4c7d-bc20-5b675874b228";
    enabled: boolean;
    uiElement: UIElement<{
        horizontalAlignment: FloatingWindow;
        verticalAlignment: Drawer;
    }>;
    private _selected;
    private _anchor;
    private _anchorID;
    private _anchors;
    private _points;
    private _scenes;
    private _alignments;
    private _caster;
    constructor(components: Components);
    get(): void;
    select(model: FragmentsGroup): void;
    setAnchor(): void;
    saveAnchor(): void;
    loadAnchor(): void;
    private updateAnchor;
    private getAlignmentGeometry;
    private getAlignmentData;
    private currentAlignment;
    private setUI;
}
