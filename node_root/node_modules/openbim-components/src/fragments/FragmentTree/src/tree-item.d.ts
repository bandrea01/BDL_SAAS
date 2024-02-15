import { Component, UI, Event, FragmentIdMap, UIElement } from "../../../base-types";
import { TreeView, Button, CheckboxInput } from "../../../ui";
import { Components } from "../../../core";
import { FragmentClassifier } from "../../FragmentClassifier";
interface TreeItem {
    name: string;
    filter: {
        [groupSystemName: string]: string[];
    };
    children: TreeItem[];
}
export declare class FragmentTreeItem extends Component<TreeItem> implements UI {
    name: string;
    enabled: boolean;
    filter: {
        [name: string]: string[];
    };
    uiElement: UIElement<{
        main: Button;
        tree: TreeView;
        checkbox: CheckboxInput;
    }>;
    onSelected: Event<{
        items: FragmentIdMap;
        visible: boolean;
    }>;
    onHovered: Event<{
        items: FragmentIdMap;
        visible: boolean;
    }>;
    visible: boolean;
    private _children;
    private _blockCheckbox;
    get children(): FragmentTreeItem[];
    set children(children: FragmentTreeItem[]);
    constructor(components: Components, classifier: FragmentClassifier, content: string);
    setCheckbox(value: boolean, recursive: boolean): void;
    dispose(): Promise<void>;
    get(): TreeItem;
}
export {};
