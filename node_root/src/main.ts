import * as OBC from "openbim-components";
import * as THREE from "three";

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
        const jsonContainer = document.getElementById("json-container");

        try {
            propertiesProcessor.renderProperties(model, expressID);

            const response1 = await fetch('http://localhost:8432/get_node_by_id/' + model.name.split(".")[0] + '_nodes/' + expressID);
            if (!response1.ok) {
                throw new Error('Network response was not ok');
            }
            const data1 = await response1.json();
            const key = data1[0]["_key"];

            const response2 = await fetch('http://localhost:8432/traversal/' + model.name.split(".")[0] + '_graph/' + model.name.split(".")[0] + '_nodes/' + key + '/any/1/2');
            if (!response2.ok) {
                throw new Error('Network response was not ok');
            }
            const data2 = await response2.json();

            if (jsonContainer && window.jQuery) {
                $(jsonContainer).JSONView(data2);
            }
        } catch (error) {
            if (jsonContainer && window.jQuery) {
                $(jsonContainer).JSONView({"error": error});
            }
        }
    });
    highlighter.update();
});

const length = new OBC.LengthMeasurement(viewer);
length.enabled = true;
length.snapDistance = 1;


const cubeTools = new OBC.Button(viewer);
cubeTools.materialIcon = "widgets";
cubeTools.tooltip = "Tools";

const allNodesButton = new OBC.Button(viewer);
const allEdgesButton = new OBC.Button(viewer);
const nodesByTypeButton = new OBC.Button(viewer);
allNodesButton.onClick.add(() => fetchAllNodes());
allEdgesButton.onClick.add(() => fetchAllEdges());


allNodesButton.label = "Mostra tutti i nodi";
allEdgesButton.label = "Mostra tutte le relazioni";
nodesByTypeButton.label = "Mostra nodi per tipo";

cubeTools.addChild(allNodesButton);
cubeTools.addChild(allEdgesButton);
cubeTools.addChild(nodesByTypeButton);


nodesByTypeButton.onClick.add(() => showQueryFields());

