import { Component, Disposable, UI, UIElement, Event } from "../../base-types";
import { Button } from "../../ui";
import { Components } from "../../core";
export declare class FragmentExploder extends Component<Set<string>> implements Disposable, UI {
    static readonly uuid: "d260618b-ce88-4c7d-826c-6debb91de3e2";
    enabled: boolean;
    height: number;
    groupName: string;
    uiElement: UIElement<{
        main: Button;
    }>;
    /** {@link Disposable.onDisposed} */
    readonly onDisposed: Event<string>;
    private _explodedFragments;
    get(): Set<string>;
    constructor(components: Components);
    dispose(): Promise<void>;
    explode(): void;
    reset(): void;
    update(): void;
    private setupUI;
}
