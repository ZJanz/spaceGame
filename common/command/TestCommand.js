import nengi from 'nengi'

class TestCommand {
    constructor(text) {
        this.text = text
    }
}

TestCommand.protocol = {
    text: nengi.String
}

export default TestCommand
