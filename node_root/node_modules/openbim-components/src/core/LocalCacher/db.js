import { Dexie } from "dexie";
export class ModelDatabase extends Dexie {
    constructor() {
        super("ModelDatabase");
        this.version(2).stores({
            models: "id, file",
        });
    }
}
//# sourceMappingURL=db.js.map