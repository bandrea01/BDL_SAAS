import { Vector3 } from "three";
import { Components } from "../../core/Components";
import { UI, Component, Event, FragmentIdMap, UIElement } from "../../base-types";
import { Button, FloatingWindow } from "../../ui";
import { DrawManager } from "../../annotation";
import { CameraProjection } from "../OrthoPerspectiveCamera/src/types";
export interface IViewpointsManagerConfig {
    selectionHighlighter: string;
    drawManager?: DrawManager;
}
export interface IViewpoint {
    guid: string;
    title: string;
    description: string | null;
    position: Vector3;
    target: Vector3;
    selection: FragmentIdMap;
    projection: CameraProjection;
    dimensions: {
        start: Vector3;
        end: Vector3;
    }[];
    filter?: {
        [groupSystem: string]: string;
    };
    annotations?: SVGGElement;
}
export declare class ViewpointsManager extends Component<string> implements UI {
    private _drawManager?;
    name: string;
    uiElement: UIElement<{
        main: Button;
        newButton: Button;
        window: FloatingWindow;
    }>;
    enabled: boolean;
    list: IViewpoint[];
    selectionHighlighter: string;
    readonly onViewpointViewed: Event<string>;
    readonly onViewpointAdded: Event<string>;
    constructor(components: Components);
    initialize(config: IViewpointsManagerConfig): void;
    private setUI;
    get(): string;
    add(data: {
        title: string;
        description: string | null;
    }): IViewpoint | undefined;
    retrieve(guid: string): IViewpoint | undefined;
    view(guid: string): Promise<void>;
}
