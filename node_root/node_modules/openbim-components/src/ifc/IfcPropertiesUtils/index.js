import * as WEBIFC from "web-ifc";
import { IfcCategoryMap } from "../ifc-category-map";
export class IfcPropertiesUtils {
    static getUnits(properties) {
        var _a;
        const { IFCUNITASSIGNMENT } = WEBIFC;
        const allUnits = this.findItemOfType(properties, IFCUNITASSIGNMENT);
        if (!allUnits)
            return 1;
        for (const unitRef of allUnits.Units) {
            if (unitRef.value === undefined || unitRef.value === null)
                continue;
            const unit = properties[unitRef.value];
            if (!unit.UnitType || !unit.UnitType.value)
                continue;
            const value = unit.UnitType.value;
            if (value !== "LENGTHUNIT")
                continue;
            let factor = 1;
            let unitValue = 1;
            if (unit.Name.value === "METRE")
                unitValue = 1;
            if (unit.Name.value === "FOOT")
                unitValue = 0.3048;
            if (((_a = unit.Prefix) === null || _a === void 0 ? void 0 : _a.value) === "MILLI")
                factor = 0.001;
            return unitValue * factor;
        }
        return 1;
    }
    static findItemByGuid(properties, guid) {
        var _a;
        for (const id in properties) {
            const property = properties[id];
            if (((_a = property.GlobalId) === null || _a === void 0 ? void 0 : _a.value) === guid) {
                return property;
            }
        }
        return null;
    }
    static findItemOfType(properties, type) {
        for (const id in properties) {
            const property = properties[id];
            if (property.type === type) {
                return property;
            }
        }
        return null;
    }
    static getAllItemsOfType(properties, type) {
        const found = [];
        for (const id in properties) {
            const property = properties[id];
            if (!property)
                continue;
            if (property.type === type) {
                found.push(property);
            }
        }
        return found;
    }
    static getRelationMap(properties, relationType, onElementsFound) {
        var _a;
        const defaultCallback = () => { };
        const _onElementsFound = onElementsFound !== null && onElementsFound !== void 0 ? onElementsFound : defaultCallback;
        const result = {};
        for (const expressID in properties) {
            const prop = properties[expressID];
            if (prop === undefined) {
                continue;
            }
            const isRelation = prop.type === relationType;
            const relatingKey = Object.keys(prop).find((key) => key.startsWith("Relating"));
            const relatedKey = Object.keys(prop).find((key) => key.startsWith("Related"));
            if (!(isRelation && relatingKey && relatedKey))
                continue;
            const relating = properties[(_a = prop[relatingKey]) === null || _a === void 0 ? void 0 : _a.value];
            const related = prop[relatedKey];
            if (relating === undefined || related === undefined) {
                continue;
            }
            if (!(related && Array.isArray(related)))
                continue;
            const elements = related.map((el) => {
                return el.value;
            });
            _onElementsFound(relating.expressID, elements);
            result[relating.expressID] = elements;
        }
        return result;
    }
    static getQsetQuantities(properties, expressID, onQuantityFound) {
        var _a;
        const defaultCallback = () => { };
        const _onQuantityFound = onQuantityFound !== null && onQuantityFound !== void 0 ? onQuantityFound : defaultCallback;
        const pset = properties[expressID];
        if ((pset === null || pset === void 0 ? void 0 : pset.type) !== WEBIFC.IFCELEMENTQUANTITY)
            return null;
        const quantities = (_a = pset.Quantities) !== null && _a !== void 0 ? _a : [{}];
        const qtos = quantities.map((prop) => {
            if (prop.value)
                _onQuantityFound(prop.value);
            return prop.value;
        });
        return qtos.filter((prop) => prop !== null);
    }
    static getPsetProps(properties, expressID, onPropFound) {
        var _a;
        const defaultCallback = () => { };
        const _onPropFound = onPropFound !== null && onPropFound !== void 0 ? onPropFound : defaultCallback;
        const pset = properties[expressID];
        if ((pset === null || pset === void 0 ? void 0 : pset.type) !== WEBIFC.IFCPROPERTYSET)
            return null;
        const hasProperties = (_a = pset.HasProperties) !== null && _a !== void 0 ? _a : [{}];
        const props = hasProperties.map((prop) => {
            if (prop.value)
                _onPropFound(prop.value);
            return prop.value;
        });
        return props.filter((prop) => prop !== null);
    }
    static getPsetRel(properties, psetID) {
        const arrayProperties = Object.values(properties);
        if (!properties[psetID])
            return null;
        const rel = arrayProperties.find((data) => {
            var _a;
            const isRelation = data.type === WEBIFC.IFCRELDEFINESBYPROPERTIES;
            const relatesToPset = ((_a = data.RelatingPropertyDefinition) === null || _a === void 0 ? void 0 : _a.value) === psetID;
            return isRelation && relatesToPset;
        });
        return rel ? rel.expressID : null;
    }
    static getQsetRel(properties, qsetID) {
        return IfcPropertiesUtils.getPsetRel(properties, qsetID);
    }
    static getEntityName(properties, entityID) {
        var _a;
        const entity = properties[entityID];
        const key = (_a = Object.keys(entity).find((key) => key.endsWith("Name"))) !== null && _a !== void 0 ? _a : null;
        const name = key ? entity[key].value : null;
        return { key, name };
    }
    static getQuantityValue(properties, quantityID) {
        var _a;
        const quantity = properties[quantityID];
        const key = (_a = Object.keys(quantity).find((key) => key.endsWith("Value"))) !== null && _a !== void 0 ? _a : null;
        let value;
        if (key === null) {
            value = null;
        }
        else if (quantity[key] === undefined || quantity[key] === null) {
            value = null;
        }
        else {
            value = quantity[key].value;
        }
        return { key, value };
    }
    static isRel(expressID) {
        const entityName = IfcCategoryMap[expressID];
        return entityName.startsWith("IFCREL");
    }
    static attributeExists(properties, expressID, attribute) {
        const entity = properties[expressID];
        if (!entity)
            return false;
        return Object.keys(properties[expressID]).includes(attribute);
    }
    static groupEntitiesByType(properties, expressIDs) {
        var _a;
        const categoriesMap = new Map();
        for (const expressID of expressIDs) {
            const entity = properties[expressID];
            if (!entity)
                continue;
            const key = entity.type;
            const set = categoriesMap.get(key);
            if (!set)
                categoriesMap.set(key, new Set());
            (_a = categoriesMap.get(key)) === null || _a === void 0 ? void 0 : _a.add(expressID);
        }
        return categoriesMap;
    }
}
//# sourceMappingURL=index.js.map