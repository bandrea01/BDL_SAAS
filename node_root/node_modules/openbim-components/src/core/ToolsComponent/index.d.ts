import { Component, Disposable, Event } from "../../base-types";
import { Components } from "../Components";
/**
 * An object to easily handle all the tools used (e.g. updating them, retrieving
 * them, performing batch operations, etc). A tool is a feature that achieves
 * something through user interaction (e.g. clipping planes, dimensions, etc).
 */
export declare class ToolComponent extends Component<Component<any>> implements Disposable {
    /** The list of components created in this app. */
    list: Record<string, Component<any>>;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<undefined>;
    /** The list of UUIDs of all the components in this library. */
    static readonly libraryUUIDs: Set<unknown>;
    /** The auth token to get tools from That Open Platform. */
    token: string;
    /** {@link Component.uuid} */
    uuid: string;
    /** {@link Component.enabled} */
    enabled: boolean;
    private _reader;
    private _urls;
    private _OBC;
    /** Pass the whole library object as argument.
     * @param ORB: `import * as OBC from "openbim-components"`.
     */
    init(OBC: any): void;
    readonly onToolAdded: Event<Component<any>>;
    /**
     * Adds a new tool. Use this in the constructor of your tools.
     *
     * @param uuid The UUID of your tool.
     * @param instance The instance of your tool (`this` inside the constructor).
     */
    add(uuid: string, instance: Component<any>): void;
    /**
     * Retrieves a tool component. If it already exists in this app, it returns the instance of the component. If it
     * doesn't exist, it will instance it automatically.
     *
     * @param ToolClass - The component to get or create.
     */
    get<T, U extends Component<T>>(ToolClass: new (components: Components) => U): U;
    /**
     * Updates all the registered tool components. Only the components where the
     * property {@link Component.enabled} is true will be updated.
     * @param delta - The
     * [delta time](https://threejs.org/docs/#api/en/core/Clock) of the loop.
     */
    update(delta: number): Promise<void>;
    /**
     * Disposes all the MEMORY used by all the tools.
     */
    dispose(): Promise<void>;
    private _uuidv4Pattern;
    private validateUUID;
    getPlatformComponent<T extends Component<any>>(id: string): Promise<T>;
}
