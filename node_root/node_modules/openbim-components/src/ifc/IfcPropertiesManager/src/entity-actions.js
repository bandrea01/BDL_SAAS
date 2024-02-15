import { SimpleUIComponent, TextInput, Button } from "../../../ui";
import { Modal } from "../../../ui/Modal";
import { Event } from "../../../base-types";
export class EntityActionsUI extends SimpleUIComponent {
    constructor(components) {
        super(components, `<div class="flex"></div>`);
        this.onNewPset = new Event();
        this.data = {};
        this.addPsetBtn = new Button(this._components, {
            materialIconName: "add",
        });
        this.addPsetBtn.onClick.add(async () => {
            this._nameInput.value = "";
            this._descriptionInput.value = "";
            this.modal.visible = true;
        });
        this.addChild(this.addPsetBtn);
        this.modal = new Modal(components, "New Property Set");
        this._components.ui.add(this.modal);
        this.modal.visible = false;
        this.modal.onHidden.add(() => this.removeFromParent());
        const addPsetUI = new SimpleUIComponent(this._components, `<div class="flex flex-col gap-y-4 p-4"></div>`);
        this.modal.setSlot("content", addPsetUI);
        this._nameInput = new TextInput(this._components);
        this._nameInput.label = "Name";
        this._descriptionInput = new TextInput(this._components);
        this._descriptionInput.label = "Description";
        this.modal.onAccept.add(() => {
            const name = this._nameInput.value;
            const description = this._descriptionInput.value;
            this.modal.visible = false;
            const { model, elementIDs } = this.data;
            if (!model || name === "")
                return;
            this.onNewPset.trigger({ model, elementIDs, name, description });
        });
        this.modal.onCancel.add(() => (this.modal.visible = false));
        addPsetUI.addChild(this._nameInput, this._descriptionInput);
    }
    async dispose(onlyChildren = false) {
        await super.dispose(onlyChildren);
        this.data = {};
        this.onNewPset.reset();
        await this.addPsetBtn.dispose();
        await this.modal.dispose();
        await this._nameInput.dispose();
        await this._descriptionInput.dispose();
    }
}
//# sourceMappingURL=entity-actions.js.map