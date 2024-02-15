import { Component, Event, UIElement, } from "../../../base-types";
import { TreeView, Button, CheckboxInput } from "../../../ui";
import { FragmentHider } from "../../FragmentHider";
export class FragmentTreeItem extends Component {
    get children() {
        return this._children;
    }
    set children(children) {
        this._children = children;
        children.forEach((child) => {
            const subTree = child.uiElement.get("tree");
            this.uiElement.get("tree").addChild(subTree);
        });
    }
    constructor(components, classifier, content) {
        super(components);
        this.name = "FragmentTreeItem";
        this.enabled = true;
        this.filter = {};
        this.uiElement = new UIElement();
        this.onSelected = new Event();
        this.onHovered = new Event();
        this.visible = true;
        this._children = [];
        this._blockCheckbox = false;
        const main = new Button(components);
        const tree = new TreeView(components, content);
        const checkbox = new CheckboxInput(components);
        checkbox.label = "";
        checkbox.value = true;
        const hider = this.components.tools.get(FragmentHider);
        checkbox.onChange.add(async (value) => {
            this.visible = value;
            if (this._blockCheckbox)
                return;
            const isEmptyFilter = Object.keys(this.filter).length === 0;
            if (isEmptyFilter) {
                for (const child of this.children) {
                    const found = await classifier.find(child.filter);
                    hider.set(value, found);
                }
            }
            else {
                const found = await classifier.find(this.filter);
                hider.set(value, found);
            }
            for (const child of this.children) {
                child.setCheckbox(value, true);
            }
        });
        tree.slots.titleRight.addChild(checkbox);
        this.uiElement.set({ main, tree, checkbox });
        tree.onClick.add(async (e) => {
            if (e.target instanceof HTMLInputElement)
                return;
            const found = await classifier.find(this.filter);
            await this.onSelected.trigger({ items: found, visible: this.visible });
        });
        tree.get().onmouseenter = async () => {
            const found = await classifier.find(this.filter);
            await this.onHovered.trigger({ items: found, visible: this.visible });
        };
    }
    setCheckbox(value, recursive) {
        this.visible = value;
        this._blockCheckbox = true;
        const checkbox = this.uiElement.get("checkbox");
        checkbox.value = value;
        this._blockCheckbox = false;
        if (recursive) {
            for (const child of this.children) {
                child.setCheckbox(value, true);
            }
        }
    }
    async dispose() {
        await this.uiElement.dispose();
        this.onSelected.reset();
        this.onHovered.reset();
        for (const child of this.children) {
            await child.dispose();
        }
    }
    get() {
        return { name: this.name, filter: this.filter, children: this.children };
    }
}
//# sourceMappingURL=tree-item.js.map