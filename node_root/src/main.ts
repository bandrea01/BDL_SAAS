import * as OBC from "openbim-components";
import { configureViewer } from "./viewerConfig";
import { setupEventHandlers } from "./eventHandlers";
import {setupToolbar} from "./toolbar.ts";

export const hostIPAddress = window.location.hostname;
let viewer = new OBC.Components();

const viewerContainer = document.getElementById("webinar-sharepoint-viewer") as HTMLDivElement;

viewer = configureViewer(viewer, viewerContainer);

const ifcLoader = new OBC.FragmentIfcLoader(viewer);

//TODO: Provare la versione 0.0.57, per la configurazione attuale da problemi

ifcLoader.settings.wasm = {
    absolute: true,
    path: "https://unpkg.com/web-ifc@0.0.44/",
};

export const ifcManager = new OBC.FragmentManager(viewer);

// @ts-ignore
//ifcManager.uiElement.get("main").materialIcon = "delete";
// @ts-ignore
//ifcManager.uiElement.get("main").tooltip = "Remove models";

const highlighter = new OBC.FragmentHighlighter(viewer);

highlighter.setup().then(() => {});

const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer);

highlighter.events.select.onClear.add(() => {
    propertiesProcessor.cleanPropertiesList().then(() => {});
});

export const length = new OBC.LengthMeasurement(viewer);
length.enabled = true;
length.snapDistance = 1;

setupEventHandlers(viewer, ifcLoader, ifcManager, propertiesProcessor, highlighter);
viewer = setupToolbar(viewer, ifcLoader, propertiesProcessor, hostIPAddress);