import * as THREE from "three";
import { Createable, Disposable, Event, UI, Component, UIElement } from "../../base-types";
import { Components, Simple2DMarker } from "../../core";
import { Button } from "../../ui";
export declare class VolumeMeasurement extends Component<void> implements Createable, UI, Disposable {
    static readonly uuid: "811da532-7af3-4635-b592-1c06ae494af5";
    uiElement: UIElement<{
        main: Button;
    }>;
    label: Simple2DMarker;
    private _enabled;
    readonly onBeforeCreate: Event<any>;
    readonly onAfterCreate: Event<any>;
    readonly onBeforeCancel: Event<any>;
    readonly onAfterCancel: Event<any>;
    readonly onBeforeDelete: Event<any>;
    readonly onAfterDelete: Event<any>;
    readonly onDisposed: Event<any>;
    set enabled(value: boolean);
    get enabled(): boolean;
    constructor(components: Components);
    dispose(): Promise<void>;
    private setUI;
    create: () => void;
    delete(): void;
    /** Deletes all the dimensions that have been previously created. */
    deleteAll(): Promise<void>;
    endCreation(): void;
    cancelCreation(): void;
    get(): void;
    getVolumeFromMeshes(meshes: THREE.InstancedMesh[]): number;
    private newLabel;
    private setupEvents;
    private onMouseMove;
    private onKeydown;
    private getVolumeOfMesh;
    private getSignedVolumeOfTriangle;
}
