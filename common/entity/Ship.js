import nengi from 'nengi'
import * as THREE from 'three/build/three.module.js'
import { OBB } from "three/examples/jsm/math/OBB.js"

class Ship {
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
        this.obj.position.x = 0
        this.obj.position.y = 0
        this.obj.position.z = 0
        this.obj.rotation.x = 0;
        this.obj.rotation.y = 0;
        this.obj.rotation.z = 0;
        this.leftWall = {}
        this.leftWall.obj = new THREE.Object3D();
        this.leftWall.obj.position.x = this.x+20;
        this.leftWall.obj.position.y = this.y;
        this.leftWall.obj.position.z = this.z;
        this.leftWall.obb = new OBB()
        this.leftWall.obb.center.set(this.leftWall.obj.position.x, this.leftWall.obj.position.y, this.leftWall.obj.position.z)
        this.leftWall.obb.halfSize.set(1,20,20)
        this.leftWall.obb.applyMatrix4(this.leftWall.obj.matrix)


        this.obb = new OBB()
        this.obb.center.set(this.x, this.y, this.z)
        this.obb.halfSize.set(10,1,10)
        console.log(this.obb.halfSize)

        this.obb.applyMatrix4(this.obj.matrix)
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
}

Ship.protocol = {
    x: { type: nengi.Number, interp: true },
    y: { type: nengi.Number, interp: true },
    z: { type: nengi.Number, interp: true },
    rotationX : { type: nengi.Number },
    rotationY : { type: nengi.Number },
    rotationZ : { type: nengi.Number },
    'obb.halfSize.x' : { type: nengi.Number },
    'obb.halfSize.y' : { type: nengi.Number },
    'obb.halfSize.z' : { type: nengi.Number },

}

export default Ship