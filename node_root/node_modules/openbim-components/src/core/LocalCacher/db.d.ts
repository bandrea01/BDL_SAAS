import { Dexie } from "dexie";
interface IFile {
    id: string;
    file: Blob;
}
export declare class ModelDatabase extends Dexie {
    models: Dexie.Table<IFile, number>;
    constructor();
}
export {};
