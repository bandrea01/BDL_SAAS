import { Component } from "../../base-types/component";
import { UIElement } from "../../base-types/ui-element";
import { Disposable, UI, Event } from "../../base-types/base-types";
import { Button } from "../../ui/ButtonComponent";
import { FloatingWindow } from "../../ui/FloatingWindow";
import { SimpleUICard } from "../../ui/SimpleUICard";
import { Components } from "../Components";
/**
 * A tool to cache files using the browser's IndexedDB API. This might
 * save loading time and infrastructure costs for files that need to be
 * fetched from the cloud.
 */
export declare class LocalCacher extends Component<any> implements UI, Disposable {
    static readonly uuid: "22ae591a-3a67-4988-86c6-68d7b83febf2";
    /** Fires when a file has been loaded from cache. */
    readonly onFileLoaded: Event<{
        id: string;
    }>;
    /** Fires when a file has been saved into cache. */
    readonly onItemSaved: Event<{
        id: string;
    }>;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    /** {@link Component.enabled} */
    enabled: boolean;
    /** {@link UI.uiElement} */
    uiElement: UIElement<{
        main: Button;
        saveButton: Button;
        loadButton: Button;
        floatingMenu: FloatingWindow;
    }>;
    protected cards: SimpleUICard[];
    private _db;
    private readonly _storedModels;
    /** The IDs of all the stored files. */
    get ids(): string[];
    constructor(components: Components);
    /**
     * {@link Component.get}.
     * @param id the ID of the file to fetch.
     */
    get(id: string): Promise<Blob | null>;
    /**
     * Saves the file with the given ID.
     * @param id the ID to assign to the file.
     * @param url the URL where the file is located.
     */
    save(id: string, url: string): Promise<void>;
    /**
     * Checks if there's a file stored with the given ID.
     * @param id to check.
     */
    exists(id: string): boolean;
    /**
     * Deletes the files stored in the given ids.
     * @param ids the identifiers of the files to delete.
     */
    delete(ids: string[]): Promise<void>;
    /** Deletes all the stored files. */
    deleteAll(): Promise<void>;
    /** {@link Disposable.dispose} */
    dispose(): Promise<void>;
    private setUI;
    private getModelFromLocalCache;
    private clearStoredIDs;
    private removeStoredID;
    private addStoredID;
    private setStoredIDs;
}
