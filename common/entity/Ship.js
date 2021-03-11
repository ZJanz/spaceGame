import nengi from 'nengi'
import * as THREE from 'three/build/three.module.js'
import { OBB } from "three/examples/jsm/math/OBB.js"

class Ship {
    constructor() {

        this.x = 0
        this.y = 0
        this.z = 0
        this.velocity = new THREE.Vector3();
    	this.direction = new THREE.Vector3();
    	this.moveForward = false;
    	this.moveBackward = false;
    	this.moveLeft = false;
    	this.moveRight = false;
    	this.moveUp = false;
    	this.moveDown = false;
    	this.rotationX = 0;
    	this.rotationY = 0;
    	this.rotationZ = 0;
        this.obj = new THREE.Object3D();
        this.obj.position.x = this.x;
        this.obj.position.y = this.y;
        this.obj.position.z = this.z;
        this.obj.rotation.x = this.rotationX;
        this.obj.rotation.y = this.rotationY;
        this.obj.rotation.z = this.rotationZ;


        this.obb = new OBB()
        this.obb.center.set(this.x, this.y, this.z)
        this.obb.halfSize.set(20,1,20)

        this.obb.applyMatrix4(this.obj.matrix)

        
        

        // // this.obb.updateMatrix();
        // // this.obb.updateMatrixWorld();
        // // this.obb.applyMatrix4(this.obb.matrixWorld);
        // this.obb.halfSize.set(1,1,1)
        // this.obb.rotation.set(this.rotationX, this.rotationY, this.rotationZ)



        // console.log(this.obb)

    }
}

Ship.protocol = {
    x: { type: nengi.Number, interp: true },
    y: { type: nengi.Number, interp: true },
    z: { type: nengi.Number, interp: true },
    rotationX : { type: nengi.Number },
    rotationY : { type: nengi.Number },
    rotationZ : { type: nengi.Number },
}

export default Ship