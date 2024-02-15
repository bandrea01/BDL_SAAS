import { Components } from "../../core";
import { Event } from "../../base-types";
import { SimpleUIComponent } from "../SimpleUIComponent";
interface DragAndDropConfig {
    subTitle: string;
}
export declare class DragAndDropInput extends SimpleUIComponent<HTMLDivElement> {
    name: string;
    onFilesLoaded: Event<FileList>;
    constructor(components: Components, config?: DragAndDropConfig);
    dispose(onlyChildren?: boolean): Promise<void>;
}
export {};
