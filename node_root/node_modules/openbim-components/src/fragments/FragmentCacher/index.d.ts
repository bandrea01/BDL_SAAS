import { FragmentsGroup } from "bim-fragment";
import { Components } from "../../core/Components";
import { LocalCacher } from "../../core/LocalCacher";
export declare class FragmentCacher extends LocalCacher {
    private _mode;
    get fragmentsIDs(): string[];
    constructor(components: Components);
    private setupUI;
    getFragmentGroup(id: string): Promise<FragmentsGroup | null>;
    saveFragmentGroup(group: FragmentsGroup, id?: string): Promise<void>;
    existsFragmentGroup(id: string): boolean;
    private onLoadButtonClicked;
    private onSaveButtonClicked;
    private getIDs;
}
