import { Geometry } from './Geometry';
import { Vec3 } from '../math/Vec3';

export class CylinderGeometry extends Geometry {

	constructor( radiusTop: number = 0.5, radiusBottom: number = 0.5, height: number = 1, radSegments: number = 10, heightSegments: number = 1 ) {

		super();

		let posArray = [];
		let normalArray = [];
		let uvArray = [];
		let indexArray = [];

		//上下面分2回多くループ
		for ( let i = 0; i <= heightSegments + 2; i ++ ) {

			for ( let j = 0; j < radSegments; j ++ ) {

				let theta = Math.PI * 2.0 / radSegments * j;

				if ( i <= heightSegments ) {

					//side
					let w = i / heightSegments;
					let radius = ( 1.0 - w ) * radiusBottom + w * radiusTop;

					let x = Math.cos( theta ) * radius;
					let y = - ( height / 2 ) + ( height / heightSegments ) * i;
					let z = Math.sin( theta ) * radius;

					posArray.push( x, y, z );

					uvArray.push(
						j / radSegments,
						i / heightSegments
					);

					let normal = new Vec3( Math.cos( theta ), 0, Math.sin( theta ) ).normalize();

					normalArray.push(
						normal.x,
						normal.y,
						normal.z
					);

					if ( i < heightSegments ) {

						indexArray.push(
							i * radSegments + j,
							( i + 1 ) * radSegments + ( j + 1 ) % radSegments,
							i * radSegments + ( j + 1 ) % radSegments,

							i * radSegments + j,
							( i + 1 ) * radSegments + j,
							( i + 1 ) * radSegments + ( j + 1 ) % radSegments,

						);

					}

				} else {

					//bottom, top

					let side = i - heightSegments - 1;

					let radius = side ? radiusTop : radiusBottom;

					let x = Math.cos( theta ) * radius;
					let y = - ( height / 2 ) + height * ( side );
					let z = Math.sin( theta ) * radius;

					posArray.push( x, y, z );

					uvArray.push(
						( x + radius ) * 0.5 / radius,
						( z + radius ) * 0.5 / radius,
					);

					normalArray.push( 0, - 1 + side * 2, 0 );

					let offset = radSegments * ( heightSegments + ( side + 1 ) );

					if ( j <= radSegments - 2 ) {

						if ( side == 0 ) {

							indexArray.push(
								offset, offset + j, offset + j + 1,
							);

						} else {

							indexArray.push(
								offset, offset + j + 1, offset + j
							);

						}

					}

				}

			}

		}

		// let offset = radSegments * heightSegments;
		// for( let i = 2; i < radSegments; i++ ){

		// 	indexArray.push(
		// 		0, i, i - 1,
		// 		0 + offset, i + offset, i - 1 + offset,
		// 	);

		// }

		this.add( 'position', posArray, 3 );
		this.add( 'normal', normalArray, 3 );
		this.add( 'uv', uvArray, 2 );
		this.add( 'index', indexArray, 1 );

	}

}
