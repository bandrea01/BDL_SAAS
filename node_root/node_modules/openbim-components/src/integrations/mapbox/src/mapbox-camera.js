import * as THREE from "three";
import { Component } from "../../../base-types";
/**
 * Minimal camera that can be used to create a BIM + GIS scene
 * with [Mapbox](https://www.mapbox.com/).
 * [See example](https://ifcjs.github.io/components/examples/mapbox.html).
 */
export class MapboxCamera extends Component {
    constructor() {
        super(...arguments);
        /** {@link Component.enabled} */
        this.enabled = true;
        this._camera = new THREE.PerspectiveCamera();
    }
    /** {@link Component.get} */
    get() {
        return this._camera;
    }
}
//# sourceMappingURL=mapbox-camera.js.map