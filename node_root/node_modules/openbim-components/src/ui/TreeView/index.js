import { Event } from "../../base-types/base-types";
import { SimpleUIComponent } from "../SimpleUIComponent";
export class TreeView extends SimpleUIComponent {
    set description(value) {
        const element = this.innerElements.description;
        element.textContent = value;
        if (value) {
            element.classList.remove("hidden");
        }
        else {
            element.classList.add("hidden");
        }
    }
    get description() {
        return this.innerElements.description.textContent;
    }
    set title(value) {
        this.innerElements.title.textContent = value;
    }
    get title() {
        return this.innerElements.title.textContent;
    }
    set materialIcon(name) {
        this.innerElements.expandBtn.textContent = name;
    }
    get expanded() {
        return this._expanded;
    }
    set expanded(expanded) {
        this._expanded = expanded;
        this.slots.content.visible = expanded;
        if (expanded) {
            this.onExpand.trigger();
            this.innerElements.titleContainer.classList.add("bg-ifcjs-120");
            this.materialIcon = "arrow_drop_down";
        }
        else {
            this.onCollapse.trigger();
            this.innerElements.titleContainer.classList.remove("bg-ifcjs-120");
            this.materialIcon = "arrow_right";
        }
    }
    set onmouseover(listener) {
        this.domElement.onmouseover = (e) => {
            e.stopImmediatePropagation();
            listener(e);
        };
    }
    constructor(components, title) {
        const template = `
    <div class="flex flex-col items-start w-full box-border cursor-pointer text-base my-0">
      <div id="title-container" class="flex flex-wrap items-center text-base my-0 justify-between hover:bg-ifcjs-120 rounded-md w-full min-h-[30px] pr-3 bg-ifcjs-120">
        <div class="flex flex-row items-center gap-x-2 mr-4">
          <span id="expandBtn" class="material-icons md-18 text-white rounded-[10px] h-fit hover:cursor-pointer hover:bg-ifcjs-200 hover:text-black transition-all p-1"></span>
          <div class="flex flex-col items-start py-[5px]">
            <p id="title" class="text-base my-0"></p>
            <p id="description" class="text-sm text-gray-400 my-0"></p>
          </div>
        </div> 
        <div data-tooeen-slot="titleRight"></div>
      </div>
      <div data-tooeen-slot="content"></div>
    </div>
    `;
        super(components, template);
        this._expanded = true;
        this.onExpand = new Event();
        this.onCollapse = new Event();
        this.onClick = new Event();
        this.domElement.onclick = async (e) => {
            e.stopImmediatePropagation();
            await this.onClick.trigger(e);
        };
        this.innerElements = {
            titleContainer: this.getInnerElement("title-container"),
            title: this.getInnerElement("title"),
            description: this.getInnerElement("description"),
            expandBtn: this.getInnerElement("expandBtn"),
        };
        this.innerElements.expandBtn.onclick = () => this.toggle();
        this.slots = {
            content: new SimpleUIComponent(components, `<div class="flex flex-col w-full pl-[22px]"></div>`),
            titleRight: new SimpleUIComponent(components),
        };
        this.setSlots();
        this.title = title !== null && title !== void 0 ? title : null;
        this.collapse();
    }
    async dispose(onlyChildren = false) {
        await super.dispose(onlyChildren);
        if (!onlyChildren) {
            this.onExpand.reset();
            this.onCollapse.reset();
        }
    }
    toggle(deep = false) {
        if (deep) {
            if (this.expanded) {
                this.collapse();
            }
            else {
                this.expand();
            }
        }
        else {
            this.expanded = !this.expanded;
        }
    }
    addChild(...items) {
        this.slots.content.addChild(...items);
    }
    collapse(deep = true) {
        if (!this.expanded)
            return;
        this.expanded = false;
        if (!deep)
            return;
        for (const child of this.children)
            if (child instanceof TreeView)
                child.collapse(deep);
    }
    expand(deep = true) {
        if (this.expanded)
            return;
        this.expanded = true;
        if (!deep)
            return;
        for (const child of this.children)
            if (child instanceof TreeView)
                child.expand(deep);
    }
}
//# sourceMappingURL=index.js.map