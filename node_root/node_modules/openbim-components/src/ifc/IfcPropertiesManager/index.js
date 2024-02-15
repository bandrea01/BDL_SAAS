import * as WEBIFC from "web-ifc";
import { Component, Event, UIElement } from "../../base-types";
import { ToolComponent } from "../../core";
import { generateIfcGUID } from "../../utils";
import { IfcPropertiesUtils } from "../IfcPropertiesUtils";
import { EntityActionsUI } from "./src/entity-actions";
import { PsetActionsUI } from "./src/pset-actions";
import { PropActionsUI } from "./src/prop-actions";
import { Button } from "../../ui";
import { FragmentIfcLoader } from "../../fragments/FragmentIfcLoader";
export class IfcPropertiesManager extends Component {
    constructor(components) {
        super(components);
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        this.onRequestFile = new Event();
        this.ifcToExport = null;
        this.onElementToPset = new Event();
        this.onPropToPset = new Event();
        this.onPsetRemoved = new Event();
        this.onDataChanged = new Event();
        this.wasm = {
            path: "/",
            absolute: false,
        };
        this.enabled = true;
        this.attributeListeners = {};
        this.uiElement = new UIElement();
        this._changeMap = {};
        this.components.tools.add(IfcPropertiesManager.uuid, this);
        // TODO: Save original IFC file so that opening it again is not necessary
        if (components.uiEnabled) {
            this.setUI(components);
            this.setUIEvents();
        }
    }
    get() {
        return this._changeMap;
    }
    async dispose() {
        this.selectedModel = undefined;
        this.attributeListeners = {};
        this._changeMap = {};
        this.onElementToPset.reset();
        this.onPropToPset.reset();
        this.onPsetRemoved.reset();
        this.onDataChanged.reset();
        await this.uiElement.dispose();
        await this.onDisposed.trigger(IfcPropertiesManager.uuid);
        this.onDisposed.reset();
    }
    setUI(components) {
        const exportButton = new Button(components);
        exportButton.tooltip = "Export IFC";
        exportButton.materialIcon = "exit_to_app";
        exportButton.onClick.add(async () => {
            await this.onRequestFile.trigger();
            if (!this.ifcToExport || !this.selectedModel)
                return;
            const fileData = new Uint8Array(this.ifcToExport);
            const name = this.selectedModel.name;
            const resultBuffer = await this.saveToIfc(this.selectedModel, fileData);
            const resultFile = new File([new Blob([resultBuffer])], name);
            const link = document.createElement("a");
            link.download = name;
            link.href = URL.createObjectURL(resultFile);
            link.click();
            link.remove();
        });
        this.uiElement.set({
            exportButton,
            entityActions: new EntityActionsUI(components),
            psetActions: new PsetActionsUI(components),
            propActions: new PropActionsUI(components),
        });
    }
    setUIEvents() {
        const entityActions = this.uiElement.get("entityActions");
        const propActions = this.uiElement.get("propActions");
        const psetActions = this.uiElement.get("psetActions");
        entityActions.onNewPset.add(async ({ model, elementIDs, name, description }) => {
            const { pset } = await this.newPset(model, name, description === "" ? undefined : description);
            for (const expressID of elementIDs !== null && elementIDs !== void 0 ? elementIDs : []) {
                await this.addElementToPset(model, pset.expressID, expressID);
            }
            entityActions.cleanData();
        });
        propActions.onEditProp.add(async ({ model, expressID, name, value }) => {
            var _a, _b;
            const { properties } = IfcPropertiesManager.getIFCInfo(model);
            const prop = properties[expressID];
            const { key: valueKey } = IfcPropertiesUtils.getQuantityValue(properties, expressID);
            const { key: nameKey } = IfcPropertiesUtils.getEntityName(properties, expressID);
            if (name !== "" && nameKey) {
                if ((_a = prop[nameKey]) === null || _a === void 0 ? void 0 : _a.value) {
                    prop[nameKey].value = name;
                }
                else {
                    prop.Name = { type: 1, value: name };
                }
            }
            if (value !== "" && valueKey) {
                if ((_b = prop[valueKey]) === null || _b === void 0 ? void 0 : _b.value) {
                    prop[valueKey].value = value;
                }
                else {
                    prop.NominalValue = { type: 1, value }; // Need to change type based on property 1:STRING, 2: LABEL, 3: ENUM, 4: REAL
                }
            }
            await this.registerChange(model, expressID);
            propActions.cleanData();
        });
        propActions.onRemoveProp.add(async ({ model, expressID, setID }) => {
            await this.removePsetProp(model, setID, expressID);
            propActions.cleanData();
        });
        psetActions.onEditPset.add(async ({ model, psetID, name, description }) => {
            var _a, _b;
            const { properties } = IfcPropertiesManager.getIFCInfo(model);
            const pset = properties[psetID];
            if (name !== "") {
                if ((_a = pset.Name) === null || _a === void 0 ? void 0 : _a.value) {
                    pset.Name.value = name;
                }
                else {
                    pset.Name = { type: 1, value: name };
                }
            }
            if (description !== "") {
                if ((_b = pset.Description) === null || _b === void 0 ? void 0 : _b.value) {
                    pset.Description.value = description;
                }
                else {
                    pset.Description = { type: 1, value: description };
                }
            }
            await this.registerChange(model, psetID);
        });
        psetActions.onRemovePset.add(async ({ model, psetID }) => {
            await this.removePset(model, psetID);
        });
        psetActions.onNewProp.add(async ({ model, psetID, name, type, value }) => {
            const prop = await this.newSingleStringProperty(model, type, name, value);
            await this.addPropToPset(model, psetID, prop.expressID);
        });
    }
    increaseMaxID(model) {
        model.ifcMetadata.maxExpressID++;
        return model.ifcMetadata.maxExpressID;
    }
    static getIFCInfo(model) {
        const properties = model.properties;
        if (!properties)
            throw new Error("FragmentsGroup properties not found");
        const schema = model.ifcMetadata.schema;
        if (!schema)
            throw new Error("IFC Schema not found");
        return { properties, schema };
    }
    newGUID(model) {
        const { schema } = IfcPropertiesManager.getIFCInfo(model);
        return new WEBIFC[schema].IfcGloballyUniqueId(generateIfcGUID());
    }
    getOwnerHistory(model) {
        const { properties } = IfcPropertiesManager.getIFCInfo(model);
        const ownerHistory = IfcPropertiesUtils.findItemOfType(properties, WEBIFC.IFCOWNERHISTORY);
        if (!ownerHistory)
            throw new Error("No OwnerHistory was found.");
        const ownerHistoryHandle = new WEBIFC.Handle(ownerHistory.expressID);
        return { ownerHistory, ownerHistoryHandle };
    }
    async registerChange(model, ...expressID) {
        if (!this._changeMap[model.uuid]) {
            this._changeMap[model.uuid] = new Set();
        }
        for (const id of expressID) {
            this._changeMap[model.uuid].add(id);
            await this.onDataChanged.trigger({ model, expressID: id });
        }
    }
    async setData(model, ...dataToSave) {
        const { properties } = IfcPropertiesManager.getIFCInfo(model);
        for (const data of dataToSave) {
            const expressID = data.expressID;
            if (!expressID)
                continue;
            properties[expressID] = data;
            await this.registerChange(model, expressID);
        }
    }
    async newPset(model, name, description) {
        const { schema } = IfcPropertiesManager.getIFCInfo(model);
        const { ownerHistoryHandle } = this.getOwnerHistory(model);
        // Create the Pset
        const psetGlobalId = this.newGUID(model);
        const psetName = new WEBIFC[schema].IfcLabel(name);
        const psetDescription = description
            ? new WEBIFC[schema].IfcText(description)
            : null;
        const pset = new WEBIFC[schema].IfcPropertySet(psetGlobalId, ownerHistoryHandle, psetName, psetDescription, []);
        pset.expressID = this.increaseMaxID(model);
        // Create the Pset relation
        const relGlobalId = this.newGUID(model);
        const rel = new WEBIFC[schema].IfcRelDefinesByProperties(relGlobalId, ownerHistoryHandle, null, null, [], new WEBIFC.Handle(pset.expressID));
        rel.expressID = this.increaseMaxID(model);
        await this.setData(model, pset, rel);
        return { pset, rel };
    }
    async removePset(model, ...psetID) {
        const { properties } = IfcPropertiesManager.getIFCInfo(model);
        for (const expressID of psetID) {
            const pset = properties[expressID];
            if ((pset === null || pset === void 0 ? void 0 : pset.type) !== WEBIFC.IFCPROPERTYSET)
                continue;
            const relID = IfcPropertiesUtils.getPsetRel(properties, expressID);
            if (relID) {
                delete properties[relID];
                await this.registerChange(model, relID);
            }
            if (pset) {
                for (const propHandle of pset.HasProperties)
                    delete properties[propHandle.value];
                delete properties[expressID];
                await this.onPsetRemoved.trigger({ model, psetID: expressID });
                await this.registerChange(model, expressID);
            }
        }
    }
    async newSingleProperty(model, type, name, value) {
        const { schema } = IfcPropertiesManager.getIFCInfo(model);
        const propName = new WEBIFC[schema].IfcIdentifier(name);
        // @ts-ignore
        const propValue = new WEBIFC[schema][type](value);
        const prop = new WEBIFC[schema].IfcPropertySingleValue(propName, null, propValue, null);
        prop.expressID = this.increaseMaxID(model);
        await this.setData(model, prop);
        return prop;
    }
    newSingleStringProperty(model, type, name, value) {
        return this.newSingleProperty(model, type, name, value);
    }
    newSingleNumericProperty(model, type, name, value) {
        return this.newSingleProperty(model, type, name, value);
    }
    newSingleBooleanProperty(model, type, name, value) {
        return this.newSingleProperty(model, type, name, value);
    }
    async removePsetProp(model, psetID, propID) {
        const { properties } = IfcPropertiesManager.getIFCInfo(model);
        const pset = properties[psetID];
        const prop = properties[propID];
        if (!(pset.type === WEBIFC.IFCPROPERTYSET && prop))
            return;
        pset.HasProperties = pset.HasProperties.filter((handle) => {
            return handle.value !== propID;
        });
        delete properties[propID];
        await this.registerChange(model, psetID, propID);
    }
    async addElementToPset(model, psetID, ...elementID) {
        const { properties } = IfcPropertiesManager.getIFCInfo(model);
        const relID = IfcPropertiesUtils.getPsetRel(properties, psetID);
        if (!relID)
            return;
        const rel = properties[relID];
        for (const expressID of elementID) {
            const elementHandle = new WEBIFC.Handle(expressID);
            rel.RelatedObjects.push(elementHandle);
            await this.onElementToPset.trigger({
                model,
                psetID,
                elementID: expressID,
            });
        }
        await this.registerChange(model, psetID);
    }
    async addPropToPset(model, psetID, ...propID) {
        const { properties } = IfcPropertiesManager.getIFCInfo(model);
        const pset = properties[psetID];
        if (!pset)
            return;
        for (const expressID of propID) {
            if (pset.HasProperties.includes(expressID)) {
                continue;
            }
            const elementHandle = new WEBIFC.Handle(expressID);
            pset.HasProperties.push(elementHandle);
            await this.onPropToPset.trigger({ model, psetID, propID: expressID });
        }
        await this.registerChange(model, psetID);
    }
    async saveToIfc(model, ifcToSaveOn) {
        var _a;
        const { properties } = IfcPropertiesManager.getIFCInfo(model);
        const ifcLoader = this.components.tools.get(FragmentIfcLoader);
        const ifcApi = ifcLoader.get();
        const modelID = await ifcLoader.readIfcFile(ifcToSaveOn);
        const changes = (_a = this._changeMap[model.uuid]) !== null && _a !== void 0 ? _a : [];
        for (const expressID of changes) {
            const data = properties[expressID];
            if (!data) {
                try {
                    ifcApi.DeleteLine(modelID, expressID);
                }
                catch (err) {
                    // Nothing here...
                }
            }
            else {
                try {
                    ifcApi.WriteLine(modelID, data);
                }
                catch (err) {
                    // Nothing here...
                }
            }
        }
        const modifiedIFC = ifcApi.SaveModel(modelID);
        ifcLoader.get().CloseModel(modelID);
        ifcLoader.cleanIfcApi();
        return modifiedIFC;
    }
    setAttributeListener(model, expressID, attributeName) {
        if (!this.attributeListeners[model.uuid])
            this.attributeListeners[model.uuid] = {};
        const existingListener = this.attributeListeners[model.uuid][expressID]
            ? this.attributeListeners[model.uuid][expressID][attributeName]
            : null;
        if (existingListener)
            return existingListener;
        const { properties } = IfcPropertiesManager.getIFCInfo(model);
        const entity = properties[expressID];
        if (!entity) {
            throw new Error(`Entity with expressID ${expressID} doesn't exists.`);
        }
        const attribute = entity[attributeName];
        if (Array.isArray(attribute) || !attribute) {
            throw new Error(`Attribute ${attributeName} is array or null, and it can't have a listener.`);
        }
        const value = attribute.value;
        if (value === undefined || value == null) {
            throw new Error(`Attribute ${attributeName} has a badly defined handle.`);
        }
        // TODO: Is it good to set all the above as errors? Or better return null?
        // TODO: Do we need an async-await in the following set function?
        const event = new Event();
        Object.defineProperty(entity[attributeName], "value", {
            get() {
                return this._value;
            },
            async set(value) {
                this._value = value;
                await event.trigger(value);
            },
        });
        entity[attributeName].value = value;
        if (!this.attributeListeners[model.uuid][expressID])
            this.attributeListeners[model.uuid][expressID] = {};
        this.attributeListeners[model.uuid][expressID][attributeName] = event;
        return event;
    }
}
IfcPropertiesManager.uuid = "58c2d9f0-183c-48d6-a402-dfcf5b9a34df";
ToolComponent.libraryUUIDs.add(IfcPropertiesManager.uuid);
//# sourceMappingURL=index.js.map