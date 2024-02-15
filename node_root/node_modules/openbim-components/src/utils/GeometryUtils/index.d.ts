import * as THREE from "three";
export declare function roundVector(vector: THREE.Vector3, factor?: number): void;
export declare function getIndices(index: THREE.TypedArray, i: number): number[];
export declare function getIndexAndPos(mesh: THREE.Mesh | THREE.InstancedMesh): {
    index: THREE.TypedArray;
    pos: THREE.TypedArray;
};
export declare function getVertices(mesh: THREE.Mesh | THREE.InstancedMesh, i: number, instance: number | undefined): {
    v1: THREE.Vector3;
    v2: THREE.Vector3;
    v3: THREE.Vector3;
};
export declare function getPlane(mesh: THREE.Mesh | THREE.InstancedMesh, i: number, instance?: number): {
    plane: THREE.Plane;
    v1: THREE.Vector3;
    v2: THREE.Vector3;
    v3: THREE.Vector3;
};
export declare function distanceFromPointToLine(point: THREE.Vector3, lineStart: THREE.Vector3, lineEnd: THREE.Vector3, clamp?: boolean): number;
export declare function getRaycastedFace(mesh: THREE.Mesh | THREE.InstancedMesh, faceIndex: number, instance?: number): {
    face: {
        indices: number[];
        ids: Set<string>;
    };
    distances: {
        [id: string]: number;
    };
    edges: {
        [id: string]: THREE.Vector3[];
    };
} | null;
