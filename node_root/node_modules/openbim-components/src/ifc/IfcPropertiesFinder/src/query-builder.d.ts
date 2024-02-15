import { Event } from "../../../base-types";
import { Components } from "../../../core";
import { Button, SimpleUIComponent } from "../../../ui";
import { QueryGroup } from "./types";
export declare class QueryBuilder extends SimpleUIComponent {
    findButton: Button;
    readonly onQuerySet: Event<QueryGroup[]>;
    get query(): QueryGroup[];
    set query(value: QueryGroup[]);
    constructor(components: Components);
    dispose(onlyChildren?: boolean): Promise<void>;
}
