import { SimpleUIComponent } from "../ui";
/**
 * A simple object to handle UI components. You can use the generic constructor
 * to specify the types of your UI components.
 */
export declare class UIElement<T extends {
    [value: string]: SimpleUIComponent;
}> {
    private _data;
    private readonly initError;
    /**
     * Gets the UI Component with the given name. If it doesn't exist, it will
     * throw an error.
     *
     * @param name the identifier of the UI component.
     */
    get<U = SimpleUIComponent>(name: keyof T): U;
    /**
     * Sets all the UI components of this instance.
     *
     * @param data all the UI components sorted by name in an object.
     */
    set(data: T): void;
    /**
     * Release all the memory used by this instance deleting all the UI components
     * inside.
     */
    dispose(): Promise<void>;
}
