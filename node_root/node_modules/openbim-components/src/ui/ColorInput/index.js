import { Event } from "../../base-types";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { UIManager } from "../UIManager";
export class ColorInput extends SimpleUIComponent {
    set value(value) {
        this.innerElements.input.value = value;
        this.onChange.trigger(this.value);
    }
    get value() {
        return this.innerElements.input.value;
    }
    set label(value) {
        this.innerElements.label.textContent = value;
        if (value) {
            this.innerElements.label.classList.remove("hidden");
        }
        else {
            this.innerElements.label.classList.add("hidden");
        }
    }
    get label() {
        return this.innerElements.label.textContent;
    }
    // @ts-ignore
    constructor(components) {
        const template = `
    <div class="w-full">
      <label id="label" class="${UIManager.Class.Label}"></label>
      <input id="input" type="color" class="block w-full h-[48px] rounded-md text-white text-base ring-gray-500 focus:ring-ifcjs-200 focus:outline-none">
    </div>
    `;
        super(components, template);
        this.name = "TooeenColorInput";
        this.onChange = new Event();
        this.innerElements = {
            label: this.getInnerElement("label"),
            input: this.getInnerElement("input"),
        };
        this.label = "Tooeen Color";
        this.value = "#BCF124";
        this.innerElements.input.oninput = () => {
            this.onChange.trigger(this.value);
        };
    }
    async dispose(onlyChildren = false) {
        await super.dispose(onlyChildren);
        this.onChange.reset();
    }
}
//# sourceMappingURL=index.js.map