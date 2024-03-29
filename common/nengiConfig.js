import nengi from 'nengi'
import TestEntity from './entity/TestEntity'
// import TestMessage from './message/TestMessage'
import TestCommand from './command/TestCommand'
import NetLog from './message/NetLog.js'
import PlayerCharacter from './entity/PlayerCharacter.js'
import Bullet from './entity/Bullet.js'
import Ship from './entity/Ship.js'
import ShipWall from './entity/ShipWall.js'



import PlayerInput from './command/PlayerInput'
import SpaceControl from './command/SpaceControl'

import Identity from './message/Identity.js'
import Death from './message/Death.js'


const config = {
    UPDATE_RATE: 20, 

    ID_BINARY_TYPE: nengi.UInt16,
    TYPE_BINARY_TYPE: nengi.UInt8, 

    ID_PROPERTY_NAME: 'nid',
    TYPE_PROPERTY_NAME: 'ntype', 

    USE_HISTORIAN: true,
    HISTORIAN_TICKS: 40,

    protocols: {
        entities: [
            ['TestEntity', TestEntity],
            ['PlayerCharacter', PlayerCharacter],
            ['Ship', Ship],
            ['ShipWall', ShipWall],

            ['Bullet', Bullet]

        ],
        localMessages: [],
        messages: [
            // ['TestMessage', TestMessage],
            ['NetLog', NetLog],
            ['PlayerCharacter', PlayerCharacter],
            ['Identity', Identity],
            ['Death', Death]

        ],
        commands: [
            ['TestCommand', TestCommand],
            ['PlayerInput', PlayerInput],
            ['SpaceControl', SpaceControl],
        ],
        basics: []
    }
}

export default config
