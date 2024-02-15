import { FragmentsGroup } from "bim-fragment";
import { Component, Disposable, UI, Event, UIElement } from "../../base-types";
import { PlanView } from "./src/types";
import { PlanObjects } from "./src/plan-objects";
import { Components } from "../../core";
import { Button, FloatingWindow, SimpleUIComponent, CommandsMenu, UICommands } from "../../ui";
/**
 * Helper to control the camera and easily define and navigate 2D floor plans.
 */
export declare class FragmentPlans extends Component<PlanView[]> implements Disposable, UI {
    static readonly uuid: "a80874aa-1c93-43a4-80f2-df346da086b1";
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    readonly onNavigated: Event<{
        id: string;
    }>;
    readonly onExited: Event<unknown>;
    /** {@link Component.enabled} */
    enabled: boolean;
    /** The floorplan that is currently selected. */
    currentPlan: PlanView | null;
    /** The offset from the clipping planes to their respective floor plan elevation. */
    defaultSectionOffset: number;
    /** The offset of the 2D camera to the floor plan elevation. */
    defaultCameraOffset: number;
    /** The created floor plans. */
    storeys: {
        [modelID: number]: any[];
    };
    objects: PlanObjects;
    /** {@link UI.uiElement} */
    uiElement: UIElement<{
        floatingWindow: FloatingWindow;
        main: Button;
        planList: SimpleUIComponent;
        defaultText: SimpleUIComponent<HTMLParagraphElement>;
        exitButton: Button;
        commandsMenu: CommandsMenu<PlanView>;
    }>;
    private _plans;
    private _floorPlanViewCached;
    private _previousCamera;
    private _previousTarget;
    private _previousProjection;
    get commands(): UICommands<PlanView>;
    set commands(commands: UICommands<PlanView>);
    constructor(components: Components);
    /** {@link Component.get} */
    get(): PlanView[];
    /** {@link Disposable.dispose} */
    dispose(): Promise<void>;
    computeAllPlanViews(model: FragmentsGroup): Promise<void>;
    /**
     * Creates a new floor plan in the navigator.
     *
     * @param config - Necessary data to initialize the floor plan.
     */
    create(config: PlanView): Promise<void>;
    /**
     * Make the navigator go to the specified floor plan.
     *
     * @param id - Floor plan to go to.
     * @param animate - Whether to animate the camera transition.
     */
    goTo(id: string, animate?: boolean): Promise<void>;
    /**
     * Deactivate navigator and go back to the previous view.
     *
     * @param animate - Whether to animate the camera transition.
     */
    exitPlanView(animate?: boolean): Promise<void>;
    updatePlansList(): Promise<void>;
    private setUI;
    private storeCameraPosition;
    private createClippingPlane;
    private cacheFloorplanView;
    private moveCameraTo2DPlanPosition;
    private activateCurrentPlan;
    private store3dCameraPosition;
    private updateCurrentPlan;
    private hidePreviousClippingPlane;
    private setupPlanObjectUI;
    private getAbsoluteFloorHeight;
}
