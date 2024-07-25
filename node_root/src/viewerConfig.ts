import * as OBC from "openbim-components";
import * as THREE from "three";

export function configureViewer(viewer: OBC.Components, viewerContainer: HTMLDivElement) {
    const sceneComponent = new OBC.SimpleScene(viewer);
    sceneComponent.setup();
    viewer.scene = sceneComponent;

    const rendererComponent = new OBC.PostproductionRenderer(viewer, viewerContainer);
    viewer.renderer = rendererComponent;
    const postProduction = rendererComponent.postproduction;
    postProduction.enabled = true;

    viewer.camera = new OBC.OrthoPerspectiveCamera(viewer);

    viewer.raycaster = new OBC.SimpleRaycaster(viewer);

    const grid = new OBC.SimpleGrid(viewer, new THREE.Color(0x666666));
    postProduction.customEffects.excludedMeshes.push(grid.get());

    viewer.init();
}