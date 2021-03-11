import nengi from 'nengi'

class SpaceControl {
    constructor(space) {
        this.space = space
    }
}

SpaceControl.protocol = {
    space : nengi.Boolean,
}

export default SpaceControl
