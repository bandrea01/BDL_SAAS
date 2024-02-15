import * as THREE from "three";
import { FragmentMesh } from "bim-fragment";
export declare class EdgeProjector {
    params: {
        displayModel: string;
        displayEdges: boolean;
        displayProjection: boolean;
        useBVH: boolean;
        sortEdges: boolean;
        amount: number;
        color: number;
    };
    private _defaultMaterial;
    projectedEdges: THREE.LineSegments[];
    dispose(): void;
    disposeGeometry(): void;
    project(meshes: FragmentMesh[], height: number): Promise<THREE.LineSegments<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.LineBasicMaterial>>;
    updateEdges(params: any, mergedGeometry: THREE.BufferGeometry, projection: THREE.LineSegments): Generator<undefined, void, unknown>;
}
