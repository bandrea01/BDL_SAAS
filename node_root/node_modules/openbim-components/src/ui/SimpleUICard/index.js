import { SimpleUIComponent } from "../SimpleUIComponent";
export class SimpleUICard extends SimpleUIComponent {
    set title(value) {
        this.innerElements.title.textContent = value;
    }
    get title() {
        return this.innerElements.title.textContent;
    }
    set description(value) {
        this.innerElements.description.textContent = value;
    }
    get description() {
        return this.innerElements.description.textContent;
    }
    constructor(components, id) {
        const template = `
    <div class="p-2 text-white flex items-center rounded-lg border-transparent border border-solid">
      <div class="mr-auto">
        <p id="title" class="text-base"></p>
        <p id="description" class="text-sm text-gray-400"></p>
      </div>
      <div data-tooeen-slot="rightContainer"></div> 
    </div> 
    `;
        super(components, template, id);
        this.name = "SimpleUICard";
        this.innerElements = {
            title: this.getInnerElement("title"),
            description: this.getInnerElement("description"),
        };
        this.slots = {
            rightContainer: new SimpleUIComponent(components, `<div class="flex"></div>`),
        };
        this.setSlots();
    }
    addChild(...items) {
        items.forEach((item) => {
            this.slots.rightContainer.addChild(item);
        });
    }
}
//# sourceMappingURL=index.js.map