import * as OBC from "openbim-components";
import * as THREE from "three";
import * as JSONEditor from 'jsoneditor';


const viewer = new OBC.Components();
viewer.onInitialized.add(() => {
});

const sceneComponent = new OBC.SimpleScene(viewer);
sceneComponent.setup();
viewer.scene = sceneComponent;

const viewerContainer = document.getElementById(
    "webinar-sharepoint-viewer"
) as HTMLDivElement;
const rendererComponent = new OBC.PostproductionRenderer(
    viewer,
    viewerContainer
);
viewer.renderer = rendererComponent;
const postproduction = rendererComponent.postproduction;

const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer);
viewer.camera = cameraComponent;

const raycasterComponent = new OBC.SimpleRaycaster(viewer);
viewer.raycaster = raycasterComponent;

viewer.init();
postproduction.enabled = true;

const grid = new OBC.SimpleGrid(viewer, new THREE.Color(0x666666));
postproduction.customEffects.excludedMeshes.push(grid.get());

const ifcLoader = new OBC.FragmentIfcLoader(viewer);

ifcLoader.settings.wasm = {
    absolute: true,
    path: "https://unpkg.com/web-ifc@0.0.44/",
};

const ifcManager = new OBC.FragmentManager(viewer);
ifcManager.uiElement.get("main").materialIcon = "delete";
ifcManager.uiElement.get("main").tooltip = "Remove models";


const highlighter = new OBC.FragmentHighlighter(viewer);
highlighter.setup();

const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer);
highlighter.events.select.onClear.add(() => {
    propertiesProcessor.cleanPropertiesList();
});


ifcLoader.onIfcLoaded.add(async (model) => {
    propertiesProcessor.process(model);
    highlighter.events.select.onHighlight.add(async (selection) => {
        const fragmentID = Object.keys(selection)[0];
        const expressID = Number([...selection[fragmentID]][0]);
        // const jsonContainer = document.getElementById("json-container");

        try {
            const modelName = ifcManager.groups[0].name;
            if (modelName) {
                fetch('http://localhost:8432/get_node_by_id/' + modelName.split(".")[0] + '_nodes/' + expressID)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        const jsonContainer = document.getElementById("jsoneditor");
                        if (jsonContainer) {
                            while (jsonContainer.firstChild) {
                                jsonContainer.removeChild(jsonContainer.firstChild);
                            }
                            const options = {};
                            const editor = new JSONEditor(jsonContainer, options);
                            editor.set(data);
                        }
                    })
                    .catch(error => {
                        const jsonContainer = document.getElementById("jsoneditor");
                        if (jsonContainer) {
                            while (jsonContainer.firstChild) {
                                jsonContainer.removeChild(jsonContainer.firstChild);
                            }
                            const options = {};
                            const editor = new JSONEditor(jsonContainer, options);
                            editor.set({"error": error});
                        }
                    });
            } else {
                const jsonContainer = document.getElementById("jsoneditor");
                if (jsonContainer) {
                    while (jsonContainer.firstChild) {
                        jsonContainer.removeChild(jsonContainer.firstChild);
                    }
                    const options = {};
                    const editor = new JSONEditor(jsonContainer, options);
                    editor.set({"Error": "No model loaded"});
                }
            }
        } catch (error) {
            const jsonContainer = document.getElementById("jsoneditor");
            if (jsonContainer) {
                while (jsonContainer.firstChild) {
                    jsonContainer.removeChild(jsonContainer.firstChild);
                }
                const options = {};
                const editor = new JSONEditor(jsonContainer, options);
                editor.set({"error": error});
            }
        }
        highlighter.update();
    });
});


const length = new OBC.LengthMeasurement(viewer);
length.enabled = true;
length.snapDistance = 1;


const queryTool = new OBC.Button(viewer);
queryTool.materialIcon = "search";
queryTool.tooltip = "Query Tool";

const allNodesButton = new OBC.Button(viewer);
const allEdgesButton = new OBC.Button(viewer);
const traversalNodeButton = new OBC.Button(viewer);
const nodesByTypeButton = new OBC.Button(viewer);

