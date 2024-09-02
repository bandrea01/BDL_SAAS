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
            alert("Invalid numbers for depth, minimum depth should be less than max depth");
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

export async function fetchNodeSensors() {
    const modelName = ifcManager.groups[0].name;
    const jsonContainer = document.getElementById("jsoneditor");

    if (!modelName || !jsonContainer) {
        displayError(jsonContainer, "No model found in scene");
        return;
    }

    const nodeNameInput = (document.getElementById("node-name-input-key-sensors") as HTMLSelectElement).value;
    const directionInput = (document.getElementById("direction-input-sensors") as HTMLSelectElement).value;

    if (nodeNameInput && directionInput) {
        try {
            const params = {
                graph_name: `${modelName.split(".")[0]}_graph`,
                start_vertex_collection: `${modelName.split(".")[0]}_nodes`,
                vertex_key: nodeNameInput,
                direction: directionInput
            };
            const queryString = new URLSearchParams(params).toString();

            const response = await fetch(`http://${hostIPAddress}:8432/api/node/find/sensors?${queryString}`);
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

export async function createSensor(sceneModelName: string) {
    const jsonContainer = document.getElementById("jsoneditor");

    if (!sceneModelName || !jsonContainer) {
        displayError(jsonContainer, "No model found in scene");
        return;
    }

    const componentID = (document.getElementById("component-input") as HTMLSelectElement).value;
    const brandName = (document.getElementById("brand-name-input") as HTMLSelectElement).value;
    const manufacturerName = (document.getElementById("manufacturer-name-input") as HTMLSelectElement).value;
    const modelName = (document.getElementById("model-name-input") as HTMLSelectElement).value;
    const name = (document.getElementById("name-input") as HTMLSelectElement).value;
    const description = (document.getElementById("description-input") as HTMLSelectElement).value;
    const controlledProperty = (document.getElementById("controlled-property-input") as HTMLSelectElement).value;
    const measurementType = (document.getElementById("measurement-type-input") as HTMLSelectElement).value;
    const coordinateX = parseFloat((document.getElementById("coordinate-x-input") as HTMLSelectElement).value);
    const coordinateY = parseFloat((document.getElementById("coordinate-y-input") as HTMLSelectElement).value);
    const coordinateZ = parseFloat((document.getElementById("coordinate-z-input") as HTMLSelectElement).value);

    if (componentID && brandName && manufacturerName && modelName && controlledProperty && coordinateX && coordinateY && coordinateZ) {
        if (isNaN(coordinateX) || isNaN(coordinateY) || isNaN(coordinateZ)) {
            alert("Please insert a number for coordinates");
        } else if (coordinateX < -90 || coordinateY < -180 || coordinateX > 90 || coordinateY > 180) {
            alert("Invalid coordinates, latitude should be between -90 and 90, longitude should be between -180 and 180");
        }

        const sensorData = {
            sceneModelName: sceneModelName,
            componentID: componentID,
            brandName: brandName,
            manufacturerName: manufacturerName,
            modelName: modelName,
            name: name,
            description: description,
            controlledProperty: controlledProperty,
            measurementType: measurementType,
            coordinateX: coordinateX,
            coordinateY: coordinateY,
            coordinateZ: coordinateZ
        };

        try {
            const response = await fetch(
                `http://${hostIPAddress}:8432/api/create/sensor`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(sensorData)
                });
            if (!response.ok) throw new Error('Network response was not ok');
            alert("Sensor successfully created!")
        } catch (error) {
            alert(error);
        }
    } else {
        alert("Please fill all the compulsory fields ;)");
    }
}

export async function exportIfcModel() {
    const modelName = ifcManager.groups[0].name;
    if (!modelName) {
        alert("No model found in scene");
        return;
    }

    try {
        const params = {
            model_name: `${modelName}`
        };
        const queryString = new URLSearchParams(params).toString();

        const response = await fetch(`http://${hostIPAddress}:8432/api/export/ifc?${queryString}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${modelName.split('.')[0]}_exported.ifc`;
        document.body.appendChild(a);
        a.click();

        a.remove();
        window.URL.revokeObjectURL(url);

        alert("IFC model successfully exported!");
    } catch (error) {
        alert(error);
    }
}
