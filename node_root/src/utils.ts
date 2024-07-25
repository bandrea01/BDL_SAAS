// @ts-ignore
import * as JSONEditor from "jsoneditor";
import {ifcManager} from "./main.ts";
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
        createSensor(ifcManager.groups[0].name).then(() => {});
    };
    resetButton.onclick = resetInputFields;
}

export async function createSensor(modelName: string) {
    const jsonContainer = document.getElementById("jsoneditor");

    if (!modelName || !jsonContainer) {
        displayError(jsonContainer, "No model found in scene");
        return;
    }

    const sensorData = {
        name: (document.getElementById("sensor-name-input") as HTMLInputElement).value,
        type: (document.getElementById("sensor-type-input") as HTMLInputElement).value,
        value: (document.getElementById("sensor-value-input") as HTMLInputElement).value,
        nodeId: (document.getElementById("sensor-node-id-input") as HTMLInputElement).value,
    };

    try {
        const response = await fetch(`http://${window.location.hostname}:8432/add_sensor`, {
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
}

export function showTraversalFields() {
    const queryContainer = document.getElementById("query-container-id") as HTMLElement;
    const closeButton = document.getElementById("query-close-id") as HTMLElement;
    const confirmButton = document.getElementById("confirm-button-id") as HTMLElement;
    const resetButton = document.getElementById("reset-button-id") as HTMLElement;

    queryContainer.style.display = "block";

    closeButton.onclick = () => queryContainer.style.display = "none";
    confirmButton.onclick = () => {
        fetchTraversal().then(() => {});
        queryContainer.style.display = "none";
    };
    resetButton.onclick = resetInputFields;
}

export function showTraversalByTypeFields() {
    const queryContainer = document.getElementById("query-container-type") as HTMLElement;
    const closeButton = document.getElementById("query-close-type") as HTMLElement;
    const confirmButton = document.getElementById("confirm-button-type") as HTMLElement;
    const resetButton = document.getElementById("reset-button-type") as HTMLElement;

    queryContainer.style.display = "block";

    closeButton.onclick = () => queryContainer.style.display = "none";
    confirmButton.onclick = () => {
        fetchTraversalByName().then(() => {});
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
        container.appendChild(errorMessage);
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