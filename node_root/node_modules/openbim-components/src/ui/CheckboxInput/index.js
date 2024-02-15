import { Event } from "../../base-types";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { UIManager } from "../UIManager";
export class CheckboxInput extends SimpleUIComponent {
    set value(value) {
        this.innerElements.input.checked = value;
        this.onChange.trigger(this.value);
    }
    get value() {
        return this.innerElements.input.checked;
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
    constructor(components) {
        const template = `
    <div class="w-full flex gap-x-2 items-center">
        <input id="input" type="checkbox" 
            class="h-4 w-4 rounded border-gray-300 accent-ifcjs-300 text-ifcjs-300 focus:ring-ifcjs-300">
        <label id="label" class="${UIManager.Class.Label}"></label>
    </div>
    `;
        super(components, template);
        this.name = "TooeenCheckboxInput";
        this.onChange = new Event();
        this.innerElements = {
            label: this.getInnerElement("label"),
            input: this.getInnerElement("input"),
        };
        this.innerElements.input.addEventListener("change", () => {
            this.onChange.trigger(this.value);
        });
        this.label = "Tooeen Checkbox";
    }
    async dispose(onlyChildren = false) {
        await super.dispose(onlyChildren);
        this.onChange.reset();
    }
}
//# sourceMappingURL=index.js.map