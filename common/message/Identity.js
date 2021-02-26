import nengi from 'nengi'

class Identity {
    constructor(entityId) {
        this.entityId = entityId
    }
}
Identity.protocol = {
    entityId: nengi.UInt16
}

export default Identity