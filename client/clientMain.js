
// import GameClient from './GameClient'
import * as THREE from 'three/build/three.module.js'
// import { PointerLockControls } from './PointerLockControls.js';
// import { FlyControls } from './FlyControls.js';
import { OBB } from 'three/examples/jsm/math/OBB.js'

import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig'
import TestCommand from '../common/command/TestCommand'
import PlayerInput from '../common/command/PlayerInput'
import SpaceControl from '../common/command/SpaceControl'


import {
    Euler,
    EventDispatcher,
    Vector3
} from 'three/build/three.module.js';


// window.onload = function() {

// class Player extends Container {
//     constructor() {
//         super()

//         this.addChild(circle)
//         const geometry = new THREE.BoxGeometry( 2, 2, 2 );
//         const material = new THREE.MeshBasicMaterial( {color: 0x00ffff} );
//         cube = new THREE.Mesh(geometry,material);
//         scene.add(cube);
//     }
// }







var PointerLockControls = function ( camera, domElement ) {

    if ( domElement === undefined ) {

        console.warn( 'THREE.PointerLockControls: The second parameter "domElement" is now mandatory.' );
        domElement = document.body;

    }

    this.domElement = domElement;
    this.isLocked = false;

    // Set to constrain the pitch of the camera
    // Range is 0 to Math.PI radians
    this.minPolarAngle = 0; // radians
    this.maxPolarAngle = Math.PI; // radians

    //
    // internals
    //

    var scope = this;

    var changeEvent = { type: 'change' };
    var lockEvent = { type: 'lock' };
    var unlockEvent = { type: 'unlock' };

    var euler = new Euler( 0, 0, 0, 'YXZ' );

    var PI_2 = Math.PI / 2;

    var vec = new Vector3();

    function onMouseMove( event ) {


        if ( scope.isLocked === false ) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;



        euler.setFromQuaternion( camera.quaternion );
        // (movementX + ", " + movementY)
        if(space === false) {
            euler.y -= movementX * 0.002;
            euler.x -= movementY * 0.002;
            euler.x = Math.max( PI_2 - scope.maxPolarAngle, Math.min( PI_2 - scope.minPolarAngle, euler.x ) );

            camera.quaternion.setFromEuler( euler );

            scope.dispatchEvent( changeEvent );
        }
        

        

        //modified to be space movement
        if(space === true){
            camera.rotateY(-movementX * 0.002);
            camera.rotateX(-movementY * 0.002);
        }

    }

    function onPointerlockChange() {

        if ( scope.domElement.ownerDocument.pointerLockElement === scope.domElement ) {

            scope.dispatchEvent( lockEvent );

            scope.isLocked = true;

        } else {

            scope.dispatchEvent( unlockEvent );

            scope.isLocked = false;

        }

    }

    function onPointerlockError() {

        console.error( 'THREE.PointerLockControls: Unable to use Pointer Lock API' );

    }

    this.connect = function () {

        scope.domElement.ownerDocument.addEventListener( 'mousemove', onMouseMove );
        scope.domElement.ownerDocument.addEventListener( 'pointerlockchange', onPointerlockChange );
        scope.domElement.ownerDocument.addEventListener( 'pointerlockerror', onPointerlockError );

    };

    this.disconnect = function () {

        scope.domElement.ownerDocument.removeEventListener( 'mousemove', onMouseMove );
        scope.domElement.ownerDocument.removeEventListener( 'pointerlockchange', onPointerlockChange );
        scope.domElement.ownerDocument.removeEventListener( 'pointerlockerror', onPointerlockError );

    };

    this.dispose = function () {

        this.disconnect();

    };

    this.getObject = function () { // retaining this method for backward compatibility

        return camera;

    };

    this.getDirection = function () {

        var direction = new Vector3( 0, 0, - 1 );

        return function ( v ) {

            return v.copy( direction ).applyQuaternion( camera.quaternion );

        };

    }();

    this.moveForward = function ( distance ) {

        // move forward parallel to the xz-plane
        // assumes camera.up is y-up

        vec.setFromMatrixColumn( camera.matrix, 0 );

        vec.crossVectors( camera.up, vec );

        camera.position.addScaledVector( vec, distance );

    };

    this.moveRight = function ( distance ) {

        vec.setFromMatrixColumn( camera.matrix, 0 );

        camera.position.addScaledVector( vec, distance );

    };

    this.lock = function () {

        this.domElement.requestPointerLock();

    };

    this.unlock = function () {

        scope.domElement.ownerDocument.exitPointerLock();

    };

    this.connect();

};

