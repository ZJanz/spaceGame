import nengi from 'nengi'

class NetLog {
    constructor(text) {
        this.text = text
    }
}
NetLog.protocol = {
    text: nengi.String
}

export default NetLog