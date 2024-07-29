import JSONEditor from "jsoneditor";
import {ifcManager} from "./main.ts";
import {createSensor, fetchNodeSensors, fetchTraversal, fetchTraversalByName} from "./api.ts";

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

export function showNodeSensorForm() {
    const sensorContainer = document.getElementById("query-container-sensors") as HTMLElement;
    const closeButton = document.getElementById("query-close-sensors") as HTMLElement;
    const confirmButton = document.getElementById("confirm-button-sensors") as HTMLElement;
    const resetButton = document.getElementById("reset-button-sensors") as HTMLElement;

    sensorContainer.style.display = "block";

    closeButton.onclick = () => sensorContainer.style.display = "none";
    confirmButton.onclick = () => {
        sensorContainer.style.display = "none";
        fetchNodeSensors().then(() => {
        });
    };
    resetButton.onclick = resetInputFields;
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