import * as WEBIFC from "web-ifc";
import * as THREE from "three";
export class Units {
    constructor() {
        this.factor = 1;
        this.complement = 1;
    }
    apply(matrix) {
        const scale = this.getScaleMatrix();
        const result = scale.multiply(matrix);
        matrix.copy(result);
    }
    setUp(webIfc) {
        var _a;
        this.factor = 1;
        const length = this.getLengthUnits(webIfc);
        if (!length) {
            return;
        }
        const isLengthNull = length === undefined || length === null;
        const isValueNull = length.Name === undefined || length.Name === null;
        if (isLengthNull || isValueNull) {
            return;
        }
        if (length.Name.value === "FOOT") {
            this.factor = 0.3048;
        }
        else if (((_a = length.Prefix) === null || _a === void 0 ? void 0 : _a.value) === "MILLI") {
            this.complement = 0.001;
        }
    }
    getLengthUnits(webIfc) {
        try {
            const allUnitsAssigns = webIfc.GetLineIDsWithType(0, WEBIFC.IFCUNITASSIGNMENT);
            const unitsAssign = allUnitsAssigns.get(0);
            const unitsAssignProps = webIfc.GetLine(0, unitsAssign);
            for (const units of unitsAssignProps.Units) {
                if (!units || units.value === null || units.value === undefined) {
                    continue;
                }
                const unitsProps = webIfc.GetLine(0, units.value);
                if (unitsProps.UnitType && unitsProps.UnitType.value === "LENGTHUNIT") {
                    return unitsProps;
                }
            }
            return null;
        }
        catch (e) {
            console.log("Could not get units");
            return null;
        }
    }
    getScaleMatrix() {
        const f = this.factor;
        // prettier-ignore
        return new THREE.Matrix4().fromArray([
            f, 0, 0, 0,
            0, f, 0, 0,
            0, 0, f, 0,
            0, 0, 0, 1,
        ]);
    }
}
//# sourceMappingURL=units.js.map