PointerLockControls.prototype = Object.create( EventDispatcher.prototype );
PointerLockControls.prototype.constructor = PointerLockControls;









class GameClient {
    constructor() {
        this.client = new nengi.Client(nengiConfig, 100) 

        this.client.onConnect(res => {
            console.log('onConnect response:', res)
        })

        this.client.onClose(() => {
            console.log('connection closed')
        })

        this.client.connect('ws://localhost:8079')       
    }

    update(delta, tick, now) {
        // input
        const network = this.client.readNetwork()

        network.entities.forEach(snapshot => {
            snapshot.createEntities.forEach(entity => {
                console.log('create a new entity', entity.protocol.name)

                if(entity.protocol.name === "PlayerCharacter"){
	                const threeCube = new THREE.Mesh(
	                    new THREE.BoxGeometry(2,2,2),
	                    
	                    new THREE.MeshBasicMaterial( {color: 0x00ffff} )

	                )
	                const { nid, x, y, z, rotationX, rotationY, rotationZ } = entity
	                threeCube.nid = entity.nid // may as well add this
	                

                
                	threeCube.position.x = x
	                threeCube.position.y = y
	                threeCube.position.z = z

	               
	                threeCube.rotation.x = rotationX
	                threeCube.rotation.y = rotationY
	                threeCube.rotation.z = rotationZ
                    if(threeCube.nid != gameState.myId ){
                       scene.add(threeCube)
                       
                    } 
                    
                    entities.set(nid, threeCube)
	                
	            }

	            if(entity.protocol.name === "Ship"){
	            		                const threeCube = new THREE.Mesh(
	                    new THREE.BoxGeometry(entity.obb.halfSize.x * 2, entity.obb.halfSize.y*2, entity.obb.halfSize.z*2),
	                    
	                    new THREE.MeshBasicMaterial( {color: 0xff00ff} )

	                )
	                const { nid, x, y, z, rotationX, rotationY, rotationZ } = entity
	                threeCube.nid = entity.nid // may as well add this
	                threeCube.position.x = x
	                threeCube.position.y = y
	                threeCube.position.z = z

	               
	                threeCube.rotation.x = rotationX
	                threeCube.rotation.y = rotationY
	                threeCube.rotation.z = rotationZ
                    threeCube.obb = new OBB(threeCube.position, entity.obb.halfSize);
                    threeCube.updateMatrix()
                    threeCube.updateMatrixWorld()
                    threeCube.obb.applyMatrix4(threeCube.matrix)
                    scene.add(threeCube)
                    ships.set(nid, threeCube)
                    
                    entities.set(nid, threeCube)
	            }

                if(entity.protocol.name === "Bullet"){
                	const threeBullet = new THREE.Mesh(
	                	
	                   	new THREE.SphereGeometry(1, 16, 16),
						new THREE.MeshBasicMaterial ({color: 0xff11ff})


	                )
                	const { nid, x, y, z, rotationX, rotationY, rotationZ } = entity
	                threeBullet.position.x = x
	                threeBullet.position.y = y
	                threeBullet.position.z = z

	                threeBullet.name = "bullet"

	               
	                threeBullet.rotation.x = rotationX
	                threeBullet.rotation.y = rotationY
	                threeBullet.rotation.z = rotationZ
	                scene.add(threeBullet)


	                entities.set(nid, threeBullet)
                }
                

            })
    
            snapshot.updateEntities.forEach(update => {
                // console.log('update something about an existing entity', update)
                const entity = entities.get(update.nid) // note this is threeCube now
                // console.log(entity)
                // console.log(updat)
                if (update.nid === gameState.myId){
                    scene.remove(entities.get(gameState.myId))
                    
                    
                    // const size = new THREE.Vector3( 0.5, 0.5, 0.5 );
                    // console.log(entities.get(gameState.myId))
                    // gameState.myHitBox.set(entities.get(gameState.myId).position, size)
                    // entities.get(gameState.myId).updateMatrix()
                    // entities.get(gameState.myId).updateMatrixWorld()
                    // console.log(entities.get(gameState.myId))
                    // gameState.myHitBox.applyMatrix4(entities.get(gameState.myId).matrixWorld)
                    
                    return
                }

                if (update.prop === 'x') {
                    entity.position.x = update.value
                    // if (update.nid === gameState.myId){
                    //     camera.position.x = update.value
                    // }

                }
                if (update.prop === 'y') {
                    entity.position.y = update.value
                    // if (update.nid === gameState.myId){
                    //     camera.position.y = update.value
                    // }

                }
                if (update.prop === 'z') {
                	// console.log(entity)
                    entity.position.z = update.value
                    // if (update.nid === gameState.myId){
                    //     camera.position.z = update.value
                    // }
                }
                if (update.prop === 'rotationX') {
                    entity.rotation.x = update.value
                }
                if (update.prop === 'rotationY') {
                    entity.rotation.y = update.value
                }
                if (update.prop === 'rotationZ') {
                    entity.rotation.z = update.value
                }

                
                if( entity.name != undefined && entity.name === 'Ship'){

                    entity.obb.set(entity.obj.position, entity.obb.halfSize);
                    entity.obj.updateMatrix()
                    entity.obj.updateMatrixWorld()
                    entity.obb.applyMatrix4(entity.obj.matrix)
                }

 
            })
    
            snapshot.deleteEntities.forEach(id => {
                console.log('delete an entity', id)
                const entity = entities.get(id)
                // remove me from three.js
                scene.remove(entity)
                // remove me from entities
                entities.delete(id)
                
                
            })
        })

        // network.predictionErrors.forEach(predictionErrorFrame => {
        //     // a prediction was incorrect, time to reconcile it
        //     console.log('prediction error frame', predictionErrorFrame)
        //     predictionErrorFrame.entities.forEach(predictionErrorEntity => {
        //         // get our clientside entity
                

        //         // revert its relevant state to the state from the prediction frame
                
        //         const serverEntity = entities.get(gameState.myId)
        //         camera.position.x = serverEntity.obj.position.x
        //         camera.position.y = serverEntity.obj.position.y
        //         camera.position.z = serverEntity.obj.position.z
        //         move(camera, command)


        //         // entity.velocity.x = predictionErrorEntity.proxy.velocity.x
        //         // entity.velocity.y = predictionErrorEntity.proxy.velocity.y
        //         // entity.velocity.z = predictionErrorEntity.proxy.velocity.z


        //         // correct any prediction errors with server values...
                

        //         // and then re-apply any commands issued since the frame that had the prediction error
        //         // const commandSets = network.getUnconfirmedCommands()
        //         // commandSets.forEach((commandSet, clientTick) => {
        //         //     commandSet.forEach(command => {
        //         //         if (command.protocol.name === 'PlayerInput') {
        //         //         const predictCamera = camera

        //         //         move(camera, command)
        //         //         const globalPosition = new THREE.Vector3();
        //         //         predictCamera.getWorldPosition(globalPosition)

                        

        //         //         const prediction = {
        //         //             nid: gameState.myId,
        //         //             // x: globalPosition.x,
        //         //             // y: globalPosition.y,
        //         //             // z: globalPosition.z,
        //         //             localPositionX: predictCamera.position.x,
        //         //             localPositionY: predictCamera.position.y,
        //         //             localPositionZ: predictCamera.position.z,
        //         //         }
                        
        //         //         gameClient.client.addCustomPrediction(gameClient.client.tick, prediction, ['localPositionX', 'localPositionX', 'localPositionX'])
        //         //         }
        //         //     })
        //         // })
        //     })
        // })

        network.messages.forEach(message => {
            if(message.protocol.name === "NetLog"){
                console.log("NetLog: " + message.text)
            } 
            // else{
            // console.log('message', message)
            // }
            if(message.protocol.name === "Identity"){
                gameState.myId = message.entityId
            } 
            if(message.protocol.name === "Death"){
                camera.position.x = message.x;
                camera.position.y = message.y;
                camera.position.z = message.z;
            } 
        })

        network.localMessages.forEach(localMessage => {
            console.log('local message', localMessage)
        })

        // output
        // the only client-side game logic is to randomly send a test command
        // if (Math.random() > 0.95) {
        //     this.client.addCommand(new TestCommand('hi this is a command from the client'))
        // }
        this.client.update()
    }
}



    const gameClient = new GameClient()
    let scene, camera, renderer, controls, cube, canvas, floor;
    const entities = new Map()
    const ships = new Map()
    let raycaster;
    let prevTime = performance.now();
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let moveUp = false;
    let moveDown = false;
    let shoot = false;
    let rollLeft = false;
    let rollRight = false;

    let rotateUp = false;
    let rotateDown = false;
    let rotateRight = false;
    let rotateLeft = false;


    let space = true
