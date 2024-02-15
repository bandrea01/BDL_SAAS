import { PropertyTag } from "./property-tag";
export class AttributeTag extends PropertyTag {
    constructor(components, propertiesProcessor, model, expressID, attributeName = "Name") {
        super(components, propertiesProcessor, model, expressID);
        this.name = "AttributeTag";
        this.expressID = 0;
        this.model = model;
        this.expressID = expressID;
        this.attributeName = attributeName;
        this._propertiesProcessor = propertiesProcessor;
        this.setInitialValues();
        this.setListeners();
    }
    async dispose(onlyChildren = false) {
        await super.dispose(onlyChildren);
        this.model = null;
    }
    setListeners() {
        const propertiesManager = this._propertiesProcessor.propertiesManager;
        if (!propertiesManager)
            return;
        try {
            const event = propertiesManager.setAttributeListener(this.model, this.expressID, this.attributeName);
            event.add((v) => (this.value = v));
        }
        catch (err) {
            // console.log(err);
        }
    }
    setInitialValues() {
        const properties = this.model.properties;
        if (!properties) {
            this.label = `Model ${this.model.ifcMetadata.name} has no properties`;
            this.value = "NULL";
            return;
        }
        const entity = properties[this.expressID];
        if (!entity) {
            this.label = `ExpressID ${this.expressID} not found`;
            this.value = "NULL";
            return;
        }
        const attributes = Object.keys(entity);
        if (!attributes.includes(this.attributeName)) {
            this.label = `Attribute ${this.attributeName} not found`;
            this.value = "NULL";
            return;
        }
        if (!entity[this.attributeName])
            return;
        this.label = this.attributeName;
        this.value = entity[this.attributeName].value;
    }
}
//# sourceMappingURL=attribute-tag.js.map