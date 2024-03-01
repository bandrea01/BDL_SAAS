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
    highlighter.events.select.onHighlight.add((selection) => {
        const fragmentID = Object.keys(selection)[0];
        console.log(fragmentID)
        const expressID = Number([...selection[fragmentID]][0]);
        console.log(expressID);
        propertiesProcessor.renderProperties(model, expressID);

        fetch('http://localhost:8432/get_node_by_id/' + model.name.split(".")[0] + '_nodes/' + expressID)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log(response);
                return response.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });
    highlighter.update();
});

const length = new OBC.LengthMeasurement(viewer);
length.enabled = true;
length.snapDistance = 1;

const mainToolbar = new OBC.Toolbar(viewer);
mainToolbar.addChild(
    ifcLoader.uiElement.get("main"),
    ifcManager.uiElement.get("main"),
    propertiesProcessor.uiElement.get("main"),
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
            const fragmentID = intersectedObject.object.uuid;
            //Con ifcManager accedo alla lista e prelevo l'expressID dalla lista
            const expressID = parseInt(ifcManager.list[fragmentID].items[0]);

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

// Funzione per generare dinamicamente la tabella HTML
function generateTable(jsonData: any[]) {
    const tableContainer = document.getElementById('table-container');
    if (tableContainer) {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Creazione della riga dell'intestazione (thead)
        const headerRow = document.createElement('tr');
        for (const key in jsonData[0]) {
            const th = document.createElement('th');
            th.textContent = key;
            headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);

        // Creazione delle righe dei dati (tbody)
        jsonData.forEach(item => {
            const row = document.createElement('tr');
            for (const key in item) {
                const cell = document.createElement('td');
                cell.textContent = item[key];
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        tableContainer.appendChild(table);
    }
}
//
// // Funzione per creare e popolare la tabella con i dati JSON
// function renderJSONTable(jsonData: any[]) {
//     const tableContainer = document.querySelector('.json-viewer');
//     if (tableContainer) {
//         const table = document.createElement('table');
//         const headerRow = table.insertRow();
//         for (const key in jsonData[0]) {
//             const th = document.createElement('th');
//             th.textContent = key;
//             headerRow.appendChild(th);
//         }
//         jsonData.forEach(item => {
//             const row = table.insertRow();
//             for (const key in item) {
//                 const cell = row.insertCell();
//                 cell.textContent = item[key];
//             }
//         });
//         tableContainer.appendChild(table);
//     }
// }