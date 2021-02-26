import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig'
import TestEntity from '../common/entity/TestEntity'
import PlayerCharacter from '../common/entity/PlayerCharacter'

import NetLog from '../common/message/NetLog.js'
import Identity from '../common/message/Identity.js'

import * as THREE from 'three/build/three.module.js'


const entities = new Map()
const speed = 1



class GameInstance {
    constructor() {
        this.players = new Map()
        this.instance = new nengi.Instance(nengiConfig, { port: 8079 })
        this.instance.onConnect((client, clientData, callback) => {
            // const entity = new TestEntity()
            const entity = new PlayerCharacter()

            this.instance.addEntity(entity)
            this.instance.message(new Identity(entity.nid), client)

            this.instance.message(new NetLog('hello world'), client)

            client.entity = entity

            client.view = {
                x: 0,
                y: 0,
                z: 0,
                halfWidth: 99999,
                halfHeight: 99999,
                halfDepth: 99999

            }

            entities.set(entity.nid, entity)


            callback({ accepted: true, text: 'Welcome!' })
        })

        this.instance.onDisconnect(client => {
            this.instance.removeEntity(client.entity)
        })

    }

    update(delta, tick, now) {
        let cmd = null
        while (cmd = this.instance.getNextCommand()) {
            const tick = cmd.tick
            const client = cmd.client

            for (let i = 0; i < cmd.commands.length; i++) {
                const command = cmd.commands[i]
                const entity = client.entity
                const movement = new THREE.Object3D()



                // console.log(command)
                if (command.moveForward) {
                    entity.moveForward = true
                } else { entity.moveForward = false }
                if (command.moveBackward) {
                    entity.moveBackward = true
                } else {entity.moveBackward = false}
                if (command.moveLeft) {
                    entity.moveLeft = true
                } else {entity.moveLeft = false}
                if (command.moveRight) {
                    entity.moveRight = true
                } else {entity.moveRight = false}
                if (command.moveUp) {
                    entity.moveUp = true
                } else {entity.moveUp = false}
                if (command.moveDown) {
                    entity.moveDown = true
                } else {entity.moveDown = false}

                entity.rotationX = command.rotationX
                entity.rotationY = command.rotationY
                entity.rotationZ = command.rotationZ

                movement.rotation.x = command.rotationX
                movement.rotation.y = command.rotationY
                movement.rotation.z = command.rotationZ


                entity.direction.z = Number( entity.moveForward ) - Number( entity.moveBackward );
                entity.direction.x = Number( entity.moveRight ) - Number( entity.moveLeft );
                entity.direction.y = Number( entity.moveUp ) - Number(entity.moveDown);
                entity.direction.normalize(); // this ensures consistent movements in all directions
            
                movement.translateX(entity.direction.x * 40 * command.delta)
                movement.translateY(entity.direction.y * 40 * command.delta)
                movement.translateZ(-entity.direction.z * 40 * command.delta)

                entity.x += movement.position.x
                entity.y += movement.position.y
                entity.z += movement.position.z

            

            }
            

        }

        entities.forEach(entity => {
           
            
        })


        // the only server-side game logic is to randomly send a test message
        // if (Math.random() > 0.95) {
        //     this.instance.messageAll(new TestMessage('hi this is a message from the server'))
        // }

        this.instance.update()
    }
}

export default GameInstance
