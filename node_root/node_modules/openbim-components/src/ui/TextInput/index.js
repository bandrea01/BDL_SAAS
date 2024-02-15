import { Event } from "../../base-types";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { UIManager } from "../UIManager";
export class TextInput extends SimpleUIComponent {
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
    constructor(components) {
        const template = `
    <div class="w-full">
      <label id="label" class="${UIManager.Class.Label}"></label>
      <input id="input" type="text" class="block bg-transparent w-full rounded-md p-3 text-white ring-1 text-base ring-gray-500 focus:ring-ifcjs-200 focus:outline-none placeholder:text-gray-400">
    </div>
    `;
        super(components, template);
        this.name = "TooeenTextInput";
        this.onChange = new Event();
        this.innerElements = {
            label: this.getInnerElement("label"),
            input: this.getInnerElement("input"),
        };
        this.label = "Tooeen Text";
        this.innerElements.label.setAttribute("for", `input-${this.id}`);
    }
    async dispose(onlyChildren = false) {
        await super.dispose(onlyChildren);
        this.onChange.reset();
    }
}
//# sourceMappingURL=index.js.map