import { SimpleUIComponent, TextInput, Button } from "../../../ui";
import { Event } from "../../../base-types";
import { IfcPropertiesUtils } from "../../IfcPropertiesUtils";
import { Modal } from "../../../ui/Modal";
export class PropActionsUI extends SimpleUIComponent {
    constructor(components) {
        const div = document.createElement("div");
        div.className = "flex";
        super(components, `<div class="flex"></div>`);
        this.modalVisible = false;
        this.onEditProp = new Event();
        this.onRemoveProp = new Event();
        this.data = {};
        this._modal = new Modal(components, "New Property Set");
        this._components.ui.add(this._modal);
        this._modal.visible = false;
        this._modal.onHidden.add(() => this.removeFromParent());
        this._modal.onCancel.add(() => {
            this._modal.visible = false;
            this._modal.slots.content.dispose(true);
        });
        this.editPropBtn = new Button(this._components);
        this.editPropBtn.materialIcon = "edit";
        this.editPropBtn.onClick.add(() => this.setEditUI());
        this.removePropBtn = new Button(this._components);
        this.removePropBtn.materialIcon = "delete";
        this.removePropBtn.onClick.add(() => this.setRemoveUI());
        this.addChild(this.editPropBtn, this.removePropBtn);
    }
    async dispose(onlyChildren = false) {
        await super.dispose(onlyChildren);
        this.onRemoveProp.reset();
        await this.editPropBtn.dispose();
        await this.removePropBtn.dispose();
        await this._modal.dispose();
        this.data = {};
    }
    setEditUI() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const { model, expressID } = this.data;
        const properties = model === null || model === void 0 ? void 0 : model.properties;
        if (!model || !expressID || !properties)
            return;
        this._modal.onAccept.reset();
        this._modal.title = "Edit Property";
        const editUI = new SimpleUIComponent(this._components, `<div class="flex flex-col gap-y-4 p-4 overflow-auto"></div>`);
        const nameInput = new TextInput(this._components);
        nameInput.label = "Name";
        const valueInput = new TextInput(this._components);
        valueInput.label = "Value";
        this._modal.onAccept.add(async () => {
            this._modal.visible = false;
            await this.onEditProp.trigger({
                model,
                expressID,
                name: nameInput.value,
                value: valueInput.value,
            });
        });
        editUI.addChild(nameInput, valueInput);
        const prop = properties[expressID];
        const { key: nameKey } = IfcPropertiesUtils.getEntityName(properties, expressID);
        if (nameKey) {
            nameInput.value = (_b = (_a = prop[nameKey]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "";
        }
        else {
            nameInput.value = (_d = (_c = prop.Name) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : "";
        }
        const { key: valueKey } = IfcPropertiesUtils.getQuantityValue(properties, expressID);
        if (valueKey) {
            valueInput.value = (_f = (_e = prop[valueKey]) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : "";
        }
        else {
            valueInput.value = (_h = (_g = prop.NominalValue) === null || _g === void 0 ? void 0 : _g.value) !== null && _h !== void 0 ? _h : "";
        }
        this._modal.setSlot("content", editUI);
        this._modal.visible = true;
    }
    setRemoveUI() {
        const { model, expressID, setID } = this.data;
        if (!model || !expressID || !setID)
            return;
        const removeUI = new SimpleUIComponent(this._components, `<div class="flex flex-col gap-y-4 p-4 overflow-auto"></div>`);
        const warningText = document.createElement("div");
        warningText.className = "text-base text-center";
        warningText.textContent =
            "Are you sure to delete this property? This action can't be undone.";
        removeUI.get().append(warningText);
        this._modal.onAccept.add(async () => {
            this._modal.visible = false;
            this.removeFromParent(); // As the psetUI is going to be disposed, then we need to first remove the action buttons so they do not become disposed as well.
            await this.onRemoveProp.trigger({ model, expressID, setID });
        });
        this._modal.setSlot("content", removeUI);
        this._modal.visible = true;
    }
}
//# sourceMappingURL=prop-actions.js.map