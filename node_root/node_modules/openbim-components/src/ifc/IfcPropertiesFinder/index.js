import * as WEBIFC from "web-ifc";
import { Event, Component, UIElement, } from "../../base-types";
import { IfcPropertiesUtils } from "../IfcPropertiesUtils";
import { Button, FloatingWindow } from "../../ui";
import { FragmentManager } from "../../fragments/FragmentManager";
import { QueryBuilder } from "./src/query-builder";
import { IfcPropertiesManager } from "../IfcPropertiesManager";
export class IfcPropertiesFinder extends Component {
    constructor(components) {
        super(components);
        this.onFound = new Event();
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
        this.enabled = true;
        this.uiElement = new UIElement();
        this._localStorageID = "IfcPropertiesFinder";
        this._indexedModels = {};
        this._noHandleAttributes = ["type"];
        this.onFragmentsDisposed = (data) => {
            delete this._indexedModels[data.groupID];
        };
        this._conditionFunctions = this.getConditionFunctions();
        const fragmentManager = components.tools.get(FragmentManager);
        fragmentManager.onFragmentsDisposed.add(this.onFragmentsDisposed);
    }
    init() {
        if (this.components.uiEnabled) {
            this.setUI();
        }
    }
    get() {
        return this._indexedModels;
    }
    async dispose() {
        this._indexedModels = {};
        this.onFound.reset();
        this.uiElement.dispose();
        await this.onDisposed.trigger();
        this.onDisposed.reset();
    }
    loadCached(id) {
        if (id) {
            this._localStorageID = `IfcPropertiesFinder-${id}`;
        }
        const serialized = localStorage.getItem(this._localStorageID);
        if (!serialized)
            return;
        const groups = JSON.parse(serialized);
        const queryBuilder = this.uiElement.get("query");
        queryBuilder.query = groups;
    }
    deleteCache() {
        localStorage.removeItem(this._localStorageID);
    }
    setUI() {
        const main = new Button(this.components, {
            materialIconName: "manage_search",
        });
        const queryWindow = new FloatingWindow(this.components);
        this.components.ui.add(queryWindow);
        const fragments = this.components.tools.get(FragmentManager);
        // queryWindow.get().classList.add("overflow-visible");
        queryWindow.get().style.width = "700px";
        queryWindow.get().style.height = "420px";
        queryWindow.visible = false;
        // queryWindow.resizeable = false;
        queryWindow.title = "Model Queries";
        main.onClick.add(() => {
            queryWindow.visible = !queryWindow.visible;
        });
        queryWindow.onVisible.add(() => (main.active = true));
        queryWindow.onHidden.add(() => (main.active = false));
        const query = new QueryBuilder(this.components);
        query.findButton.onClick.add(async () => {
            const model = fragments.groups[0];
            if (!model)
                return;
            await this.find();
        });
        queryWindow.addChild(query);
        this.uiElement.set({
            main,
            queryWindow,
            query,
        });
    }
    indexEntityRelations(model) {
        const map = {};
        const { properties } = IfcPropertiesManager.getIFCInfo(model);
        IfcPropertiesUtils.getRelationMap(properties, WEBIFC.IFCRELDEFINESBYPROPERTIES, (relatingID, relatedIDs) => {
            if (!map[relatingID])
                map[relatingID] = new Set();
            const props = [];
            IfcPropertiesUtils.getPsetProps(properties, relatingID, (propID) => {
                props.push(propID);
                map[relatingID].add(propID);
                if (!map[propID])
                    map[propID] = new Set();
                map[propID].add(relatingID);
            });
            for (const relatedID of relatedIDs) {
                map[relatingID].add(relatedID);
                for (const propID of props)
                    map[propID].add(relatedID);
                if (!map[relatedID])
                    map[relatedID] = new Set();
                map[relatedID].add(relatedID);
            }
        });
        const ifcRelations = [
            WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE,
            WEBIFC.IFCRELDEFINESBYTYPE,
            WEBIFC.IFCRELASSIGNSTOGROUP,
        ];
        for (const relation of ifcRelations) {
            IfcPropertiesUtils.getRelationMap(properties, relation, (relatingID, relatedIDs) => {
                if (!map[relatingID])
                    map[relatingID] = new Set();
                for (const relatedID of relatedIDs) {
                    map[relatingID].add(relatedID);
                    if (!map[relatedID])
                        map[relatedID] = new Set();
                    map[relatedID].add(relatedID);
                }
            });
        }
        this._indexedModels[model.uuid] = map;
        return map;
    }
    async find(queryGroups, queryModels) {
        const fragments = this.components.tools.get(FragmentManager);
        const queries = this.uiElement.get("query");
        const models = queryModels || fragments.groups;
        const groups = queryGroups || queries.query;
        const result = {};
        this.cache();
        for (const model of models) {
            let map = this._indexedModels[model.uuid];
            if (!map)
                map = this.indexEntityRelations(model);
            let relations = [];
            for (const [index, group] of groups.entries()) {
                const excludedItems = new Set();
                const groupResult = this.simpleQuery(model, group, excludedItems);
                const groupRelations = [];
                for (const expressID of groupResult) {
                    const relations = map[expressID];
                    if (!relations)
                        continue;
                    groupRelations.push(expressID);
                    for (const id of relations) {
                        if (!excludedItems.has(id)) {
                            groupRelations.push(id);
                        }
                    }
                }
                relations =
                    group.operator === "AND" && index > 0
                        ? this.getCommonElements(relations, groupRelations)
                        : [...relations, ...groupRelations];
            }
            const modelEntities = new Set();
            for (const expressID in model.data) {
                const included = relations.includes(Number(expressID));
                if (!included)
                    continue;
                modelEntities.add(Number(expressID));
            }
            const otherEntities = new Set();
            for (const expressID of relations) {
                const included = modelEntities.has(expressID);
                if (included)
                    continue;
                otherEntities.add(expressID);
            }
            result[model.uuid] = { modelEntities, otherEntities };
        }
        const foundFragments = this.toFragmentMap(result);
        this.onFound.trigger(foundFragments);
        return foundFragments;
    }
    toFragmentMap(data) {
        const fragments = this.components.tools.get(FragmentManager);
        const fragmentMap = {};
        for (const modelID in data) {
            const model = fragments.groups.find((m) => m.uuid === modelID);
            if (!model)
                continue;
            const matchingEntities = data[modelID].modelEntities;
            for (const expressID of matchingEntities) {
                const data = model.data[expressID];
                if (!data)
                    continue;
                for (const key of data[0]) {
                    const fragmentID = model.keyFragments[key];
                    if (!fragmentMap[fragmentID]) {
                        fragmentMap[fragmentID] = new Set();
                    }
                    fragmentMap[fragmentID].add(String(expressID));
                }
            }
        }
        return fragmentMap;
    }
    simpleQuery(model, queryGroup, excludedItems) {
        var _a;
        const properties = model.properties;
        if (!properties)
            throw new Error("Model has no properties");
        let filteredProps = {};
        let iterations = 0;
        let matchingEntities = [];
        for (const query of queryGroup.queries) {
            let queryResult = [];
            const workingProps = query.operator === "AND" ? filteredProps : properties;
            const isAttributeQuery = query.condition; // Is there a better way?
            if (isAttributeQuery) {
                const matchingResult = this.getMatchingEntities(workingProps, query, excludedItems);
                queryResult = matchingResult.expressIDs;
                filteredProps = { ...filteredProps, ...matchingResult.entities };
            }
            else {
                queryResult = [
                    ...this.simpleQuery(model, query, excludedItems),
                ];
            }
            matchingEntities =
                iterations === 0
                    ? queryResult
                    : this.combineArrays(matchingEntities, queryResult, (_a = query.operator) !== null && _a !== void 0 ? _a : "AND" // Defaults to AND if iterations > 0 and query.operator is not defined
                    );
            iterations++;
        }
        return new Set(matchingEntities);
    }
    getMatchingEntities(entities, query, excludedItems) {
        const { attribute: attributeName, condition } = query;
        let { value } = query;
        const handleAttribute = !this._noHandleAttributes.includes(attributeName);
        const expressIDs = [];
        const matchingEntities = [];
        for (const expressID in entities) {
            const entity = entities[expressID];
            if (entity === undefined) {
                continue;
            }
            const attribute = entity[attributeName];
            let attributeValue = handleAttribute ? attribute === null || attribute === void 0 ? void 0 : attribute.value : attribute;
            if (attributeValue === undefined || attributeValue === null)
                continue;
            // TODO: Maybe the user can specify the value type in the finder menu, so we don't need this
            const type1 = typeof value;
            const type2 = typeof attributeValue;
            if (type1 === "number" && type2 === "string") {
                value = value.toString();
            }
            else if (type1 === "string" && type2 === "number") {
                attributeValue = attributeValue.toString();
            }
            let conditionMatches = this._conditionFunctions[condition](attributeValue, value);
            if (query.negateResult) {
                conditionMatches = !conditionMatches;
            }
            if (!conditionMatches) {
                if (query.negateResult) {
                    excludedItems.add(entity.expressID);
                }
                continue;
            }
            expressIDs.push(entity.expressID);
            matchingEntities.push(entity);
        }
        return { expressIDs, entities: matchingEntities, excludedItems };
    }
    combineArrays(arrA, arrB, operator) {
        if (!operator)
            return arrB;
        return operator === "AND"
            ? this.arrayIntersection(arrA, arrB)
            : this.arrayUnion(arrA, arrB);
    }
    getCommonElements(...lists) {
        const result = [];
        const elementsCount = new Map();
        for (const list of lists) {
            const uniqueElements = new Set(list);
            for (const element of uniqueElements) {
                if (elementsCount.has(element)) {
                    elementsCount.set(element, elementsCount.get(element) + 1);
                }
                else {
                    elementsCount.set(element, 1);
                }
            }
        }
        for (const [element, count] of elementsCount) {
            if (count === lists.length) {
                result.push(element);
            }
        }
        return result;
    }
    arrayIntersection(arrA, arrB) {
        return arrA.filter((x) => arrB.includes(x));
    }
    arrayUnion(arrA, arrB) {
        return [...arrA, ...arrB];
    }
    cache() {
        const queryBuilder = this.uiElement.get("query");
        const query = queryBuilder.query;
        const serialized = JSON.stringify(query);
        localStorage.setItem(this._localStorageID, serialized);
    }
    getConditionFunctions() {
        return {
            is: (leftValue, rightValue) => {
                return leftValue === rightValue;
            },
            includes: (leftValue, rightValue) => {
                return leftValue.toString().includes(rightValue.toString());
            },
            startsWith: (leftValue, rightValue) => {
                return leftValue.toString().startsWith(rightValue.toString());
            },
            endsWith: (leftValue, rightValue) => {
                return leftValue.toString().endsWith(rightValue.toString());
            },
            matches: (leftValue, rightValue) => {
                const regex = new RegExp(rightValue.toString());
                return regex.test(leftValue.toString());
            },
        };
    }
}
//# sourceMappingURL=index.js.map