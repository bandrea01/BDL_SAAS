import JSONEditor from "jsoneditor";
import {hostIPAddress, ifcManager} from "./main.ts";
import {fetchTraversal, fetchTraversalByName} from "./api.ts";

export function showSensorForm() {
    const sensorContainer = document.getElementById("sensor-form-container") as HTMLElement;
    const closeButton = document.getElementById("sensor-close-button") as HTMLElement;
    const confirmButton = document.getElementById("sensor-confirm-button") as HTMLElement;
    const resetButton = document.getElementById("sensor-reset-button") as HTMLElement;

    sensorContainer.style.display = "block";

    closeButton.onclick = () => sensorContainer.style.display = "none";
    confirmButton.onclick = () => {
        sensorContainer.style.display = "none";
        createSensor(ifcManager.groups[0].name).then(() => {
        });
    };
    resetButton.onclick = resetInputFields;
}

export async function createSensor(sceneModelName: string) {
    const jsonContainer = document.getElementById("jsoneditor");

    if (!sceneModelName || !jsonContainer) {
        displayError(jsonContainer, "No model found in scene");
        return;
    }

    const componentID = (document.getElementById("component-input") as HTMLSelectElement).value;
    const sensorType = (document.getElementById("sensor-type-input") as HTMLSelectElement).value;
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

    if (componentID && sensorType && brandName && manufacturerName && modelName && controlledProperty && coordinateX && coordinateY && coordinateZ) {
        const sensorData = {
            componentID: componentID,
            sensorType: sensorType,
            brandName: brandName,
            manufacturerName: manufacturerName,
            modelName: modelName,
            name: name,
            description: description,
            controlledProperty: controlledProperty,
            measurementType: measurementType,
            coordinateX: coordinateX,
            coordinateY: coordinateY,
            coordinateZ: coordinateZ,
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
            const data = await response.json();
            clearAndSetJSONEditor(jsonContainer, data);
        } catch (error) {
            displayError(jsonContainer, "Error adding sensor");
        }
    } else {
        alert("Please fill all the compulsory fields ;)");
    }

}

export function showTraversalFields() {
    const queryContainer = document.getElementById("query-container-id") as HTMLElement;
    const closeButton = document.getElementById("query-close-id") as HTMLElement;
    const confirmButton = document.getElementById("confirm-button-id") as HTMLElement;
    const resetButton = document.getElementById("reset-button-id") as HTMLElement;
    //const title = document.getElementById("title-label-id") as HTMLElement;
    //const subtitle = document.getElementById("subtitle-label-id") as HTMLElement;

    queryContainer.style.display = "block";

    /*let updateLabelText = (titleText: string, subtitleText: string) => {
        title.innerText = titleText;
        subtitle.innerText = subtitleText;
    }*/

    closeButton.onclick = () => queryContainer.style.display = "none";

    confirmButton.onclick = () => {
        fetchTraversal().then(() => {
        });
        queryContainer.style.display = "none";
    };

    resetButton.onclick = resetInputFields;
}

export function showTraversalByTypeFields() {
    const queryContainer = document.getElementById("query-container-type") as HTMLElement;
    const closeButton = document.getElementById("query-close-type") as HTMLElement;
    const confirmButton = document.getElementById("confirm-button-type") as HTMLElement;
    const resetButton = document.getElementById("reset-button-type") as HTMLElement;
    //const title = document.getElementById("title-label-id") as HTMLElement;
    //const subtitle = document.getElementById("subtitle-label-id") as HTMLElement;

    queryContainer.style.display = "block";

    /*let updateLabelText = (titleText: string, subtitleText: string) => {
        title.innerText = titleText;
        subtitle.innerText = subtitleText;
    }*/

    closeButton.onclick = () => queryContainer.style.display = "none";

    confirmButton.onclick = () => {
        fetchTraversalByName().then(() => {
        });
        queryContainer.style.display = "none";
    };

    resetButton.onclick = resetInputFields;
}

export function clearAndSetJSONEditor(container: HTMLElement, data: any) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    const editor = new JSONEditor(container);
    editor.set(data);
}

export function displayError(container: HTMLElement | null, message: string) {
    if (container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        const errorMessage = document.createElement("p");
        errorMessage.style.color = "red";
        errorMessage.innerText = message;

        const editor = new JSONEditor(container);
        editor.set(errorMessage);
    }
}

export function resetInputFields() {
    const inputs = document.querySelectorAll("input[type='text']");
    // @ts-ignore
    inputs.forEach(input => input.value = "");
}

export function redirectTo(url: string): void {
    window.location.href = url;
}