const mainToolbar = new OBC.Toolbar(viewer);
mainToolbar.addChild(
    ifcLoader.uiElement.get("main"),
    ifcManager.uiElement.get("main"),
    propertiesProcessor.uiElement.get("main"),
    cubeTools
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


let currentTooltip: HTMLElement | null = null;

//Aggiungo una funzionalità al modello caricato
ifcLoader.onIfcLoaded.add(async (model) => {
    //Aggiungo un listener al movimento del mouse
    const handleMouseMove = (event: MouseEvent) => {
        //Con il raycaster controllo se sto puntando un elemento
        const intersectedObject = viewer.raycaster.castRay();
        if (intersectedObject) {
            //Ottengo il fragmentID
            console.log(intersectedObject.object.id);
            const fragmentID = intersectedObject.object.uuid;
            //Con ifcManager accedo alla lista e prelevo l'expressID dalla lista
            // console.log(generateExpressIDFragmentIDMap(model.items));
            const expressID = parseInt(ifcManager.list[fragmentID].items[0]);
            // console.log(expressID);

            // console.log("Express: ", ifcManager.list[fragmentID].items[0]);

            //Se il modello caricato ha delle proprietà accedo per rappresentarle col tooltip
            if (model.properties && model.properties[expressID]) {
                //Accedo al nome dell'oggetto puntato con properties su model e prendo il nome del costruttore
                const label = model.properties[expressID].constructor.name;
                const tooltipText = `${label}`;

                //Se c'è già un tooltip lo elimino
                if (currentTooltip) {
                    removeTooltip(currentTooltip);
                }
                //Creo un altro tooltip
                currentTooltip = createTooltip(tooltipText, event.clientX + 10, event.clientY + 10);
                //Nel momento in cui effettuo un nuovo spostamento col mouse elimino il tooltip e ripeto il tutto
                intersectedObject.object.addEventListener('mouseleave', () => {
                    if (currentTooltip) {
                        removeTooltip(currentTooltip);
                        currentTooltip = null;
                    }
                });
            }
            //Elimino eventuali tooltip nel caso in cui non punto nulla
        } else {
            if (currentTooltip) {
                removeTooltip(currentTooltip);
                currentTooltip = null;
            }
        }
    };

    window.addEventListener('mousemove', handleMouseMove);
});

window.addEventListener("mousedown", function (event) {
    // Verifica se il pulsante cliccato è il pulsante della rotellina del mouse
    if (event.button === 1) { // Il pulsante della rotellina del mouse ha il codice 1
        // Attiva la misurazione
        length.create();
        // generateTable(jsonData);
    }
});

function createTooltip(text: string, x: number, y: number) {
    const tooltipElement = document.createElement('div');
    tooltipElement.classList.add('tooltip');
    tooltipElement.textContent = text;
    tooltipElement.style.position = 'absolute';
    tooltipElement.style.left = `${x}px`;
    tooltipElement.style.top = `${y}px`;
    document.body.appendChild(tooltipElement);
    return tooltipElement;
}

function removeTooltip(tooltipElement: HTMLElement) {
    if (tooltipElement && tooltipElement.parentElement) {
        tooltipElement.parentElement.removeChild(tooltipElement);
    }
}

function showQueryFields() {
    const queryContainer = document.getElementById("query-container") as HTMLElement;
    const closeButton = document.getElementById("query-close") as HTMLElement;
    const confirmButton = document.getElementById("confirm-button") as HTMLElement;
    const resetButton = document.getElementById("reset-button") as HTMLElement;

    queryContainer.style.display = "block";

    closeButton.onclick = function () {
        queryContainer.style.display = "none";
    };
    confirmButton.onclick = function() {
        fetchTraversalByName();
        queryContainer.style.display = "none";
    }
    resetButton.onclick = function() {
        const inputFields = document.querySelectorAll('input');
        const selectField = document.querySelector('select[name="direction"]');
        inputFields.forEach((input) => {
            input.value = '';
        });
        selectField.value = 'Any';
    }
}

function fetchTraversalByName(){

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
                        console.log(ifcManager.list);
                        return response.json();
                    })
                    .then(data => {
                        // Seleziona l'elemento che conterrà il JSON
                        const jsonContainer = document.getElementById("json-container");

                        // Controlla se l'elemento è stato trovato e se jQuery è disponibile
                        // @ts-ignore
                        if (jsonContainer && window.jQuery) {
                            // Visualizza il JSON utilizzando JSONView
                            // @ts-ignore
                            $(jsonContainer).JSONView(data);
                        }
                        // console.log(data);
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                    });
            } else {
                const jsonContainer = document.getElementById("json-container");
                // Controlla se l'elemento è stato trovato e se jQuery è disponibile
                // @ts-ignore
                if (jsonContainer && window.jQuery) {
                    // Visualizza il JSON utilizzando JSONView
                    // @ts-ignore
                    $(jsonContainer).JSONView("No model loaded");
                }
            }
        } catch (error) {
            const jsonContainer = document.getElementById("json-container");
            // Controlla se l'elemento è stato trovato e se jQuery è disponibile
            // @ts-ignore
            if (jsonContainer && window.jQuery) {
                // Visualizza il JSON utilizzando JSONView
                // @ts-ignore
                $(jsonContainer).JSONView({"Error": "No model loaded"});
            }
        }
    } else {
        alert("Please fill all the fields ;)");
    }

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
                    console.log(ifcManager.list);
                    return response.json();
                })
                .then(data => {
                    // Seleziona l'elemento che conterrà il JSON
                    const jsonContainer = document.getElementById("json-container");

                    // Controlla se l'elemento è stato trovato e se jQuery è disponibile
                    // @ts-ignore
                    if (jsonContainer && window.jQuery) {
                        // Visualizza il JSON utilizzando JSONView
                        // @ts-ignore
                        $(jsonContainer).JSONView(data);
                    }
                    // console.log(data);
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        } else {
            const jsonContainer = document.getElementById("json-container");
            // Controlla se l'elemento è stato trovato e se jQuery è disponibile
            // @ts-ignore
            if (jsonContainer && window.jQuery) {
                // Visualizza il JSON utilizzando JSONView
                // @ts-ignore
                $(jsonContainer).JSONView("No model loaded");
            }
        }
    } catch (error) {
        const jsonContainer = document.getElementById("json-container");
        // Controlla se l'elemento è stato trovato e se jQuery è disponibile
        // @ts-ignore
        if (jsonContainer && window.jQuery) {
            // Visualizza il JSON utilizzando JSONView
            // @ts-ignore
            $(jsonContainer).JSONView({"Error": "No model loaded"});
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
                    console.log(ifcManager.list);
                    return response.json();
                })
                .then(data => {
                    // Seleziona l'elemento che conterrà il JSON
                    const jsonContainer = document.getElementById("json-container");

                    // Controlla se l'elemento è stato trovato e se jQuery è disponibile
                    // @ts-ignore
                    if (jsonContainer && window.jQuery) {
                        // Visualizza il JSON utilizzando JSONView
                        // @ts-ignore
                        $(jsonContainer).JSONView(data);
                    }
                    // console.log(data);
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        } else {
            const jsonContainer = document.getElementById("json-container");
            // Controlla se l'elemento è stato trovato e se jQuery è disponibile
            // @ts-ignore
            if (jsonContainer && window.jQuery) {
                // Visualizza il JSON utilizzando JSONView
                // @ts-ignore
                $(jsonContainer).JSONView("No model loaded");
            }
        }
    } catch (error) {
        const jsonContainer = document.getElementById("json-container");
        // Controlla se l'elemento è stato trovato e se jQuery è disponibile
        // @ts-ignore
        if (jsonContainer && window.jQuery) {
            // Visualizza il JSON utilizzando JSONView
            // @ts-ignore
            $(jsonContainer).JSONView({"Error": "No model loaded"});
        }
    }
}
