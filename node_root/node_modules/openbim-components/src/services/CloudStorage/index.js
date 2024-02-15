import { unzip } from "unzipit";
import { Component, Event } from "../../base-types";
import { FragmentManager } from "../../fragments";
/**
 * An object to easily use the services of That Open Platform.
 */
export class CloudStorage extends Component {
    constructor(components) {
        super(components);
        this.tools = [];
        /** {@link Component.name} */
        this.name = "CloudProcessor";
        /** {@link Component.enabled} */
        this.enabled = true;
        this.modelProcessed = new Event();
        this.checkInterval = 5000;
        this._models = [];
        this._urls = {
            base: "https://dev.api.dev.platform.thatopen.com/v1/models/",
            tokenParam: "?accessToken=",
        };
        this.components.tools.add(CloudStorage.uuid, this);
    }
    /**
     * Retrieves a tool component by its name.
     */
    get() {
        return this._models;
    }
    /**
     * The authentication token generated in
     * [That Open Platform](https://platform.thatopen.com/app)
     */
    get token() {
        if (!this._token) {
            throw new Error("Auth token has not been initialized!");
        }
        return this._token;
    }
    /**
     * The authentication token generated in
     * [That Open Platform](https://platform.thatopen.com/app)
     */
    set token(value) {
        this._token = value;
    }
    async update() {
        const { base, tokenParam } = this._urls;
        const url = `${base}${tokenParam}${this.token}`;
        const result = await fetch(url);
        const parsed = await result.json();
        this._models = parsed.models;
    }
    async upload(fileUrl) {
        const response = await this.createModel();
        const uploadUrl = response.uploadUrl;
        const read = await fetch(fileUrl);
        const body = await read.arrayBuffer();
        await fetch(uploadUrl, { method: "PUT", body });
        this.setupModelProcessEvent(response.model._id);
    }
    async delete(modelID) {
        const { base, tokenParam } = this._urls;
        const url = `${base}/${modelID}${tokenParam}${this.token}`;
        const result = await fetch(url, { method: "DELETE" });
        return result.json();
    }
    async getModel(modelID) {
        const { base, tokenParam } = this._urls;
        const modelUrl = `${base}/${modelID}${tokenParam}${this.token}`;
        const modelResponse = await fetch(modelUrl);
        return modelResponse.json();
    }
    setupModelProcessEvent(modelID) {
        const interval = setInterval(async () => {
            const response = await this.getModel(modelID);
            if (response.model.status === "PROCESSED") {
                const { entries } = await unzip(response.downloadUrl);
                const arrayBuffer = await entries["model.frag"].arrayBuffer();
                const buffer = new Uint8Array(arrayBuffer);
                const fragments = await this.components.tools.get(FragmentManager);
                const model = await fragments.load(buffer);
                model.properties = await entries["properties.json"].json();
                await this.modelProcessed.trigger(model);
                clearInterval(interval);
            }
        }, this.checkInterval);
    }
    async createModel() {
        const { base, tokenParam } = this._urls;
        const url = `${base}${tokenParam}${this.token}`;
        const result = await fetch(url, { method: "POST" });
        return result.json();
    }
}
CloudStorage.uuid = "6fe6c739-d518-47b8-8057-a22a6c96e722";
//# sourceMappingURL=index.js.map