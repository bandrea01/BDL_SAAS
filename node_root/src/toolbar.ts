import * as OBC from "openbim-components";
import {
    redirectTo,
    showSensorForm,
    showTraversalByTypeFields,
    showTraversalFields
} from "./utils.ts";
import {fetchAllEdges, fetchAllNodes} from "./api.ts";

export function setupToolbar(viewer: OBC.Components, ifcLoader: OBC.FragmentIfcLoader, propertiesProcessor: OBC.IfcPropertiesProcessor, hostIPAddress: string) {
    const queryTool = new OBC.Button(viewer);

    const allNodesButton = new OBC.Button(viewer);
    const allEdgesButton = new OBC.Button(viewer);
    const traversalNodeButton = new OBC.Button(viewer);
    const nodesByTypeButton = new OBC.Button(viewer);

    queryTool.materialIcon = "search";
    queryTool.tooltip = "Query Tool";

    queryTool.addChild(allNodesButton);
    queryTool.addChild(allEdgesButton);
    queryTool.addChild(traversalNodeButton);
    queryTool.addChild(nodesByTypeButton);

    allNodesButton.label = "Show all nodes";
    allEdgesButton.label = "Show all edges";
    traversalNodeButton.label = "Show node details";
    nodesByTypeButton.label = "Show nodes by type";

    allNodesButton.onClick.add(() => fetchAllNodes());
    allEdgesButton.onClick.add(() => fetchAllEdges());
    traversalNodeButton.onClick.add(() => showTraversalFields());
    nodesByTypeButton.onClick.add(() => showTraversalByTypeFields());

    const addSensorButton = new OBC.Button(viewer);
    addSensorButton.materialIcon = "sensors";
    addSensorButton.tooltip = "Add sensor";
    addSensorButton.onClick.add(() => showSensorForm());

    const goBackButton = new OBC.Button(viewer);
    goBackButton.materialIcon = "exit_to_app";
    goBackButton.tooltip = "Go back";
    goBackButton.onClick.add(() => redirectTo(`http://${hostIPAddress}:8432/menu`));

    const refreshButton = new OBC.Button(viewer);
    refreshButton.materialIcon = "refresh";
    refreshButton.tooltip = "Reset model";
    refreshButton.onClick.add(() => window.location.reload());

    const mainToolbar = new OBC.Toolbar(viewer);

    mainToolbar.addChild(
        ifcLoader.uiElement.get("main"),
        refreshButton,
        propertiesProcessor.uiElement.get("main"),
        queryTool,
        addSensorButton,
        goBackButton
    );

    viewer.ui.addToolbar(mainToolbar);

    return viewer;
}