allNodesButton.onClick.add(() => fetchAllNodes());
allEdgesButton.onClick.add(() => fetchAllEdges());

allNodesButton.label = "Mostra tutti i nodi";
allEdgesButton.label = "Mostra tutte le relazioni";
traversalNodeButton.label = "Mostra dettagli nodo";
nodesByTypeButton.label = "Mostra nodi per tipo";

queryTool.addChild(allNodesButton);
queryTool.addChild(allEdgesButton);
queryTool.addChild(traversalNodeButton);
queryTool.addChild(nodesByTypeButton);
traversalNodeButton.onClick.add(() => showTraversalFields());
nodesByTypeButton.onClick.add(() => showTraversalByTypeFields());

const mainToolbar = new OBC.Toolbar(viewer);
mainToolbar.addChild(
    ifcLoader.uiElement.get("main"),
    ifcManager.uiElement.get("main"),
    propertiesProcessor.uiElement.get("main"),
    queryTool
);
viewer.ui.addToolbar(mainToolbar);

window.addEventListener("thatOpen", async (event: any) => {
    const {name, payload} = event.detail;
    if (name === "openModel") {
        const {name, buffer} = payload;
        const model = await ifcLoader.load(buffer, name);
        const scene = viewer.scene.get();
        scene.add(model);
    }
});

window.onkeydown = (event) => {
    if (event.code === "Delete" || event.code === "Backspace") {
        length.delete();
    }
};

window.addEventListener("mousedown", function (event) {
    // Verifica se il pulsante cliccato è il pulsante della rotellina del mouse
    if (event.button === 1) { // Il pulsante della rotellina del mouse ha il codice 1
        // Attiva la misurazione
        length.create();
        // generateTable(jsonData);
    }
});

function showTraversalFields() {
    const queryContainer = document.getElementById("query-container") as HTMLElement;
    const closeButton = document.getElementById("query-close") as HTMLElement;
    const confirmButton = document.getElementById("confirm-button") as HTMLElement;
    const resetButton = document.getElementById("reset-button") as HTMLElement;
    const title = document.getElementById("title-label") as HTMLElement;
    const subtitle = document.getElementById("subtitle-label") as HTMLElement;

    queryContainer.style.display = "block";

    function updateLabelText(titleText: string, subtitleText: string) {
        title.innerText = titleText;
        subtitle.innerText = subtitleText;
    }

    closeButton.onclick = function () {
        queryContainer.style.display = "none";
    };
    confirmButton.onclick = function () {
        fetchTraversal();
        queryContainer.style.display = "none";
    }
    resetButton.onclick = function () {
        const inputFields = document.querySelectorAll('input');
        const selectField = document.querySelector('select[name="direction"]');
        inputFields.forEach((input) => {
            input.value = '';
        });
        selectField.value = 'Any';
    }
    updateLabelText("Show node details", "Node key");
}

function showTraversalByTypeFields() {
    const queryContainer = document.getElementById("query-container") as HTMLElement;
    const closeButton = document.getElementById("query-close") as HTMLElement;
    const confirmButton = document.getElementById("confirm-button") as HTMLElement;
    const resetButton = document.getElementById("reset-button") as HTMLElement;
    const title = document.getElementById("title-label") as HTMLElement;
    const subtitle = document.getElementById("subtitle-label") as HTMLElement;

    queryContainer.style.display = "block";

    function updateLabelText(titleText: string, subtitleText: string) {
        title.innerText = titleText;
        subtitle.innerText = subtitleText;
    }

    closeButton.onclick = function () {
        queryContainer.style.display = "none";
    };
    confirmButton.onclick = function () {
        fetchTraversalByName();
        queryContainer.style.display = "none";
    }
    resetButton.onclick = function () {
        const inputFields = document.querySelectorAll('input');
        const selectField = document.querySelector('select[name="direction"]');
        inputFields.forEach((input) => {
            input.value = '';
        });
        selectField.value = 'Any';
    }
    updateLabelText("Show nodes by type", "Node type");
}

