/**
 * Components are the building blocks of this library. Everything is a
 * component: tools, scenes, objects, cameras, etc.
 * All components must inherit from this class. The `Type` parameter defines
 * the type of the core of this component. For instance, a component containing a
 */
export class Component {
    constructor(components) {
        this.components = components;
        /** Whether is component is {@link Disposable}. */
        this.isDisposeable = () => {
            return "dispose" in this;
        };
        /** Whether is component is {@link Resizeable}. */
        this.isResizeable = () => {
            return "resize" in this && "getSize" in this;
        };
        /** Whether is component is {@link Updateable}. */
        this.isUpdateable = () => {
            return ("onAfterUpdate" in this && "onBeforeUpdate" in this && "update" in this);
        };
        /** Whether is component is {@link Hideable}. */
        this.isHideable = () => {
            return "visible" in this;
        };
        /** Whether is component is {@link Configurable}. */
        this.isConfigurable = () => {
            return "setup" in this && "config" in this && "onSetup" in this;
        };
        /** Whether is component implements any kind of {@link UI}. */
        this.hasUI = () => {
            return "uiElement" in this;
        };
    }
}
//# sourceMappingURL=component.js.map