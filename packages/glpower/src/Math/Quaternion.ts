import { Vec3, Vector3 } from "./Vector3";

export type Quat = {
	x: number,
	y: number,
	z: number
}

export type EulerOrder = 'XYZ' | 'ZYX'

export class Quaternion {

	public x: number;
	public y: number;
	public z: number;
	public w: number;

	constructor() {

		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.w = 1;

	}

	public euler( euler: Vector3 | Vec3, order: EulerOrder = 'XYZ' ) {

		const sx = Math.sin( euler.x / 2 );
		const sy = Math.sin( euler.y / 2 );
		const sz = Math.sin( euler.z / 2 );

		const cx = Math.cos( euler.x / 2 );
		const cy = Math.cos( euler.y / 2 );
		const cz = Math.cos( euler.z / 2 );

		if ( order == 'XYZ' ) {

			this.x = sx * cy * cz + cx * sy * sz;
			this.y = cx * sy * cz - sx * cy * sz;
			this.z = cx * cy * sz + sx * sy * cz;
			this.w = cx * cy * cz - sx * sy * sz;

		} else if ( order == 'ZYX' ) {

			this.x = sx * cy * cz - cx * sy * sz;
			this.y = sx * cy * sz + cx * sy * cz;
			this.z = - sx * sy * cz + cx * cy * sz;
			this.w = sx * sy * sz + cx * cy * cz;

		}

		return this;

	}

	public multiply() {
	}

}
