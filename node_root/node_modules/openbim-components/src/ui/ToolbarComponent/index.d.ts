import { Button } from "../ButtonComponent";
import { IContainerPosition } from "../UIManager";
import { Components } from "../../core/Components";
import { SimpleUIComponent } from "../SimpleUIComponent";
interface IToolbarOptions {
    name?: string;
    position?: IContainerPosition;
}
type IToolbarDirection = "horizontal" | "vertical";
export declare class Toolbar extends SimpleUIComponent<HTMLDivElement> {
    name: string;
    children: Button[];
    protected _parent: Button | null;
    static Class: {
        Base: string;
    };
    private _position;
    set visible(visible: boolean);
    get visible(): boolean;
    set enabled(enabled: boolean);
    set position(position: IContainerPosition);
    get position(): IContainerPosition;
    constructor(components: Components, options?: IToolbarOptions);
    get hasElements(): boolean;
    get(): HTMLDivElement;
    addChild(...button: Button[]): void;
    updateElements(): void;
    closeMenus(): void;
    setDirection(direction?: IToolbarDirection): void;
}
export {};