const gameState = {
    myId: null,
    myEntity: null,
    onShip: undefined,
    myHitBox: new OBB(),
    myHalfSize: new THREE.Vector3( 1, 1, 1 ),
    player: {
        obb : new OBB(),

        //use camera instead of obj
        obj : new THREE.Object3D(),
    }

}

gameState.player.obb.halfSize = new THREE.Vector3(2, 2, 2)

    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const vertex = new THREE.Vector3();
    const color = new THREE.Color();

    init()
    animate()

    // let tick = 0
    // let previous = performance.now()
    // const loop = function() {
    //     window.requestAnimationFrame(loop)
    //     const now = performance.now()
    //     const delta = (now - previous) / 1000
    //     previous = now
    //     tick++

    //     gameClient.update(delta, tick, now)
    // }

    // loop()
// }







function init(){
     scene = new THREE.Scene();

     camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth/window.innerHeight, 
        0.1, 
        1000
    );

    // camera.x = 0
    // camera.y = 0
    // camera.z = 0
    camera.velocity = new THREE.Vector3();
    camera.direction = new THREE.Vector3();
    camera.moveForward = false;
    camera.moveBackward = false;
    camera.moveLeft = false;
    camera.moveRight = false;
    camera.moveUp = false;
    camera.moveDown = false;
    // camera.rotationX = 0;
    // camera.rotationY = 0;
    // camera.rotationZ = 0;

    controls = new PointerLockControls( camera, document.body );
    // console.log(controls)

    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );

    instructions.addEventListener( 'click', function () {

                    controls.lock();
                    // instructions.style.display = 'none';
                    // blocker.style.display = 'none';
                    // document.body.requestPointerLock();
                } );

    controls.addEventListener( 'lock', function () {

        instructions.style.display = 'none';
        blocker.style.display = 'none';

    } );

    controls.addEventListener( 'unlock', function () {

        blocker.style.display = 'block';
        instructions.style.display = '';

    } );

    scene.add(controls.getObject())
    const onMouseDown = function ( event ){
        shoot = true
        
    }

    const onMouseUp = function ( event ){
        shoot = false
        

    }

    const onKeyDown = function ( event ) {
                
                switch ( event.code ) {

                    case 'ArrowUp':
                        rotateUp = true;
                        break;
                    case 'KeyW':
                        moveForward = true;
                        break;

                    case 'ArrowLeft':
                        rotateLeft = true;
                        break;
                    case 'KeyA':
                        moveLeft = true;
                        break;

                    case 'ArrowDown':
                        rotateDown = true;
                        break;
                    case 'KeyS':
                        moveBackward = true;
                        break;

                    case 'ArrowRight':
                        rotateRight = true;
                        break;
                    case 'KeyD':
                        moveRight = true;
                        break;
                    case 'KeyQ':
                        rollLeft = true;
                        break;

                    case 'KeyE':
                        rollRight = true;
                        break;

                    case 'Space':
                        moveUp = true;
                        break;

                    case 'ShiftLeft':
                        moveDown = true;
                        
                        break;
                    case 'KeyL':
                    	console.log("KeyL pressed")
                    	if(space === true){
                    		space = false
                    		const command = new SpaceControl(space)

	            			gameClient.client.addCommand(command)
	                        exitSpace()
	                        
                    	}

                    	
                        break;
                    

                }


            };

            const onKeyUp = function ( event ) {

                switch ( event.code ) {

                    case 'ArrowUp':
                        rotateUp = false;
                        break;
                    case 'KeyW':
                        moveForward = false;
                        break;

                    case 'ArrowLeft':
                        rotateLeft = false;
                        break;
                    case 'KeyA':
                        moveLeft = false;
                        break;

                    case 'ArrowDown':
                        rotateDown = false;
                        break;
                    case 'KeyS':
                        moveBackward = false;
                        break;

                    case 'ArrowRight':
                        rotateRight = false;
                        break;
                    case 'KeyD':
                        moveRight = false;
                        break;

                    case 'KeyQ':
                        rollLeft = false;
                        break;

                    case 'KeyE':
                        rollRight = false;
                        break;

                    case 'Space':
                        moveUp = false;
                        break;
                        
                    case 'ShiftLeft':
                        moveDown = false;
                        break;

                }

            };

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    document.addEventListener( 'keydown', onKeyDown );
    document.addEventListener( 'keyup', onKeyUp );
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)


    renderer = new THREE.WebGLRenderer({antialias:true, canvas:canvas});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    

    const geometry = new THREE.BoxGeometry( 2, 2, 2 );
    const material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
    cube = new THREE.Mesh(geometry,material);
    scene.add(cube);

    const geometry2 = new THREE.BoxGeometry( 20, 2, 20 );
    floor = new THREE.Mesh(geometry2,material);
    floor.position.y = -10
    scene.add(floor)
    // floor.add(camera)

    // floor.position.y = -10;
    // floor.add(camera)

    


    // camera.position.z = 5;
    // camera.position.y = 10;



    // controls = new PointerLockControls( camera, document.body );

    window.addEventListener('resize', onWindowResize, false)
}

