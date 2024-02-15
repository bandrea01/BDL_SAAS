import * as THREE from "three";
import { Button } from "../ButtonComponent";
import { SimpleUIComponent } from "../SimpleUIComponent";
export class CommandsMenu extends SimpleUIComponent {
    get hasCommands() {
        return Object.keys(this.commands).length !== 0;
    }
    constructor(components) {
        const template = `<div id="window" class="absolute bg-ifcjs-100 backdrop-blur-xl rounded-md p-3 z-50"></div>`;
        super(components, template);
        this.name = "CommandsMenu";
        this.offset = new THREE.Vector2(20, -10);
        this.commands = {};
        this.hideCommandsMenu = () => {
            this.visible = false;
        };
        this.innerElements = {
            window: this.getInnerElement("window"),
        };
        this.setupEvents(true);
    }
    update() {
        this.dispose(true);
        for (const name in this.commands) {
            const command = this.commands[name];
            const button = new Button(this._components, { name });
            button.name = name;
            this.addChild(button);
            button.onClick.add(() => command(this.commandData));
        }
    }
    popup(x, y) {
        this.domElement.style.left = `${x + this.offset.x}px`;
        this.domElement.style.top = `${y + this.offset.y}px`;
        this.visible = true;
    }
    async dispose(onlyChildren = false) {
        await super.dispose(onlyChildren);
        if (!onlyChildren) {
            this.setupEvents(false);
            this.commands = {};
            this.commandData = null;
        }
    }
    setupEvents(active) {
        if (active) {
            window.addEventListener("click", this.hideCommandsMenu);
        }
        else {
            window.removeEventListener("click", this.hideCommandsMenu);
        }
    }
}
//# sourceMappingURL=index.js.map