function fetchAllNodes() {
    try {
        const modelName = ifcManager.groups[0].name;
        if (modelName) {
            fetch('http://localhost:8432/get_all_nodes/' + modelName.split(".")[0] + '_nodes')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    const jsonContainer = document.getElementById("jsoneditor");
                    if (jsonContainer) {
                        while (jsonContainer.firstChild) {
                            jsonContainer.removeChild(jsonContainer.firstChild);
                        }
                        const options = {};
                        const editor = new JSONEditor(jsonContainer, options);
                        editor.set(data);
                    }
                })
                .catch(error => {
                    const jsonContainer = document.getElementById("jsoneditor");
                    if (jsonContainer) {
                        while (jsonContainer.firstChild) {
                            jsonContainer.removeChild(jsonContainer.firstChild);
                        }
                        const options = {};
                        const editor = new JSONEditor(jsonContainer, options);
                        editor.set({"error": error});
                    }
                });
        } else {
            const jsonContainer = document.getElementById("jsoneditor");
            if (jsonContainer) {
                while (jsonContainer.firstChild) {
                    jsonContainer.removeChild(jsonContainer.firstChild);
                }
                const options = {};
                const editor = new JSONEditor(jsonContainer, options);
                editor.set({"Error": "No model loaded"});
            }
        }
    } catch (error) {
        const jsonContainer = document.getElementById("jsoneditor");
        if (jsonContainer) {
            while (jsonContainer.firstChild) {
                jsonContainer.removeChild(jsonContainer.firstChild);
            }
            const options = {};
            const editor = new JSONEditor(jsonContainer, options);
            editor.set({"Error": error});
        }
    }
}

function fetchAllEdges() {
    try {
        const modelName = ifcManager.groups[0].name;
        if (modelName) {
            fetch('http://localhost:8432/get_all_edges/' + modelName.split(".")[0] + '_edges')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    const jsonContainer = document.getElementById("jsoneditor");
                    if (jsonContainer) {
                        while (jsonContainer.firstChild) {
                            jsonContainer.removeChild(jsonContainer.firstChild);
                        }
                        const options = {};
                        const editor = new JSONEditor(jsonContainer, options);
                        editor.set(data);
                    }
                })
                .catch(error => {
                    const jsonContainer = document.getElementById("jsoneditor");
                    if (jsonContainer) {
                        while (jsonContainer.firstChild) {
                            jsonContainer.removeChild(jsonContainer.firstChild);
                        }
                        const options = {};
                        const editor = new JSONEditor(jsonContainer, options);
                        editor.set({"error": error});
                    }
                });
        } else {
            const jsonContainer = document.getElementById("jsoneditor");
            if (jsonContainer) {
                while (jsonContainer.firstChild) {
                    jsonContainer.removeChild(jsonContainer.firstChild);
                }
                const options = {};
                const editor = new JSONEditor(jsonContainer, options);
                editor.set({"error": "No model loaded"});
            }
        }
    } catch (error) {
        const jsonContainer = document.getElementById("jsoneditor");
        if (jsonContainer) {
            while (jsonContainer.firstChild) {
                jsonContainer.removeChild(jsonContainer.firstChild);
            }
            const options = {};
            const editor = new JSONEditor(jsonContainer, options);
            editor.set({"error": error});
        }
    }
}

