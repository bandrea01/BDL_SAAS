import { Vector2 } from "three";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { Event } from "../../base-types";
export class FloatingWindow extends SimpleUIComponent {
    get containerSize() {
        const baseHeight = this.domElement.clientHeight;
        const titleHeight = this.innerElements.titleContainer.clientHeight;
        const height = baseHeight - titleHeight;
        const width = this.domElement.clientWidth;
        return { height, width };
    }
    get viewerContainer() {
        return this._components.renderer.get().domElement
            .parentElement;
    }
    set description(value) {
        const element = this.innerElements.description;
        element.textContent = value;
        if (value) {
            element.classList.remove("hidden");
        }
        else {
            element === null || element === void 0 ? void 0 : element.classList.add("hidden");
        }
    }
    get description() {
        return this.innerElements.description.textContent;
    }
    set title(value) {
        const element = this.innerElements.title;
        element.textContent = value;
        if (value) {
            element.classList.remove("hidden");
        }
        else {
            element.classList.add("hidden");
        }
    }
    get title() {
        return this.innerElements.title.textContent;
    }
    set resizeable(value) {
        this._resizeable = value;
        if (value) {
            this.get().classList.add("resize");
        }
        else {
            this.get().classList.remove("resize");
        }
    }
    get resizeable() {
        return this._resizeable;
    }
    set movable(value) {
        this._movable = value;
        if (value) {
            this.innerElements.titleContainer.classList.add("cursor-move");
        }
        else {
            this.innerElements.titleContainer.classList.remove("cursor-move");
        }
    }
    get movable() {
        return this._movable;
    }
    constructor(components, id) {
        const template = `
    <div class="${FloatingWindow.Class.Base}">
      <div id="title-container" class="z-10 flex justify-between items-center top-0 select-none cursor-move px-6 py-3 border-b-2 border-solid border-[#3A444E]">
        <div class="flex flex-col">
          <h3 class="text-3xl text-ifcjs-200 font-medium my-0" id="title">Tooeen Floating Window</h3>
          <p id="description" class="${FloatingWindow.Class.Description}"></p>
        </div>
        <span id="close" class="material-icons text-2xl ml-4 text-gray-400 z-20 hover:cursor-pointer hover:text-ifcjs-200">close</span>
      </div>
      <div data-tooeen-slot="content"></div>
    </div>
    `;
        super(components, template, id);
        this._resizeable = true;
        this._movable = true;
        this.onMoved = new Event();
        this.onResized = new Event();
        this._isMouseDown = false;
        this._offsetX = 0;
        this._offsetY = 0;
        this.onMOuseDown = (event) => {
            if (!this.movable)
                return;
            this._isMouseDown = true;
            const rect = this.domElement.getBoundingClientRect();
            this._offsetX = event.clientX - rect.left;
            this._offsetY = event.clientY - rect.top;
        };
        this.onMouseUp = () => {
            this._isMouseDown = false;
        };
        this.onMouseMove = (event) => {
            if (!(this._isMouseDown && this.movable))
                return;
            const { width, height } = this.domElement.getBoundingClientRect();
            const { x, y, width: containerWidth, height: containerHeight, } = this.viewerContainer.getBoundingClientRect();
            const maxLeft = containerWidth - width;
            const maxTop = containerHeight - height;
            const left = Math.max(0, Math.min(event.clientX - this._offsetX - x, maxLeft));
            const top = Math.max(0, Math.min(event.clientY - this._offsetY - y, maxTop));
            this.domElement.style.left = `${left}px`;
            this.domElement.style.top = `${top}px`;
            this.onMoved.trigger(this);
        };
        this.innerElements = {
            title: this.getInnerElement("title"),
            description: this.getInnerElement("description"),
            titleContainer: this.getInnerElement("title-container"),
            closeBtn: this.getInnerElement("close"),
        };
        this.slots = {
            content: new SimpleUIComponent(components, `<div class="flex flex-col gap-y-4 p-4 overflow-auto"></div>`),
        };
        this.setSlots();
        this.innerElements.closeBtn.onclick = () => (this.visible = false);
        this.setMovableListeners();
        const observer = new ResizeObserver(() => this.onResized.trigger());
        observer.observe(this.get());
        this.description = null;
        this.movable = true;
        this.resizeable = true;
        this.referencePoints = {
            topLeft: new Vector2(),
            top: new Vector2(),
            topRight: new Vector2(),
            left: new Vector2(),
            center: new Vector2(),
            right: new Vector2(),
            bottomLeft: new Vector2(),
            bottom: new Vector2(),
            bottomRight: new Vector2(),
        };
        this.domElement.style.width = "400px";
        this.domElement.style.height = "250px";
    }
    async dispose(onlyChildren = false) {
        await super.dispose(onlyChildren);
        this.setupEvents(false);
        this.onMoved.reset();
        this.onResized.reset();
    }
    setMovableListeners() {
        // For node.js
        try {
            // eslint-disable-next-line no-unused-expressions
            this._components.renderer;
        }
        catch (_e) {
            return;
        }
        this.setupEvents(true);
    }
    addChild(...items) {
        const content = this.slots.content;
        content.addChild(...items);
        if (!content.visible)
            content.visible = true;
    }
    updateReferencePoints() {
        const uiElementRect = this.domElement.getBoundingClientRect();
        this.referencePoints.topLeft.set(uiElementRect.x, uiElementRect.y);
        this.referencePoints.top.set(uiElementRect.x + uiElementRect.width / 2, uiElementRect.y);
        this.referencePoints.topRight.set(uiElementRect.x + uiElementRect.width, uiElementRect.y);
        this.referencePoints.left.set(uiElementRect.x, uiElementRect.y + uiElementRect.height / 2);
        this.referencePoints.center.set(uiElementRect.x + uiElementRect.width / 2, uiElementRect.y + uiElementRect.height / 2);
        this.referencePoints.right.set(uiElementRect.x + uiElementRect.width, uiElementRect.y + uiElementRect.height / 2);
        this.referencePoints.bottomLeft.set(uiElementRect.x, uiElementRect.y + uiElementRect.height);
        this.referencePoints.bottom.set(uiElementRect.x + uiElementRect.width / 2, uiElementRect.y + uiElementRect.height);
        this.referencePoints.bottomRight.set(uiElementRect.x + uiElementRect.width, uiElementRect.y + uiElementRect.height);
    }
    setupEvents(active) {
        const title = this.innerElements.titleContainer;
        const container = this.viewerContainer;
        if (active) {
            if (title) {
                title.addEventListener("mousedown", this.onMOuseDown);
            }
            container.addEventListener("mousemove", this.onMouseMove);
            container.addEventListener("mouseup", this.onMouseUp);
        }
        else {
            if (title) {
                title.removeEventListener("mousedown", this.onMOuseDown);
            }
            container.removeEventListener("mousemove", this.onMouseMove);
            container.removeEventListener("mouseup", this.onMouseUp);
        }
    }
}
FloatingWindow.Class = {
    Base: "absolute flex flex-col backdrop-blur-xl shadow-md overflow-auto top-5 resize z-50 left-5 min-h-[80px] min-w-[150px] w-fit h-fit text-white bg-ifcjs-100 rounded-md",
    Description: "text-base text-gray-400",
};
//# sourceMappingURL=index.js.map