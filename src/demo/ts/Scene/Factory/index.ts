import * as GLP from 'glpower';

import basicVert from './shaders/basic.vs';
import basicFrag from './shaders/basic.fs';
import { BLidgeObjectType, Entity } from 'glpower';

interface EmptyProps {
	position?: GLP.ComponentVector3;
	rotation?: GLP.ComponentVector3;
	scale?: GLP.ComponentVector3;
}

interface MeshProps extends EmptyProps{
	material: GLP.ComponentMaterial
	geometry: GLP.ComponentGeometry
}

interface CameraProps extends EmptyProps {
	perspectiveCamera?: GLP.ComponentPerspectiveCamera
}

interface BLidgeProps extends EmptyProps {
	name: string,
	type?: BLidgeObjectType
}

export class Factory {

	private power: GLP.Power;
	private ecs: GLP.ECS;
	private world: GLP.World;

	constructor( power: GLP.Power, ecs: GLP.ECS, world: GLP.World ) {

		this.power = power;
		this.ecs = ecs;
		this.world = world;

	}

	public empty( props: EmptyProps = {} ) {

		const entity = this.ecs.createEntity( this.world );
		this.ecs.addComponent<GLP.ComponentVector3>( this.world, entity, 'position', props.position ?? { x: 0, y: 0, z: 0 } );
		this.ecs.addComponent<GLP.ComponentVector3>( this.world, entity, 'rotation', props.rotation ?? { x: 0, y: 0, z: 0 } );
		this.ecs.addComponent<GLP.ComponentVector4>( this.world, entity, 'quaternion', { x: 0, y: 0, z: 0, w: 1 } );
		this.ecs.addComponent<GLP.ComponentVector3>( this.world, entity, 'scale', props.scale ?? { x: 1, y: 1, z: 1 } );
		this.ecs.addComponent<GLP.ComponentsTransformMatrix>( this.world, entity, 'matrix', { local: [], world: [] } );
		this.ecs.addComponent<GLP.ComponentSceneNode>( this.world, entity, 'sceneNode', { children: [] } );

		return entity;

	}

	public blidge( props: BLidgeProps ) {

		const entity = this.empty( props );

		this.ecs.addComponent<GLP.ComponentBLidge>( this.world, entity, 'blidge', { name: props.name, type: props.type ?? 'empty' } );

		return entity;

	}

	public appendMesh( entity: Entity, props: MeshProps ) {

		this.ecs.addComponent<GLP.ComponentMaterial>( this.world, entity, 'material', props.material );
		this.ecs.addComponent<GLP.ComponentGeometry>( this.world, entity, 'geometry', props.geometry );

		return entity;

	}

	public appendCube( entity: Entity ) {

		return this.appendMesh( entity, {
			material: {
				vertexShader: basicVert,
				fragmentShader: basicFrag,
				uniforms: {
					uColor: {
						value: new GLP.Vector3( 1.0, 0.0, 0.0 ),
						type: '3f'
					}
				}
			},
			geometry: new GLP.CubeGeometry().getComponent( this.power ),
		} );

	}

	public appendSphere( entity: Entity ) {

		return this.appendMesh( entity, {
			material: {
				vertexShader: basicVert,
				fragmentShader: basicFrag,
				uniforms: {
					uColor: {
						value: new GLP.Vector3( 1.0, 0.0, 0.0 ),
						type: '3f'
					}
				}
			},
			geometry: new GLP.SphereGeometry().getComponent( this.power ),
		} );

	}

	public appendPerspectiveCamera( entity: number, props: CameraProps = {} ) {

		this.ecs.addComponent<GLP.ComponentPerspectiveCamera>( this.world, entity, 'perspectiveCamera', props.perspectiveCamera ?? {
			near: 0.01,
			far: 1000,
			fov: 50,
			aspectRatio: window.innerWidth / window.innerHeight,
		} );

	}

}
