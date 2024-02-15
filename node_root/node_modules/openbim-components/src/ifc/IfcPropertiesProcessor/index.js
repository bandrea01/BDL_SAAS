import * as WEBIFC from "web-ifc";
import { IfcPropertiesUtils } from "../IfcPropertiesUtils";
import { Button, FloatingWindow, SimpleUIComponent, TreeView } from "../../ui";
import { Event, UIElement, Component } from "../../base-types";
import { ToolComponent } from "../../core";
import { IfcPropertiesManager } from "../IfcPropertiesManager";
import { IfcCategoryMap } from "../ifc-category-map";
import { AttributeSet, PropertyTag } from "./src";
import { FragmentManager } from "../../fragments/FragmentManager";
export * from "./src";
export class IfcPropertiesProcessor extends Component {
    // private _entityUIPool: UIPool<TreeView>;
    set propertiesManager(manager) {
        if (this._propertiesManager)
            return;
        this._propertiesManager = manager;
        if (manager) {
            manager.onElementToPset.add(({ model, psetID, elementID }) => {
                const modelIndexMap = this._indexMap[model.uuid];
                if (!modelIndexMap)
                    return;
                this.setEntityIndex(model, elementID).add(psetID);
                if (this._currentUI[elementID]) {
                    const ui = this.newPsetUI(model, psetID);
                    this._currentUI[elementID].addChild(...ui);
                }
            });
            manager.onPsetRemoved.add(async ({ psetID }) => {
                const psetUI = this._currentUI[psetID];
                if (psetUI) {
                    await psetUI.dispose();
                }
            });
            manager.onPropToPset.add(({ model, psetID, propID }) => {
                const psetUI = this._currentUI[psetID];
                if (!psetUI)
                    return;
                const tag = this.newPropertyTag(model, psetID, propID, "NominalValue");
                if (tag)
                    psetUI.addChild(tag);
            });
            this.onPropertiesManagerSet.trigger(manager);
        }
    }
    get propertiesManager() {
        return this._propertiesManager;
    }
    constructor(components) {
        super(components);
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        this.enabled = true;
        this.uiElement = new UIElement();
        this.relationsToProcess = [
            WEBIFC.IFCRELDEFINESBYPROPERTIES,
            WEBIFC.IFCRELDEFINESBYTYPE,
            WEBIFC.IFCRELASSOCIATESMATERIAL,
            WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE,
            WEBIFC.IFCRELASSOCIATESCLASSIFICATION,
            WEBIFC.IFCRELASSIGNSTOGROUP,
        ];
        this.entitiesToIgnore = [WEBIFC.IFCOWNERHISTORY, WEBIFC.IFCMATERIALLAYERSETUSAGE];
        this.attributesToIgnore = [
            "CompositionType",
            "Representation",
            "ObjectPlacement",
            "OwnerHistory",
        ];
        this._indexMap = {};
        this._renderFunctions = {};
        this._propertiesManager = null;
        this._currentUI = {};
        this.onPropertiesManagerSet = new Event();
        this.onFragmentsDisposed = (data) => {
            delete this._indexMap[data.groupID];
        };
        this.components.tools.add(IfcPropertiesProcessor.uuid, this);
        // this._entityUIPool = new UIPool(this._components, TreeView);
        this._renderFunctions = this.getRenderFunctions();
        const fragmentManager = components.tools.get(FragmentManager);
        fragmentManager.onFragmentsDisposed.add(this.onFragmentsDisposed);
        if (components.uiEnabled) {
            this.setUI();
        }
    }
    getRenderFunctions() {
        return {
            0: (model, expressID) => this.newEntityUI(model, expressID),
            [WEBIFC.IFCPROPERTYSET]: (model, expressID) => this.newPsetUI(model, expressID),
            [WEBIFC.IFCELEMENTQUANTITY]: (model, expressID) => this.newQsetUI(model, expressID),
        };
    }
    async dispose() {
        this.uiElement.dispose();
        this._indexMap = {};
        this.propertiesManager = null;
        for (const id in this._currentUI) {
            await this._currentUI[id].dispose();
        }
        this._currentUI = {};
        this.onPropertiesManagerSet.reset();
        const fragmentManager = this.components.tools.get(FragmentManager);
        fragmentManager.onFragmentsDisposed.remove(this.onFragmentsDisposed);
        await this.onDisposed.trigger(IfcPropertiesProcessor.uuid);
        this.onDisposed.reset();
    }
    getProperties(model, id) {
        if (!model.properties)
            return null;
        const map = this._indexMap[model.uuid];
        if (!map)
            return null;
        const indices = map[id];
        const idNumber = parseInt(id, 10);
        const nativeProperties = this.cloneProperty(model.properties[idNumber]);
        const properties = [nativeProperties];
        if (indices) {
            for (const index of indices) {
                const pset = this.cloneProperty(model.properties[index]);
                if (!pset)
                    continue;
                this.getPsetProperties(pset, model.properties);
                this.getNestedPsets(pset, model.properties);
                properties.push(pset);
            }
        }
        return properties;
    }
    getNestedPsets(pset, props) {
        if (pset.HasPropertySets) {
            for (const subPSet of pset.HasPropertySets) {
                const psetID = subPSet.value;
                subPSet.value = this.cloneProperty(props[psetID]);
                this.getPsetProperties(subPSet.value, props);
            }
        }
    }
    getPsetProperties(pset, props) {
        if (pset.HasProperties) {
            for (const property of pset.HasProperties) {
                const psetID = property.value;
                const result = this.cloneProperty(props[psetID]);
                property.value = { ...result };
            }
        }
    }
    setUI() {
        const topToolbar = new SimpleUIComponent(this.components);
        const propsList = new SimpleUIComponent(this.components, `<div class="flex flex-col"></div>`);
        const main = new Button(this.components, {
            materialIconName: "list",
        });
        const propertiesWindow = new FloatingWindow(this.components);
        this.components.ui.add(propertiesWindow);
        propertiesWindow.title = "Element Properties";
        propertiesWindow.addChild(topToolbar, propsList);
        main.tooltip = "Properties";
        main.onClick.add(() => {
            propertiesWindow.visible = !propertiesWindow.visible;
        });
        propertiesWindow.onHidden.add(() => (main.active = false));
        propertiesWindow.onVisible.add(() => (main.active = true));
        propertiesWindow.visible = false;
        this.uiElement.set({
            main,
            propertiesWindow,
            propsList,
            topToolbar,
        });
    }
    async cleanPropertiesList() {
        this._currentUI = {};
        if (this.components.uiEnabled) {
            if (this._propertiesManager) {
                const button = this._propertiesManager.uiElement.get("exportButton");
                button.removeFromParent();
            }
            const propsList = this.uiElement.get("propsList");
            await propsList.dispose(true);
            const propsWindow = this.uiElement.get("propertiesWindow");
            propsWindow.description = null;
            propsList.children = [];
        }
        // for (const child of this._propsList.children) {
        //   if (child instanceof TreeView) {
        //     this._entityUIPool.return(child);
        //     continue;
        //   }
        //   child.dispose();
        // }
    }
    get() {
        return this._indexMap;
    }
    process(model) {
        const properties = model.properties;
        if (!properties)
            throw new Error("FragmentsGroup properties not found");
        this._indexMap[model.uuid] = {};
        // const relations: number[] = [];
        // for (const typeID in IfcCategoryMap) {
        //   const name = IfcCategoryMap[typeID];
        //   if (name.startsWith("IFCREL")) relations.push(Number(typeID));
        // }
        const setEntities = [WEBIFC.IFCPROPERTYSET, WEBIFC.IFCELEMENTQUANTITY];
        for (const relation of this.relationsToProcess) {
            IfcPropertiesUtils.getRelationMap(properties, relation, (relationID, relatedIDs) => {
                const relationEntity = properties[relationID];
                if (!setEntities.includes(relationEntity.type))
                    this.setEntityIndex(model, relationID);
                for (const expressID of relatedIDs) {
                    this.setEntityIndex(model, expressID).add(relationID);
                }
            });
        }
    }
    async renderProperties(model, expressID) {
        if (!this.components.uiEnabled)
            return;
        await this.cleanPropertiesList();
        const topToolbar = this.uiElement.get("topToolbar");
        const propsList = this.uiElement.get("propsList");
        const propsWindow = this.uiElement.get("propertiesWindow");
        const ui = this.newEntityUI(model, expressID);
        if (!ui)
            return;
        if (this._propertiesManager) {
            this._propertiesManager.selectedModel = model;
            const exporter = this._propertiesManager.uiElement.get("exportButton");
            topToolbar.addChild(exporter);
        }
        const { properties } = IfcPropertiesManager.getIFCInfo(model);
        const { name } = IfcPropertiesUtils.getEntityName(properties, expressID);
        propsWindow.description = name;
        propsList.addChild(...[ui].flat());
    }
    newEntityUI(model, expressID) {
        const properties = model.properties;
        if (!properties)
            throw new Error("FragmentsGroup properties not found.");
        const modelElementsIndexation = this._indexMap[model.uuid];
        if (!modelElementsIndexation)
            return null;
        const entity = properties[expressID];
        const ignorable = this.entitiesToIgnore.includes(entity === null || entity === void 0 ? void 0 : entity.type);
        if (!entity || ignorable)
            return null;
        if (entity.type === WEBIFC.IFCPROPERTYSET)
            return this.newPsetUI(model, expressID);
        const mainGroup = this.newEntityTree(model, expressID);
        if (!mainGroup)
            return null;
        this.addEntityActions(model, expressID, mainGroup);
        mainGroup.onExpand.add(() => {
            var _a, _b;
            const { uiProcessed } = mainGroup.data;
            if (uiProcessed)
                return;
            mainGroup.addChild(...this.newAttributesUI(model, expressID));
            const elementPropsIndexation = (_a = modelElementsIndexation[expressID]) !== null && _a !== void 0 ? _a : [];
            for (const id of elementPropsIndexation) {
                const entity = properties[id];
                if (!entity)
                    continue;
                const renderFunction = (_b = this._renderFunctions[entity.type]) !== null && _b !== void 0 ? _b : this._renderFunctions[0];
                const ui = modelElementsIndexation[id]
                    ? this.newEntityUI(model, id)
                    : renderFunction(model, id);
                if (!ui)
                    continue;
                mainGroup.addChild(...[ui].flat());
            }
            mainGroup.data.uiProcessed = true;
        });
        return mainGroup;
    }
    setEntityIndex(model, expressID) {
        if (!this._indexMap[model.uuid][expressID])
            this._indexMap[model.uuid][expressID] = new Set();
        return this._indexMap[model.uuid][expressID];
    }
    newAttributesUI(model, expressID) {
        const { properties } = IfcPropertiesManager.getIFCInfo(model);
        if (!properties)
            return [];
        const attributesGroup = new AttributeSet(this.components, this, model, expressID);
        attributesGroup.attributesToIgnore = this.attributesToIgnore;
        return [attributesGroup];
    }
    newPsetUI(model, psetID) {
        const { properties } = IfcPropertiesManager.getIFCInfo(model);
        const uiGroups = [];
        const pset = properties[psetID];
        if (pset.type !== WEBIFC.IFCPROPERTYSET)
            return uiGroups;
        const uiGroup = this.newEntityTree(model, psetID);
        if (!uiGroup)
            return uiGroups;
        this.addPsetActions(model, psetID, uiGroup);
        uiGroup.onExpand.add(() => {
            const { uiProcessed } = uiGroup.data;
            if (uiProcessed)
                return;
            const psetPropsID = IfcPropertiesUtils.getPsetProps(properties, psetID, (propID) => {
                const prop = properties[propID];
                if (!prop)
                    return;
                const tag = this.newPropertyTag(model, psetID, propID, "NominalValue");
                if (tag)
                    uiGroup.addChild(tag);
            });
            if (!psetPropsID || psetPropsID.length === 0) {
                const template = `
         <p class="text-base text-gray-500 py-1 px-3">
            This pset has no properties.
         </p>
        `;
                const notFoundText = new SimpleUIComponent(this.components, template);
                uiGroup.addChild(notFoundText);
            }
            uiGroup.data.uiProcessed = true;
        });
        uiGroups.push(uiGroup);
        return uiGroups;
    }
    newQsetUI(model, qsetID) {
        const { properties } = IfcPropertiesManager.getIFCInfo(model);
        const uiGroups = [];
        const qset = properties[qsetID];
        if (qset.type !== WEBIFC.IFCELEMENTQUANTITY)
            return uiGroups;
        const uiGroup = this.newEntityTree(model, qsetID);
        if (!uiGroup)
            return uiGroups;
        this.addPsetActions(model, qsetID, uiGroup);
        IfcPropertiesUtils.getQsetQuantities(properties, qsetID, (quantityID) => {
            const { key } = IfcPropertiesUtils.getQuantityValue(properties, quantityID);
            if (!key)
                return;
            const tag = this.newPropertyTag(model, qsetID, quantityID, key);
            if (tag)
                uiGroup.addChild(tag);
        });
        uiGroups.push(uiGroup);
        return uiGroups;
    }
    addPsetActions(model, psetID, uiGroup) {
        if (!this.propertiesManager)
            return;
        const propsUI = this.propertiesManager.uiElement;
        const psetActions = propsUI.get("psetActions");
        const event = this.propertiesManager.setAttributeListener(model, psetID, "Name");
        event.add((v) => (uiGroup.description = v.toString()));
        uiGroup.innerElements.titleContainer.onmouseenter = () => {
            psetActions.data = { model, psetID };
            uiGroup.slots.titleRight.addChild(psetActions);
        };
        uiGroup.innerElements.titleContainer.onmouseleave = () => {
            if (psetActions.modalVisible)
                return;
            psetActions.removeFromParent();
            psetActions.cleanData();
        };
    }
    addEntityActions(model, expressID, uiGroup) {
        if (!this.propertiesManager)
            return;
        const propsUI = this.propertiesManager.uiElement;
        const entityActions = propsUI.get("entityActions");
        uiGroup.innerElements.titleContainer.onmouseenter = () => {
            entityActions.data = { model, elementIDs: [expressID] };
            uiGroup.slots.titleRight.addChild(entityActions);
        };
        uiGroup.innerElements.titleContainer.onmouseleave = () => {
            if (entityActions.modal.visible)
                return;
            entityActions.removeFromParent();
            entityActions.cleanData();
        };
    }
    newEntityTree(model, expressID) {
        const { properties } = IfcPropertiesManager.getIFCInfo(model);
        const entity = properties[expressID];
        if (!entity)
            return null;
        const currentUI = this._currentUI[expressID];
        if (currentUI)
            return currentUI;
        const entityTree = new TreeView(this.components);
        this._currentUI[expressID] = entityTree;
        // const entityTree = this._entityUIPool.get();
        entityTree.title = `${IfcCategoryMap[entity.type]}`;
        const { name } = IfcPropertiesUtils.getEntityName(properties, expressID);
        entityTree.description = name;
        return entityTree;
    }
    newPropertyTag(model, setID, expressID, valueKey) {
        const { properties } = IfcPropertiesManager.getIFCInfo(model);
        const entity = properties[expressID];
        if (!entity)
            return null;
        const tag = new PropertyTag(this.components, this, model, expressID);
        // @ts-ignore
        this._currentUI[expressID] = tag;
        if (!this.propertiesManager)
            return tag;
        // #region ManagementUI
        const propsUI = this.propertiesManager.uiElement;
        const propActions = propsUI.get("propActions");
        tag.get().onmouseenter = () => {
            propActions.data = { model, setID, expressID, valueKey };
            tag.addChild(propActions);
        };
        tag.get().onmouseleave = () => {
            if (propActions.modalVisible)
                return;
            propActions.removeFromParent();
            propActions.cleanData();
        };
        // #endregion ManagementUI
        return tag;
    }
    cloneProperty(item, result = {}) {
        if (!item) {
            return result;
        }
        for (const key in item) {
            const value = item[key];
            const isArray = Array.isArray(value);
            const isObject = typeof value === "object" && !isArray && value !== null;
            if (isArray) {
                result[key] = [];
                const subResult = result[key];
                this.clonePropertyArray(value, subResult);
            }
            else if (isObject) {
                result[key] = {};
                const subResult = result[key];
                this.cloneProperty(value, subResult);
            }
            else {
                result[key] = value;
            }
        }
        return result;
    }
    clonePropertyArray(item, result) {
        for (const value of item) {
            const isArray = Array.isArray(value);
            const isObject = typeof value === "object" && !isArray && value !== null;
            if (isArray) {
                const subResult = [];
                result.push(subResult);
                this.clonePropertyArray(value, subResult);
            }
            else if (isObject) {
                const subResult = {};
                result.push(subResult);
                this.cloneProperty(value, subResult);
            }
            else {
                result.push(value);
            }
        }
    }
}
IfcPropertiesProcessor.uuid = "23a889ab-83b3-44a4-8bee-ead83438370b";
ToolComponent.libraryUUIDs.add(IfcPropertiesProcessor.uuid);
//# sourceMappingURL=index.js.map