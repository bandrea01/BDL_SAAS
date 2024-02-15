import { Event } from "../../base-types";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { UIManager } from "../UIManager";
export class TextArea extends SimpleUIComponent {
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
    set placeholder(value) {
        this.innerElements.input.placeholder = value;
    }
    get placeholder() {
        return this.innerElements.input.placeholder;
    }
    constructor(components) {
        const template = `
    <div class="w-full">
      <label id="label" for="message" class="${UIManager.Class.Label}"></label>
      <textarea id="input" rows="4" class="block bg-transparent w-full rounded-md p-3 text-white ring-1 text-base ring-gray-500 focus:ring-ifcjs-200 focus:outline-none placeholder:text-gray-400"></textarea>
    </div>
    `;
        super(components, template);
        this.name = "TooeenTextArea";
        this.onChange = new Event();
        this.innerElements = {
            label: this.getInnerElement("label"),
            input: this.getInnerElement("input"),
        };
        this.label = "Tooeen Text Area";
        this.placeholder = "Write something...";
        this.innerElements.label.setAttribute("for", `input-${this.id}`);
    }
    async dispose(onlyChildren = false) {
        await super.dispose(onlyChildren);
        this.onChange.reset();
    }
}
//# sourceMappingURL=index.js.map