function animate(){
    requestAnimationFrame(animate);

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    // console.log(camera.quaternion)

    // camera.quaternion.x += 0.001 //rotates up
    // camera.quaternion.y += 0.001 //rotates left
    // camera.quaternion.z += 0.001 //rolls left
    // camera.quaternion.w += 0.001 //rotates up and left


    camera.quaternion.normalize()
    const time = performance.now();

    const delta = ( time - prevTime ) / 1000;

    gameClient.update(delta)


        // if ( controls.isLocked === true ) {

            // console.log(camera.rotation.x)
            const movement = new THREE.Object3D()

            

            movement.rotation.x = camera.rotation.x
            movement.rotation.y = camera.rotation.y
            movement.rotation.z = camera.rotation.z

            if(space === true){
                camera.direction.z = (Number( moveForward ) - Number( moveBackward )) * delta;
                camera.direction.x = (Number( moveRight ) - Number( moveLeft )) * delta;
                camera.direction.y = (Number( moveUp ) - Number(moveDown)) * delta;
                camera.direction.normalize(); // this ensures consistent movements in all directions
                movement.translateX(camera.direction.x * 40 * delta)
                movement.translateY(camera.direction.y * 40 * delta)
                movement.translateZ(-camera.direction.z * 40 * delta)

                camera.position.x += movement.position.x
                camera.position.y += movement.position.y
                camera.position.z += movement.position.z

                
            } else {
                velocity.y -= 0.5 * 100.0 * delta;

                controls.moveForward((Number( moveForward ) - Number( moveBackward )) * delta * 40);
                controls.moveRight((Number( moveRight ) - Number( moveLeft )) * delta * 40);
                camera.updateMatrix();
                camera.updateMatrixWorld();
                gameState.player.obb.center = camera.position



                // gameState.player.obb.applyMatrix4(camera.matrixWorld)


                let landed = false
                ships.forEach(ship => { 
                    
                    if((camera.position.y < 5 && Math.abs(camera.position.x) < 10 && Math.abs(camera.position.z) < 10 ) || ship.obb.intersectsOBB(gameState.player.obb, 1)){
                        landed = true
                        
                    }
                })

                if (landed === false){
                    controls.getObject().position.y += ( velocity.y * delta )
                    

                } else {
                    velocity.y = 0
                }
            }
            




            

            const command = new PlayerInput(camera.position.x, camera.position.y, camera.position.z, shoot, camera.rotation.x, camera.rotation.y, camera.rotation.z, delta)

            gameClient.client.addCommand(command)
            // const intersections = raycaster.intersectObjects( objects );

            // const onObject = intersections.length > 0;

            

            // move(camera, command)
            // const globalPosition = new THREE.Vector3();
            // predictCamera.getWorldPosition(globalPosition)

            

            // const prediction = {
            //     nid: gameState.myId,
            //     // x: globalPosition.x,
            //     // y: globalPosition.y,
            //     // z: globalPosition.z,
            //     localPositionX: predictCamera.position.x,
            //     localPositionY: predictCamera.position.y,
            //     localPositionZ: predictCamera.position.z,
            // }
            
            // gameClient.client.addCustomPrediction(gameClient.client.tick, prediction, ['localPositionX', 'localPositionX', 'localPositionX'])





            // velocity.x -= velocity.x * 10.0 * delta;
            // velocity.z -= velocity.z * 10.0 * delta;
            // velocity.y -= velocity.y * 10.0 * delta;

            // // velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

            // direction.z = Number( moveForward ) - Number( moveBackward );
            // direction.x = Number( moveRight ) - Number( moveLeft );
            // direction.y = Number( moveUp ) - Number(moveDown);
            // direction.normalize(); // this ensures consistent movements in all directions

            // if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
            // if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
            // if ( moveUp || moveDown ) velocity.y -= direction.y * 400.0 * delta;


            // if(space === false){
            //     controls.moveRight( - velocity.x * delta);
            //     controls.moveForward( - velocity.z * delta );
            // }
            // // camera.translateX(-velocity.x * delta)
            // // camera.translateZ(velocity.z * delta)
            // if(space === true){
            //     camera.translateX(-velocity.x * delta)
            //     camera.translateZ(velocity.z * delta)
            // }
            // camera.translateY(-velocity.y * delta)
            
            


            // controls.getObject().position.y += ( - velocity.y * delta ); // new behavior
            if(rotateUp === true){
                if(space === false){
                    floor.rotateX(0.1)
                }
                if(space === true){
                    camera.rotateX(0.1)
                }
            }
            if(rotateDown === true){
                if(space === false){
                    floor.rotateX(-0.1)
                }
                if(space === true){
                    camera.rotateX(-0.1)
                }
            }

            if(rotateLeft === true){
                if(space === false){
                    floor.rotateY(0.1)
                }
                if(space === true){
                    camera.rotateY(0.1)
                }
            }
            if(rotateRight === true){
                if(space === false){
                    floor.rotateY(-0.1)
                }
                if(space === true){
                    camera.rotateY(-0.1)
                }
            }

            if(rollLeft === true){
                // if(space === false){
                //     floor.rotateZ(0.1)
                // }
                if(space === true){
                    camera.rotateZ(0.1)
                }
            }
            if(rollRight === true){
                // if(space === false){
                //     floor.rotateZ(-0.1)
                // }
                if(space === true){
                    camera.rotateZ(-0.1)
                }
            }
            // if ( controls.getObject().position.y < 10 ) {

            //  velocity.y = 0;
            //  controls.getObject().position.y = 10;

            //  canJump = true;

            // }

        // }

        prevTime = time;

        renderer.render( scene, camera );

}


