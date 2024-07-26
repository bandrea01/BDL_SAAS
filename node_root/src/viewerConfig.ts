import * as OBC from "openbim-components";
import * as THREE from "three";

export function configureViewer(viewer: OBC.Components, viewerContainer: HTMLDivElement) {
    viewer.onInitialized.add(() => {});

    const sceneComponent = new OBC.SimpleScene(viewer);
    const rendererComponent = new OBC.PostproductionRenderer(viewer, viewerContainer);
    const postProduction = rendererComponent.postproduction;

    sceneComponent.setup();
    viewer.scene = sceneComponent;

    viewer.renderer = rendererComponent;

    viewer.camera = new OBC.OrthoPerspectiveCamera(viewer);

    viewer.raycaster = new OBC.SimpleRaycaster(viewer);

    viewer.init();

    const grid = new OBC.SimpleGrid(viewer, new THREE.Color(0x666666));

    postProduction.enabled = true;
    postProduction.customEffects.excludedMeshes.push(grid.get());

    return viewer;
}