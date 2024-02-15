import { Component } from "./component";
import { Event } from "./base-types";
/**
 * A base component for other components whose main mission is to cast rays,
 * generally to pick objects with the mouse.
 */
export class BaseRaycaster extends Component {
    constructor() {
        super(...arguments);
        /** {@link Disposable.onDisposed} */
        this.onDisposed = new Event();
    }
}
//# sourceMappingURL=base-raycaster.js.map