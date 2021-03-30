import nengi from 'nengi'
import * as THREE from 'three/build/three.module.js'
import { OBB } from "three/examples/jsm/math/OBB.js"

class PlayerCharacter {
    constructor() {
        this.velocity = new THREE.Vector3();
    	this.direction = new THREE.Vector3();
    	this.moveForward = false;
    	this.moveBackward = false;
    	this.moveLeft = false;
    	this.moveRight = false;
    	this.moveUp = false;
    	this.moveDown = false;
    	
        this.obj = new THREE.Object3D();
        this.obj.position.x = 0;
        this.obj.position.y = 0;
        this.obj.position.z = 0;
        this.obj.rotation.x = 0;
        this.obj.rotation.y = 0;
        this.obj.rotation.z = 0;


        this.obb = new OBB()
        this.obb.center.set(this.x, this.y, this.z)
        this.obb.halfSize.set(1,1,1)

        this.obb.applyMatrix4(this.obj.matrix)

        
        

        // // this.obb.updateMatrix();
        // // this.obb.updateMatrixWorld();
        // // this.obb.applyMatrix4(this.obb.matrixWorld);
        // this.obb.halfSize.set(1,1,1)
        // this.obb.rotation.set(this.rotationX, this.rotationY, this.rotationZ)



        // console.log(this.obb)

    }
    
    get x() {
        const globalPosition = new THREE.Vector3();
        return this.obj.getWorldPosition(globalPosition).x
    }
    get y() {
        const globalPosition = new THREE.Vector3();
        return this.obj.getWorldPosition(globalPosition).y
    }
    get z() {
        const globalPosition = new THREE.Vector3();
        return this.obj.getWorldPosition(globalPosition).z
    }  

    get rotationX() {
        const worldQuaternion = new THREE.Quaternion();
        this.obj.getWorldQuaternion(worldQuaternion)
        const worldRotation = new THREE.Euler().setFromQuaternion(worldQuaternion)
        return worldRotation.x
    }
    get rotationY() {
        const worldQuaternion = new THREE.Quaternion();
        this.obj.getWorldQuaternion(worldQuaternion)
        const worldRotation = new THREE.Euler().setFromQuaternion(worldQuaternion)
        return worldRotation.y
    }
    get rotationZ() {
        const worldQuaternion = new THREE.Quaternion();
        this.obj.getWorldQuaternion(worldQuaternion)
        const worldRotation = new THREE.Euler().setFromQuaternion(worldQuaternion)
        return worldRotation.z
    }
    get localPositionX() {
        return this.obj.position.x
    }
    get localPositionY() {
        return this.obj.position.y
        
    }
    get localPositionZ() {
        return this.obj.position.z
        
    }
}

PlayerCharacter.protocol = {
    x: { type: nengi.Number, interp: true },
    y: { type: nengi.Number, interp: true },
    z: { type: nengi.Number, interp: true },
    localPositionX : { type: nengi.Number },
    localPositionY : { type: nengi.Number },
    localPositionZ : { type: nengi.Number },

    rotationX : { type: nengi.Number },
    rotationY : { type: nengi.Number },
    rotationZ : { type: nengi.Number },
}

export default PlayerCharacter
