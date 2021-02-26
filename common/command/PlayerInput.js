import nengi from 'nengi'

class PlayerInput {
    constructor(moveForward, moveBackward, moveLeft, moveRight, moveUp, moveDown, rotationX, rotationY, rotationZ, delta) {
        this.moveForward = moveForward
        this.moveBackward = moveBackward
        this.moveLeft = moveLeft
        this.moveRight = moveRight
        this.moveUp = moveUp
        this.moveDown = moveDown
        this.rotationX = rotationX
        this.rotationY = rotationY
        this.rotationZ = rotationZ
        this.delta = delta
    }
}

PlayerInput.protocol = {
    moveForward : nengi.Boolean,
    moveBackward : nengi.Boolean,
    moveLeft : nengi.Boolean,
    moveRight : nengi.Boolean,
    moveUp : nengi.Boolean,
    moveDown : nengi.Boolean,
    rotationX : nengi.Number,
    rotationY : nengi.Number,
    rotationZ : nengi.Number,
    delta : nengi.Number
}

export default PlayerInput
