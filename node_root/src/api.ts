import {hostIPAddress, ifcManager} from "./main.ts";
import {clearAndSetJSONEditor, displayError} from "./utils.ts";

export async function fetchAndDisplayNodeData(modelName: string, expressID: number) {
    const jsonContainer = document.getElementById("jsoneditor");
    if (!modelName || !jsonContainer) {
        displayError(jsonContainer, "No model found in scene");
        return;
    }

    try {
        const params = {
            nodes_collection: `${modelName.split(".")[0]}_nodes`,
            id: expressID.toString()
        };
        const queryString = new URLSearchParams(params).toString();

        const response = await fetch(`http://${hostIPAddress}:8432/api/find/node/id?${queryString}`);
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
        const params = {
            nodes_collection: `${modelName.split(".")[0]}_nodes`,
        };
        const queryString = new URLSearchParams(params).toString();

        const response = await fetch(`http://${hostIPAddress}:8432/api/find/all/nodes?${queryString}`);
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
        const params = {
            edges_collection: `${modelName.split(".")[0]}_edges`,
        };
        const queryString = new URLSearchParams(params).toString();

        const response = await fetch(`http://${hostIPAddress}:8432//api/find/all/edges?${queryString}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        clearAndSetJSONEditor(jsonContainer, data);
    } catch (error) {
        displayError(jsonContainer, "Please go back and start mapping procedure with file insert here");
    }
}

export async function fetchTraversal() {
    const modelName = ifcManager.groups[0].name;
    const jsonContainer = document.getElementById("jsoneditor");

    if (!modelName || !jsonContainer) {
        displayError(jsonContainer, "No model found in scene");
        return;
    }

    const nodeNameInput = (document.getElementById("node-name-input-id") as HTMLSelectElement).value;
    const minDepthInput = parseInt((document.getElementById("min-depth-input-id") as HTMLSelectElement).value);
    const maxDepthInput = parseInt((document.getElementById("max-depth-input-id") as HTMLSelectElement).value);
    const directionInput = (document.getElementById("direction-input-id") as HTMLSelectElement).value;

    if (nodeNameInput && minDepthInput && maxDepthInput && directionInput) {
        if (minDepthInput < 0 || maxDepthInput < 0) {
            alert("Please insert a positive number for depth");
        } else if (minDepthInput > maxDepthInput) {
            alert("Invalid numbers for depht, minimum depth should be less than max depth");
        }
        try {
            const params = {
                graph_name: `${modelName.split(".")[0]}_graph`,
                start_vertex_collection: `${modelName.split(".")[0]}_nodes`,
                start_vertex_key: nodeNameInput,
                direction: directionInput,
                min_depth: minDepthInput.toString(),
                max_depth: maxDepthInput.toString()
            };
            const queryString = new URLSearchParams(params).toString();

            const response = await fetch(`http://${hostIPAddress}:8432/api/traversal?${queryString}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            clearAndSetJSONEditor(jsonContainer, data);
        } catch (error) {
            displayError(jsonContainer, "Please go back and start mapping procedure with file insert here");
        }
    } else {
        alert("Please fill all the fields ;)");
    }
}

export async function fetchTraversalByName() {
    const modelName = ifcManager.groups[0].name;
    const jsonContainer = document.getElementById("jsoneditor");

    if (!modelName || !jsonContainer) {
        displayError(jsonContainer, "No model found in scene");
        return;
    }

    const nodeNameInput = (document.getElementById("node-name-input-type") as HTMLSelectElement).value;
    const minDepthInput = parseInt((document.getElementById("min-depth-input-type") as HTMLSelectElement).value);
    const maxDepthInput = parseInt((document.getElementById("max-depth-input-type") as HTMLSelectElement).value);
    const directionInput = (document.getElementById("direction-input-type") as HTMLSelectElement).value;

    if (nodeNameInput && minDepthInput && maxDepthInput && directionInput) {
        if (minDepthInput < 0 || maxDepthInput < 0) {
            alert("Please insert a positive number for depth");
        } else if (minDepthInput > maxDepthInput) {
            alert("Invalid numbers for depht, minimum depth should be less than max depth");
        }
        try {
            const params = {
                graph_name: `${modelName.split(".")[0]}_graph`,
                start_vertex_collection: `${modelName.split(".")[0]}_nodes`,
                vertex_type: nodeNameInput,
                direction: directionInput,
                min_depth: minDepthInput.toString(),
                max_depth: maxDepthInput.toString()
            };
            const queryString = new URLSearchParams(params).toString();

            const response = await fetch(`http://${hostIPAddress}:8432/api/traversal/name?${queryString}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            clearAndSetJSONEditor(jsonContainer, data);
        } catch (error) {
            displayError(jsonContainer, "Please go back and start mapping procedure with file insert here");
        }
    } else {
        alert("Please fill all the fields ;)");
    }
}