import * as THREE from "three";
import { Components } from "../../core";
import { SimpleUIComponent } from "../SimpleUIComponent";
export interface UICommands<T> {
    [id: string]: (data?: T) => void;
}
export declare class CommandsMenu<T> extends SimpleUIComponent<HTMLDivElement> {
    name: string;
    commandData?: T;
    offset: THREE.Vector2;
    innerElements: {
        window: HTMLDivElement;
    };
    commands: UICommands<T>;
    get hasCommands(): boolean;
    constructor(components: Components);
    update(): void;
    popup(x: number, y: number): void;
    dispose(onlyChildren?: boolean): Promise<void>;
    private setupEvents;
    private hideCommandsMenu;
}
