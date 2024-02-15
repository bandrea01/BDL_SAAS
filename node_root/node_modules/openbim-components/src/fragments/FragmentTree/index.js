import { Component, Event, UIElement, } from "../../base-types";
import { FragmentTreeItem } from "./src/tree-item";
import { FragmentClassifier } from "../FragmentClassifier";
import { Button, FloatingWindow } from "../../ui";
export class FragmentTree extends Component {
    constructor(components) {
        super(components);
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        this.enabled = true;
        this.onSelected = new Event();
        this.onHovered = new Event();
        this._title = "Model Tree";
        this.uiElement = new UIElement();
    }
    get() {
        if (!this._tree) {
            throw new Error("Fragment tree not initialized yet!");
        }
        return this._tree;
    }
    init() {
        const classifier = this.components.tools.get(FragmentClassifier);
        const tree = new FragmentTreeItem(this.components, classifier, "Model Tree");
        this._tree = tree;
        if (this.components.uiEnabled) {
            this.setupUI(tree);
        }
    }
    async dispose() {
        this.onSelected.reset();
        this.onHovered.reset();
        this.uiElement.dispose();
        if (this._tree) {
            await this._tree.dispose();
        }
        await this.onDisposed.trigger();
        this.onDisposed.reset();
    }
    async update(groupSystems) {
        if (!this._tree)
            return;
        const classifier = this.components.tools.get(FragmentClassifier);
        if (this._tree.children.length) {
            await this._tree.dispose();
            this._tree = new FragmentTreeItem(this.components, classifier, this._title);
        }
        this._tree.children = this.regenerate(groupSystems);
    }
    setupUI(tree) {
        const window = new FloatingWindow(this.components);
        const subTree = tree.uiElement.get("tree");
        window.addChild(subTree);
        window.title = "Model tree";
        this.components.ui.add(window);
        window.visible = false;
        const main = new Button(this.components);
        main.materialIcon = "account_tree";
        main.tooltip = "Model tree";
        main.onClick.add(() => {
            window.visible = !window.visible;
        });
        this.uiElement.set({ main, window });
    }
    regenerate(groupSystemNames, result = {}) {
        const classifier = this.components.tools.get(FragmentClassifier);
        const systems = classifier.get();
        const groups = [];
        const currentSystemName = groupSystemNames[0]; // storeys
        const systemGroups = systems[currentSystemName];
        if (!currentSystemName || !systemGroups) {
            return groups;
        }
        for (const name in systemGroups) {
            // name is N00, N01, N02...
            // { storeys: "N00" }, { storeys: "N01" }...
            const classifier = this.components.tools.get(FragmentClassifier);
            const filter = { ...result, [currentSystemName]: [name] };
            const found = classifier.find(filter);
            const hasElements = Object.keys(found).length > 0;
            if (hasElements) {
                const firstLetter = currentSystemName[0].toUpperCase();
                const treeItemName = firstLetter + currentSystemName.slice(1); // Storeys
                const treeItem = new FragmentTreeItem(this.components, classifier, `${treeItemName}: ${name}`);
                treeItem.onHovered.add((result) => this.onHovered.trigger(result));
                treeItem.onSelected.add((result) => this.onSelected.trigger(result));
                treeItem.filter = filter;
                groups.push(treeItem);
                treeItem.children = this.regenerate(groupSystemNames.slice(1), filter);
            }
        }
        return groups;
    }
}
//# sourceMappingURL=index.js.map