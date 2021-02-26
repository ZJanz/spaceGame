import nengi from 'nengi'

class TestMessage {
    constructor(text) {
        this.text = text
    }
}

TestMessage.protocol = {
    text: nengi.String
}

export default TestMessage
