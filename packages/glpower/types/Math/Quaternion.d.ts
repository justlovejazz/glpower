import { IVector3, IVector4, Matrix, Types } from "..";
import { Vector } from "./Vector";
export declare type Quat = {
    x: number;
    y: number;
    z: number;
};
export declare type EulerOrder = 'XYZ' | 'XZY' | 'ZYX' | 'YZX';
export declare class Quaternion {
    x: number;
    y: number;
    z: number;
    w: number;
    constructor(x?: number, y?: number, z?: number, w?: number);
    set(x?: number, y?: number, z?: number, w?: number): void;
    setFromEuler(euler: Vector | IVector3, order?: EulerOrder): this;
    setFromMatrix(matrix: Matrix): this;
    multiply(q: Quaternion): this;
    inverse(): this;
    copy(a: Quaternion | Types.Nullable<IVector4>): this;
    clone(): Quaternion;
}
//# sourceMappingURL=Quaternion.d.ts.map