import nengi from 'nengi'
import * as THREE from 'three/build/three.module.js'
import { OBB } from "three/examples/jsm/math/OBB.js"


class Bullet {
    constructor() {
        this.x = 0
        this.y = 0
        this.z = 0
        this.time = 0
        this.velocity = new THREE.Vector3();
    	this.direction = new THREE.Vector3();
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
        this.obb.halfSize.set(5,5,5)

        this.obb.applyMatrix4(this.obj.matrix)

        


    }
}

Bullet.protocol = {
    x: { type: nengi.Number, interp: true },
    y: { type: nengi.Number, interp: true },
    z: { type: nengi.Number, interp: true },
    rotationX : { type: nengi.Number },
    rotationY : { type: nengi.Number },
    rotationZ : { type: nengi.Number },
}

export default Bullet