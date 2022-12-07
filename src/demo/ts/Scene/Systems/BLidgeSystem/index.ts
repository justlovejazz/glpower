import * as GLP from 'glpower';
import { Factory } from '../../Factory';

export class BLidgeSystem extends GLP.System {

	public power: GLP.Power;
	public ecs: GLP.ECS;
	public world: GLP.World;
	public factory: Factory;
	public sceneGraph: GLP.SceneGraph;
	public blidge: GLP.BLidge;

	public onCreateCamera?: ( entity: GLP.Entity ) => void;

	private root: GLP.Entity;
	private objects: Map<string, GLP.Entity>;

	// tmp
	private tmpQuaternion: GLP.Quaternion;

	constructor( power: GLP.Power, ecs: GLP.ECS, world: GLP.World ) {

		super( {
			move: [ 'position', 'rotation', 'scale' ]
		} );

		this.power = power;
		this.ecs = ecs;
		this.world = world;

		this.factory = new Factory( this.power, this.ecs, this.world );

		this.root = this.factory.empty( {} );

		// scenegraph

		this.sceneGraph = new GLP.SceneGraph( this.ecs, this.world );

		// objects

		this.objects = new Map();

		// blidge

		this.blidge = new GLP.BLidge( 'ws://localhost:3100' );

		this.blidge.addListener( 'sync/scene', this.onSyncScene.bind( this ) );

		// tmp

		this.tmpQuaternion = new GLP.Quaternion();

	}

	protected updateImpl( logicName: string, entity: number, event: GLP.SystemUpdateEvent ): void {

		const blidgeComponent = this.ecs.getComponent<GLP.ComponentBLidge>( event.world, entity, 'blidge' );
		const positionComponent = this.ecs.getComponent<GLP.ComponentVector3>( event.world, entity, 'position' );
		const rotationComponent = this.ecs.getComponent<GLP.ComponentVector4>( event.world, entity, 'quaternion' );

		if ( blidgeComponent && blidgeComponent.actions ) {

			for ( let i = 0; i < blidgeComponent.actions.length; i ++ ) {

				const action = blidgeComponent.actions[ i ];

				if ( positionComponent ) {

					action.getValue( action.name + '_location', positionComponent );

				}

				if ( rotationComponent ) {

					const rot = action.getValue<GLP.Vector3>( action.name + '_rotation_euler' );

					if ( rot ) {

						// this.tmpQuaternion.euler( rot, 'YZX' );
						this.tmpQuaternion.euler( { x: rot.x - Math.PI / 2, y: rot.y, z: rot.z }, 'YZX' ); //カメラが下向くねん

						rotationComponent.x = this.tmpQuaternion.x;
						rotationComponent.y = this.tmpQuaternion.y;
						rotationComponent.z = this.tmpQuaternion.z;
						rotationComponent.w = this.tmpQuaternion.w;

					}

				}

			}

		}

	}

	private onSyncScene( blidge: GLP.BLidge ) {

		const timeStamp = new Date().getTime();

		// create entity

		blidge.objects.forEach( obj => {

			let entity = this.objects.get( obj.name );

			const type = obj.type;

			if ( entity === undefined ) {

				entity = this.factory.blidge( { name: obj.name, type: 'empty' } );

				this.objects.set( obj.name, entity );

			}

			const blidgeComponent = this.ecs.getComponent<GLP.ComponentBLidge>( this.world, entity, 'blidge' );

			if ( blidgeComponent ) {

				blidgeComponent.updateTime = timeStamp;

			}

			if ( blidgeComponent && blidgeComponent.type != type ) {

				// entity type

				this.ecs.removeComponent( this.world, entity, 'geometry' );
				this.ecs.removeComponent( this.world, entity, 'material' );
				this.ecs.removeComponent( this.world, entity, 'perspectiveCamera' );

				if ( type == 'cube' ) {

					this.factory.appendCube( entity );

				} else if ( type == 'sphere' ) {

					this.factory.appendSphere( entity );

				} else if ( type == 'camera' && obj.camera ) {

					this.factory.appendPerspectiveCamera( entity, {
						perspectiveCamera: {
							fov: obj.camera.fov,
							near: 0.01,
							far: 1000,
							aspectRatio: window.innerWidth / window.innerHeight
						}
					} );

					if ( this.onCreateCamera ) this.onCreateCamera( entity );

				}

				// actions

				blidgeComponent.actions = [];

				for ( let i = 0; i < obj.actions.length; i ++ ) {

					const action = this.blidge.actions.find( action => action.name == obj.actions[ i ] );

					if ( action ) {

						blidgeComponent.actions.push( action );

					}

				}


			}

			// transform

			const position = this.ecs.getComponent<GLP.ComponentVector3>( this.world, entity, 'position' );

			if ( position ) {

				position.x = obj.position.x;
				position.y = obj.position.y;
				position.z = obj.position.z;

			}

			const quaternion = this.ecs.getComponent<GLP.ComponentVector4>( this.world, entity, 'quaternion' );

			if ( quaternion ) {

				const rot = {
					x: obj.rotation.x,
					y: obj.rotation.y,
					z: obj.rotation.z,
				};

				if ( type == 'camera' ) {

					rot.x -= Math.PI / 2;

				}

				const q = new GLP.Quaternion().euler( rot, 'YZX' );

				quaternion.x = q.x;
				quaternion.y = q.y;
				quaternion.z = q.z;
				quaternion.w = q.w;

			}

			const scale = this.ecs.getComponent<GLP.ComponentVector3>( this.world, entity, 'scale' );

			if ( scale ) {

				scale.x = obj.scale.x;
				scale.y = obj.scale.y;
				scale.z = obj.scale.z;

			}

		} );

		// remove

		this.ecs.getEntities( this.world, [ 'blidge' ] ).forEach( entity => {

			const blidgeComponent = this.ecs.getComponent<GLP.ComponentBLidge>( this.world, entity, 'blidge' );

			if ( blidgeComponent && blidgeComponent.updateTime !== timeStamp ) {

				this.objects.delete( blidgeComponent.name );

				this.ecs.removeEntity( this.world, entity );

			}

		} );

		// scene graph

		blidge.objects.forEach( obj => {

			const entity = this.objects.get( obj.name );
			const parentEntity = this.objects.get( obj.parent );

			if ( entity === undefined ) return;

			this.sceneGraph.add( parentEntity ?? this.root, entity );

		} );

	}


}
