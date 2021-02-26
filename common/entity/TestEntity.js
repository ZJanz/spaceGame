import nengi from 'nengi'

class TestEntity {
    constructor() {
        this.x = 0
        this.y = 0
        this.z = 0
    }
}

TestEntity.protocol = {
    x: { type: nengi.Float32, interp: true },
    y: { type: nengi.Float32, interp: true },
    z: { type: nengi.Float32, interp: true },

}

export default TestEntity
