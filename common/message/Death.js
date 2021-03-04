import nengi from 'nengi'

class Death {
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z

    }
}
Death.protocol = {
    x: { type: nengi.Number },
    y: { type: nengi.Number },
    z: { type: nengi.Number },
}

export default Death