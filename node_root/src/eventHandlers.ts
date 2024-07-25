import * as OBC from "openbim-components";
import {fetchAndDisplayNodeData} from "./api";
import {length} from "./main.ts";

export function setupEventHandlers(viewer: OBC.Components, ifcLoader: OBC.FragmentIfcLoader, ifcManager: OBC.FragmentManager, propertiesProcessor: OBC.IfcPropertiesProcessor, highlighter: OBC.FragmentHighlighter) {
    ifcLoader.onIfcLoaded.add(async (model: any) => {
        propertiesProcessor.process(model);
        await highlighter.clear();
        highlighter.events.select.onHighlight.add(async (selection: { [x: string]: any; }) => {
            const fragmentID = Object.keys(selection)[0];
            const expressID = Number([...selection[fragmentID]][0]);
            await propertiesProcessor.renderProperties(model, expressID);
            await fetchAndDisplayNodeData(ifcManager.groups[0].name, expressID);
        });
        await highlighter.update();
    });

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
            length.delete().then(() => {
            });
        }
    };

    window.addEventListener("mousedown", (event) => {
        if (event.button === 1) {
            length.create().then(() => {
            });
        }
    });
}