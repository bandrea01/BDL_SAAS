/**
 * A simple object to handle UI components. You can use the generic constructor
 * to specify the types of your UI components.
 */
export class UIElement {
    constructor() {
        this._data = null;
        this.initError = "UI Components not initialized.";
    }
    /**
     * Gets the UI Component with the given name. If it doesn't exist, it will
     * throw an error.
     *
     * @param name the identifier of the UI component.
     */
    get(name) {
        if (!this._data) {
            throw new Error(this.initError);
        }
        return this._data[name];
    }
    /**
     * Sets all the UI components of this instance.
     *
     * @param data all the UI components sorted by name in an object.
     */
    set(data) {
        this._data = data;
    }
    /**
     * Release all the memory used by this instance deleting all the UI components
     * inside.
     */
    async dispose() {
        if (!this._data)
            return;
        for (const name in this._data) {
            const uiComponent = this._data[name];
            await uiComponent.dispose();
        }
        this._data = null;
    }
}
//# sourceMappingURL=ui-element.js.map