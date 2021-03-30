import nengi from 'nengi'

class PlayerInput {
    constructor(x, y, z, shoot, rotationX, rotationY, rotationZ, delta) {
        this.x = x
        this.y = y
        this.z = z
        this.shoot = shoot
        this.rotationX = rotationX
        this.rotationY = rotationY
        this.rotationZ = rotationZ
        this.delta = delta
    }
}

PlayerInput.protocol = {
    x : nengi.Number,
    y : nengi.Number,
    z : nengi.Number,
    shoot : nengi.Boolean,
    rotationX : nengi.Number,
    rotationY : nengi.Number,
    rotationZ : nengi.Number,
    delta : nengi.Number
}

export default PlayerInput
