import nengi from 'nengi'
import * as THREE from 'three/build/three.module.js'

class PlayerCharacter {
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


    }
}

PlayerCharacter.protocol = {
    x: { type: nengi.Number, interp: true },
    y: { type: nengi.Number, interp: true },
    z: { type: nengi.Number, interp: true },
    rotationX : { type: nengi.Number },
    rotationY : { type: nengi.Number },
    rotationZ : { type: nengi.Number },
}

export default PlayerCharacter