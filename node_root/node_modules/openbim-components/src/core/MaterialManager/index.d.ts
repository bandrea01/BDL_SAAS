import * as THREE from "three";
import { Component, Disposable, Event } from "../../base-types";
import { Components } from "../Components";
/**
 * A tool to easily handle the materials of massive amounts of
 * objects and scene background easily.
 */
export declare class MaterialManager extends Component<string[]> implements Disposable {
    static readonly uuid: "24989d27-fa2f-4797-8b08-35918f74e502";
    /** {@link Component.enabled} */
    enabled: boolean;
    private _originalBackground;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    private _originals;
    private _list;
    constructor(components: Components);
    /**
     * {@link Component.get}.
     * @return list of created materials.
     */
    get(): string[];
    /**
     * Turns the specified material styles on or off.
     *
     * @param active whether to turn it on or off.
     * @param ids the ids of the style to turn on or off.
     */
    set(active: boolean, ids?: string[]): void;
    /** {@link Disposable.dispose} */
    dispose(): Promise<void>;
    /**
     * Sets the color of the background of the scene.
     *
     * @param color: the color to apply.
     */
    setBackgroundColor(color: THREE.Color): void;
    /**
     * Resets the scene background to the color that was being used
     * before applying the material manager.
     */
    resetBackgroundColor(): void;
    /**
     * Creates a new material style.
     * @param id the identifier of the style to create.
     * @param material the material of the style.
     */
    addMaterial(id: string, material: THREE.Material): void;
    /**
     * Assign meshes to a certain style.
     * @param id the identifier of the style.
     * @param meshes the meshes to assign to the style.
     */
    addMeshes(id: string, meshes: THREE.Mesh[]): void;
}
