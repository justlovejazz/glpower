import { Power } from '../Power';
import { Geometry } from './Geometry';
export declare class CubeGeometry extends Geometry {
    constructor(width?: number, height?: number, depth?: number, segmentsWidth?: number, segmentsHeight?: number, segmentsDepth?: number);
    getComponent(power: Power): {
        attributes: (Omit<import("..").AttributeBuffer, "count"> & {
            name: string;
        })[];
        index: import("..").AttributeBuffer;
    };
}
//# sourceMappingURL=CubeGeometry.d.ts.map