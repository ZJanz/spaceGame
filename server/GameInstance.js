import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig'
import TestEntity from '../common/entity/TestEntity'
import PlayerCharacter from '../common/entity/PlayerCharacter'
import Bullet from '../common/entity/Bullet'

import NetLog from '../common/message/NetLog.js'
import Identity from '../common/message/Identity.js'
import Death from '../common/message/Death.js'

// import { Ray } from "three/examples/jsm/math/Ray.js"

import * as THREE from 'three/build/three.module.js'


const entities = new Map()
const bullets = new Map()
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
            this.players.set(entity.nid, client)
            client.entity = entity

            client.view = {
                x: 0,
                y: 0,
                z: 0,
                halfWidth: 999999,
                halfHeight: 999999,
                halfDepth: 999999

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
                if (command.shoot) {
                    entity.shoot = true
                } else {entity.shoot = false}


                entity.rotationX = command.rotationX
                entity.rotationY = command.rotationY
                entity.rotationZ = command.rotationZ

                entity.obj.rotation.x = entity.rotationX
                entity.obj.rotation.y = entity.rotationY
                entity.obj.rotation.z = entity.rotationZ


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

                entity.obj.position.x = entity.x
                entity.obj.position.y = entity.y
                entity.obj.position.z = entity.z

                entity.obb.center.set(entity.x, entity.y, entity.z)
                entity.obj.updateMatrix()
                entity.obj.updateMatrixWorld()

                entity.obb.applyMatrix4(entity.obj.matrix)

                // console.log(entity.obb)
                

                
            

            }
            

        }

        entities.forEach(entity => {
            if(entity.shoot === true){



                const bullet = new Bullet()

                

                this.instance.addEntity(bullet)



                bullets.set(bullet.nid, bullet)

                bullet.rotationX = entity.rotationX
                bullet.rotationY = entity.rotationY
                bullet.rotationZ = entity.rotationZ

                bullet.id = entity.nid
                bullet.x = entity.x
                bullet.y = entity.y
                bullet.z = entity.z
                bullet.obj.position.x = bullet.x;
                bullet.obj.position.y = bullet.y;
                bullet.obj.position.z = bullet.z;
                bullet.obj.rotation.x = bullet.rotationX;
                bullet.obj.rotation.y = bullet.rotationY;
                bullet.obj.rotation.z = bullet.rotationZ;

                bullet.obb.center.set(bullet.x, bullet.y, bullet.z)

                bullet.obb.applyMatrix4(bullet.obj.matrix)

                
            }
               
        })
        
        bullets.forEach(bullet => {
            const movement = new THREE.Object3D()
            
            bullet.time += (delta)

            movement.rotation.x = bullet.rotationX
            movement.rotation.y = bullet.rotationY
            movement.rotation.z = bullet.rotationZ
            movement.translateZ(-4*40*delta)
            
            bullet.x += movement.position.x
            bullet.y += movement.position.y
            bullet.z += movement.position.z

            bullet.obj.position.x = bullet.x;
            bullet.obj.position.y = bullet.y;
            bullet.obj.position.z = bullet.z;
            bullet.obj.rotation.x = bullet.rotationX;
            bullet.obj.rotation.y = bullet.rotationY;
            bullet.obj.rotation.z = bullet.rotationZ;

            bullet.obb.center.set(bullet.x, bullet.y, bullet.z)
            bullet.obj.updateMatrix()
            bullet.obj.updateMatrixWorld()

            bullet.obb.applyMatrix4(bullet.obj.matrix)

            // console.log(bullet.obb)

            if(bullet.time > 2){
                bullets.delete(bullet.nid)
                this.instance.removeEntity(bullet)
            }

            entities.forEach(entity => {
                if(bullet.obb.intersectsOBB(entity.obb) && bullet.id != entity.nid){
                    
                    if(bullet.nid != -1){
                        bullets.delete(bullet.nid)
                        this.instance.removeEntity(bullet)
                        entity.x = Math.random() * 100 - 50;
                        entity.y = Math.random() * 100 - 50;
                        entity.z = Math.random() * 100 - 50;
                        entity.obj.position.x = entity.x
                        entity.obj.position.y = entity.y
                        entity.obj.position.z = entity.z

                        entity.obb.center.set(entity.x, entity.y, entity.z)
                        entity.obj.updateMatrix()
                        entity.obj.updateMatrixWorld()

                        entity.obb.applyMatrix4(entity.obj.matrix)
                        // this.instance.message(new NetLog('hello world'), client)

                        this.instance.message(new NetLog("Got wrecked"), this.players.get(entity.nid))
                        this.instance.message(new Death(entity.x, entity.y, entity.z), this.players.get(entity.nid))


                    }
                }
            })
        })


        // the only server-side game logic is to randomly send a test message
        // if (Math.random() > 0.95) {
        //     this.instance.messageAll(new TestMessage('hi this is a message from the server'))
        // }

        this.instance.update()
    }
}

export default GameInstance
