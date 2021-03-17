import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig'
import TestEntity from '../common/entity/TestEntity'
import PlayerCharacter from '../common/entity/PlayerCharacter'
import Ship from '../common/entity/Ship'

import Bullet from '../common/entity/Bullet'

import NetLog from '../common/message/NetLog.js'
import Identity from '../common/message/Identity.js'
import Death from '../common/message/Death.js'

// import { Ray } from "three/examples/jsm/math/Ray.js"

import * as THREE from 'three/build/three.module.js'


const entities = new Map()
const bullets = new Map()
const ships = new Map()

const speed = 1



class GameInstance {
    constructor() {
        this.players = new Map()
        this.instance = new nengi.Instance(nengiConfig, { port: 8079 })
        this.instance.onConnect((client, clientData, callback) => {
            // const entity = new TestEntity()
            try{
                const entity = new PlayerCharacter()

                const ship = new Ship()
                
                // console.log(ships.get(ship.nid))


                this.instance.addEntity(entity)
                this.instance.addEntity(ship)
                ships.set(ship.nid, ship)

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
                // entity.obj.add(ship.obj)
                entities.set(entity.nid, entity)




                callback({ accepted: true, text: 'Welcome!' })
                } catch (error){
                    console.log(error)
                }
            })

        this.instance.onDisconnect(client => {
            
            entities.delete(client.entity.nid)
            this.instance.removeEntity(client.entity)
            
        })

    }

    update(delta, tick, now) {
        let cmd = null
        while (cmd = this.instance.getNextCommand()) {
            const tick = cmd.tick
            const client = cmd.client

            for (let i = 0; i < cmd.commands.length; i++) {
                try {
                    const command = cmd.commands[i]
                    const entity = client.entity
                    const movement = new THREE.Object3D()



                    // if(command.space != undefined) {
                        // console.log(command.protocol.name)
                    // }
                    if(command.protocol.name === "PlayerInput"){
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


                        // entity.rotationX = command.rotationX
                        // entity.rotationY = command.rotationY
                        // entity.rotationZ = command.rotationZ

                        entity.obj.rotation.x = command.rotationX
                        entity.obj.rotation.y = command.rotationY
                        entity.obj.rotation.z = command.rotationZ


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

                        entity.obj.position.x += movement.position.x
                        entity.obj.position.y += movement.position.y
                        entity.obj.position.z += movement.position.z

                        entity.obb.center.set(entity.x, entity.y, entity.z)
                        entity.obj.updateMatrix()
                        entity.obj.updateMatrixWorld()

                        entity.obb.applyMatrix4(entity.obj.matrix)

                    // console.log(entity.obb)
                    }
                    if(command.protocol.name === "SpaceControl"){

                        if(command.space === false){
                            let shortestDistance = 99999999;
                            let nearestShip;
                            
                            ships.forEach(ship => { 
                                const distanceToShip = entity.obj.position.distanceTo(ship.obj.position)
                                if(distanceToShip < shortestDistance){
                                    shortestDistance = distanceToShip;
                                    nearestShip = ship.nid;
                                }
                            })
                            ships.get(nearestShip).obj.add(entity.obj)
                            // console.log(ships.get(nearestShip))
                            
                        }
                    } 
                }   
                catch(err) {
                        console.log("error")
                        console.log(err)
                    }

            }
            

        }

        entities.forEach(entity => {
            if(entity.shoot === true){



                const bullet = new Bullet()

                

                this.instance.addEntity(bullet)



                bullets.set(bullet.nid, bullet)

                bullet.rotationX = entity.obj.rotation.x
                bullet.rotationY = entity.obj.rotation.y
                bullet.rotationZ = entity.obj.rotation.z

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
        ships.forEach(ship => {
            ship.obj.position.x += 1
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
                if(bullet.obb.intersectsOBB(entity.obb) && bullet.id != entity.nid && entity.nid != -1){
                    try {
                        if(bullet.nid != -1){
                            bullets.delete(bullet.nid)
                            this.instance.removeEntity(bullet)
                            entity.obj.position.x = Math.random() * 100 - 50;
                            entity.obj.position.y = Math.random() * 100 - 50;
                            entity.obj.position.z = Math.random() * 100 - 50;
                            

                            entity.obb.center.set(entity.obj.position.x, entity.obj.position.y, entity.obj.position.z)
                            entity.obj.updateMatrix()
                            entity.obj.updateMatrixWorld()

                            entity.obb.applyMatrix4(entity.obj.matrix)
                            // this.instance.message(new NetLog('hello world'), client)

                            this.instance.message(new NetLog("Got wrecked"), this.players.get(entity.nid))
                            this.instance.message(new Death(entity.x, entity.y, entity.z), this.players.get(entity.nid))


                        }
                    } 
                    catch (error) {
                        console.log(error)
                        console.log(entity)
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
