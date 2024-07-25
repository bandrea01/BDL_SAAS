import {hostIPAddress, ifcManager} from "./main.ts";
import {clearAndSetJSONEditor, displayError} from "./utils.ts";

export async function fetchAndDisplayNodeData(modelName: string, expressID: number) {
    const jsonContainer = document.getElementById("jsoneditor");
    if (!modelName || !jsonContainer) {
        displayError(jsonContainer, "No model found in scene");
        return;
    }

    try {
        const response = await fetch(`http://${hostIPAddress}:8432/get_node_by_id/${modelName.split(".")[0]}_nodes/${expressID}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        clearAndSetJSONEditor(jsonContainer, data);
    } catch (error) {
        displayError(jsonContainer, "Please go back and start mapping procedure with file insert here");
    }
}

export async function fetchAllNodes() {
    const modelName = ifcManager.groups[0].name;
    const jsonContainer = document.getElementById("jsoneditor");

    if (!modelName || !jsonContainer) {
        displayError(jsonContainer, "No model found in scene");
        return;
    }

    try {
        const response = await fetch(`http://${hostIPAddress}:8432/get_all_nodes/${modelName.split(".")[0]}_nodes`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        clearAndSetJSONEditor(jsonContainer, data);
    } catch (error) {
        displayError(jsonContainer, "Please go back and start mapping procedure with file insert here");
    }
}

export async function fetchAllEdges() {
    const modelName = ifcManager.groups[0].name;
    const jsonContainer = document.getElementById("jsoneditor");

    if (!modelName || !jsonContainer) {
        displayError(jsonContainer, "No model found in scene");
        return;
    }

    try {
        const response = await fetch(`http://${hostIPAddress}:8432/get_all_edges/${modelName.split(".")[0]}_edges`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        clearAndSetJSONEditor(jsonContainer, data);
    } catch (error) {
        displayError(jsonContainer, "Please go back and start mapping procedure with file insert here");
    }
}

export async function fetchTraversal() {
    const modelName = ifcManager.groups[0].name;
    const nodeIdInput = document.getElementById("query-node-id") as HTMLInputElement;
    const maxDepthInput = document.getElementById("query-max-depth") as HTMLInputElement;
    const jsonContainer = document.getElementById("jsoneditor");

    if (!modelName || !jsonContainer) {
        displayError(jsonContainer, "No model found in scene");
        return;
    }

    const nodeId = nodeIdInput.value;
    const maxDepth = maxDepthInput.value;

    try {
        const response = await fetch(`http://${hostIPAddress}:8432/traverse/${modelName.split(".")[0]}_nodes/${nodeId}/${maxDepth}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        clearAndSetJSONEditor(jsonContainer, data);
    } catch (error) {
        displayError(jsonContainer, "Please go back and start mapping procedure with file insert here");
    }
}

export async function fetchTraversalByName() {
    const modelName = ifcManager.groups[0].name;
    const nodeTypeInput = document.getElementById("query-node-type") as HTMLInputElement;
    const maxDepthInput = document.getElementById("query-max-depth-type") as HTMLInputElement;
    const jsonContainer = document.getElementById("jsoneditor");

    if (!modelName || !jsonContainer) {
        displayError(jsonContainer, "No model found in scene");
        return;
    }

    const nodeType = nodeTypeInput.value;
    const maxDepth = maxDepthInput.value;

    try {
        const response = await fetch(`http://${hostIPAddress}:8432/traverse_by_type/${modelName.split(".")[0]}_nodes/${nodeType}/${maxDepth}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        clearAndSetJSONEditor(jsonContainer, data);
    } catch (error) {
        displayError(jsonContainer, "Please go back and start mapping procedure with file insert here");
    }
}