function onWindowResize(){
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function exitSpace() {
	let shortestDistance = 99999999;
    let nearestShip;
    
    ships.forEach(ship => { 
        const distanceToShip = camera.position.distanceTo(ship.position)
        if(distanceToShip < shortestDistance){
            shortestDistance = distanceToShip;
            nearestShip = ship.nid;
        }
    })
    ships.get(nearestShip).attach(camera)
    

    console.log(camera)


    camera.rotation.x = 0
    // camera.rotation.y = 0
    camera.rotation.z = 0
    // camera.updateMatrix();
    // camera.updateMatrixWorld();
    gameState.onShip = nearestShip
    // console.log(ships.get(gameState.onShip))

}

function move(entity, command){
    
       const movement = new THREE.Object3D()


        // console.log(command)
        if (command.moveForward) {
            entity.moveForward = true
        } else { entity.moveForward = false }
        if (command.moveBackward) {
            entity.moveBackward = true
        } else {entity.moveBackward = false}
        if (command.moveLeft) {
            entity.moveLeft = true
        } else {entity.moveLeft = false}
        if (command.moveRight) {
            entity.moveRight = true
        } else {entity.moveRight = false}
        if (command.moveUp) {
            entity.moveUp = true
        } else {entity.moveUp = false}
        if (command.moveDown) {
            entity.moveDown = true
        } else {entity.moveDown = false}

        entity.rotationX = command.rotationX
        entity.rotationY = command.rotationY
        entity.rotationZ = command.rotationZ

        movement.rotation.x = command.rotationX
        movement.rotation.y = command.rotationY
        movement.rotation.z = command.rotationZ


        entity.direction.z = Number( entity.moveForward ) - Number( entity.moveBackward );
        entity.direction.x = Number( entity.moveRight ) - Number( entity.moveLeft );
        entity.direction.y = Number( entity.moveUp ) - Number(entity.moveDown);
        entity.direction.normalize(); // this ensures consistent movements in all directions
    
        movement.translateX(entity.direction.x * 40 * command.delta)
        movement.translateY(entity.direction.y * 40 * command.delta)
        movement.translateZ(-entity.direction.z * 40 * command.delta)

        entity.position.x += movement.position.x
        entity.position.y += movement.position.y
        entity.position.z += movement.position.z

        // gameState.myHitBox = new OBB(threeCube.position, halfSize, threeCube.rotation);


}

function updatePostition(delta){

    
}