function fetchTraversal() {
    const nodeNameInput = (document.getElementById("node-name-input") as HTMLSelectElement).value;
    const minDepthInput = (document.getElementById("min-depth-input") as HTMLSelectElement).value;
    const maxDepthInput = (document.getElementById("max-depth-input") as HTMLSelectElement).value;
    const directionInput = (document.getElementById("direction-input") as HTMLSelectElement).value;

    if (nodeNameInput && minDepthInput && maxDepthInput && directionInput) {
        if (minDepthInput < 0 || maxDepthInput < 0) {
            alert("Please insert a positive number for depth");
        } else if (minDepthInput > maxDepthInput) {
            alert("Invalid numbers for depht, minimum depth should be less than max depth");
        }
        try {
            const modelName = ifcManager.groups[0].name;
            if (modelName) {
                fetch('http://localhost:8432/traversal/' + modelName.split(".")[0] + '_graph/' + modelName.split(".")[0] + '_nodes/' + nodeNameInput + '/' + directionInput + '/' + minDepthInput + '/' + maxDepthInput)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        const jsonContainer = document.getElementById("jsoneditor");
                        if (jsonContainer) {
                            while (jsonContainer.firstChild) {
                                jsonContainer.removeChild(jsonContainer.firstChild);
                            }
                            const options = {};
                            const editor = new JSONEditor(jsonContainer, options);
                            editor.set(data);
                        }
                    })
                    .catch(error => {
                        const jsonContainer = document.getElementById("jsoneditor");
                        if (jsonContainer) {
                            while (jsonContainer.firstChild) {
                                jsonContainer.removeChild(jsonContainer.firstChild);
                            }
                            const options = {};
                            const editor = new JSONEditor(jsonContainer, options);
                            editor.set({"error": error});
                        }
                    });
            } else {
                const jsonContainer = document.getElementById("jsoneditor");
                if (jsonContainer) {
                    while (jsonContainer.firstChild) {
                        jsonContainer.removeChild(jsonContainer.firstChild);
                    }
                    const options = {};
                    const editor = new JSONEditor(jsonContainer, options);
                    editor.set({"error": "No model loaded"});
                }
            }
        } catch (error) {
            const jsonContainer = document.getElementById("jsoneditor");
            if (jsonContainer) {
                while (jsonContainer.firstChild) {
                    jsonContainer.removeChild(jsonContainer.firstChild);
                }
                const options = {};
                const editor = new JSONEditor(jsonContainer, options);
                editor.set({"error": error});
            }
        }
    } else {
        alert("Please fill all the fields ;)");
    }
}

function fetchTraversalByName() {
    const nodeNameInput = (document.getElementById("node-name-input") as HTMLSelectElement).value;
    const minDepthInput = (document.getElementById("min-depth-input") as HTMLSelectElement).value;
    const maxDepthInput = (document.getElementById("max-depth-input") as HTMLSelectElement).value;
    const directionInput = (document.getElementById("direction-input") as HTMLSelectElement).value;

    if (nodeNameInput && minDepthInput && maxDepthInput && directionInput) {
        if (minDepthInput < 0 || maxDepthInput < 0) {
            alert("Please insert a positive number for depth");
        } else if (minDepthInput > maxDepthInput) {
            alert("Invalid numbers for depht, minimum depth should be less than max depth");
        }
        try {
            const modelName = ifcManager.groups[0].name;
            if (modelName) {
                fetch('http://localhost:8432/traversal_by_name/' + modelName.split(".")[0] + '_graph/' + modelName.split(".")[0] + '_nodes/' + nodeNameInput + '/' + directionInput + '/' + minDepthInput + '/' + maxDepthInput)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        const jsonContainer = document.getElementById("jsoneditor");
                        if (jsonContainer) {
                            while (jsonContainer.firstChild) {
                                jsonContainer.removeChild(jsonContainer.firstChild);
                            }
                            const options = {};
                            const editor = new JSONEditor(jsonContainer, options);
                            editor.set(data);
                        }
                    })
                    .catch(error => {
                        const jsonContainer = document.getElementById("jsoneditor");
                        if (jsonContainer) {
                            while (jsonContainer.firstChild) {
                                jsonContainer.removeChild(jsonContainer.firstChild);
                            }
                            const options = {};
                            const editor = new JSONEditor(jsonContainer, options);
                            editor.set({"error": error});
                        }
                    });
            } else {
                const jsonContainer = document.getElementById("jsoneditor");
                if (jsonContainer) {
                    while (jsonContainer.firstChild) {
                        jsonContainer.removeChild(jsonContainer.firstChild);
                    }
                    const options = {};
                    const editor = new JSONEditor(jsonContainer, options);
                    editor.set({"error": "No model loaded"});
                }
            }
        } catch (error) {
            const jsonContainer = document.getElementById("jsoneditor");
            if (jsonContainer) {
                while (jsonContainer.firstChild) {
                    jsonContainer.removeChild(jsonContainer.firstChild);
                }
                const options = {};
                const editor = new JSONEditor(jsonContainer, options);
                editor.set({"error": error});
            }
        }
    } else {
        alert("Please fill all the fields ;)");
    }
}