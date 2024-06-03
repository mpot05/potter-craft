namespace SpriteKind {
    export const Inventory = SpriteKind.create()
    export const Axe = SpriteKind.create()
    export const groundAxe = SpriteKind.create()
    export const handAxe = SpriteKind.create()
    export const wood = SpriteKind.create()
}
scene.onHitWall(SpriteKind.handAxe, function (sprite, location) {
    if (location.getImage() == assets.tile`tree`) {
        tiles.setTileAt(location, assets.tile`wood`)
        tiles.setWallAt(location, false)
        console.log("TREE DOWN")
    }
})
let inventory = sprites.create(assets.image`Inventory`, SpriteKind.Inventory)
inventory.setFlag(SpriteFlag.Invisible, true)
let invItems = {
    1: [""]
}
invItems[1].removeElement("")
let dir = 0
let player2Hands = ""
let player2 = sprites.create(assets.image`player`, SpriteKind.Player)
let axe = sprites.create(assets.image`Axe`, SpriteKind.groundAxe)
scene.cameraFollowSprite(player2)
player2.setPosition(100, 80)
axe.setPosition(100, 100)
controller.moveSprite(player2, 30, 30)
tiles.setCurrentTilemap(tilemap`level`)
let lastX = 0
let lastY = 0
let lastPos: tiles.Location
let invOpen = false
let invPositions = {
    0: [-53, -17, 19, 55],
    1: [-44, -18, 18, 45]
}
controller.left.onEvent(ControllerButtonEvent.Pressed, () => {
    dir = 0
})
controller.right.onEvent(ControllerButtonEvent.Pressed, () => {
    dir = 1
})
controller.up.onEvent(ControllerButtonEvent.Pressed, () => {
    dir = 2
})
controller.down.onEvent(ControllerButtonEvent.Pressed, () => {
    dir = 3
})
for (let i = 0; i < 100; i++) {
    tiles.setTileAt(tiles.getRandomTileByType(assets.tile`grass`), assets.tile`tree`)
}
tiles.setTileAt(tiles.getRandomTileByType(assets.tile`grass`), assets.tile`tree`)
tiles.setTileAt(tiles.getTileLocation(6, 6), assets.tile`grass`)
tiles.setTileAt(tiles.getTileLocation(6, 5), assets.tile`grass`)
tiles.setTileAt(tiles.getTileLocation(6, 4), assets.tile`grass`)
controller.B.onEvent(ControllerButtonEvent.Pressed, () => {
    if (invOpen) {
        sprites.allOfKind(SpriteKind.groundAxe).forEach((e) => {
            e.setFlag(SpriteFlag.Invisible, false)
        })
        invOpen = false
        sprites.allOfKind(SpriteKind.Axe).forEach((e) => {
            e.destroy()
        })
        sprites.allOfKind(SpriteKind.wood).forEach((e) => {
            e.destroy()
        })
        player2.x = lastX
        player2.y = lastY
        controller.moveSprite(player2, 30, 30)
        player2.setImage(assets.image`player`)
        player2.setFlag(SpriteFlag.Ghost, false)
        inventory.setFlag(SpriteFlag.Invisible, true)
        inventory.setPosition(0, 0)
        inventory.setPosition(0, 0)
        scene.cameraFollowSprite(player2)
    }
    else {
        sprites.allOfKind(SpriteKind.groundAxe).forEach((e) => {
            e.setFlag(SpriteFlag.Invisible, true)
        })
        invOpen = true
        lastX = player2.x
        lastY = player2.y
        lastPos = player2.tilemapLocation()
        let invpos = 0
        let invpos2 = 0
        invItems[1].forEach((e) => {
            let item = sprites.create(assets.image`ghost`)
            if (e == "Axe") {
                item.setImage(assets.image`Axe`)
                item.setKind(SpriteKind.Axe)
            }
            else if (e == "wood") {
                item.setImage(assets.image`wood`)
                item.setKind(SpriteKind.wood)
            }
            item.setPosition(lastX + invPositions[0].get(invpos), lastY + invPositions[1].get(invpos2))
            invpos++
            if (invpos == 4) {
                invpos = 0
                invpos2++
            }
        })
        controller.moveSprite(player2, 60, 60)
        player2.setImage(assets.image`pointer`)
        player2.setStayInScreen(true)
        player2.setFlag(SpriteFlag.GhostThroughWalls, true)
        inventory.setFlag(SpriteFlag.Invisible, false)
        inventory.setPosition(player2.x, player2.y)
        inventory.setPosition(player2.x, player2.y)
        inventory.setScale(9, ScaleAnchor.Middle)
        scene.cameraFollowSprite(inventory)
    }
})
// invItems[1].insertAt(invItems[1].length, "Item")
controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
    console.log(player2Hands + " in hands")
    console.log(player2Hands + " in hands")
    if (invOpen) {
        if (sprites.allOfKind(SpriteKind.Axe).length > 0) {
            if (player2.overlapsWith(sprites.allOfKind(SpriteKind.Axe)[0])) {
                player2Hands = "Axe"
                let check = sprites.create(assets.image`check`)
                check.setPosition(player2.tilemapLocation().x, player2.tilemapLocation().y + 1)
                setTimeout(() => {
                    check.destroy()
                }, 1000)
            }

        }
        if (sprites.allOfKind(SpriteKind.wood).length > 0) {
            sprites.allOfKind(SpriteKind.wood).forEach((e) => {
                if (player2.overlapsWith(e)) {
                    if (tiles.getTileAt(lastPos.col, lastPos.row) == assets.tile`wood`) {
                    }
                    else {
                        e.destroy()
                        invItems[1].removeElement("wood")
                        tiles.setTileAt(lastPos, assets.tile`wood`)
                    }
                }
            })
        }
    }
    else {
        if (tiles.tileImageAtLocation(player2.tilemapLocation()) == assets.tile`craftingTile`) {

        }
        if (player2.overlapsWith(axe)) {
            axe.setFlag(SpriteFlag.Invisible, true)
            axe.setPosition(0, 0)
            axe.setPosition(0, 0)
            invItems[1].insertAt(invItems[1].length, "Axe")
        }
        if (player2.tilemapLocation().getImage() == assets.tile`wood`) {
            if (invItems[1].length == 16) {
                player2.sayText("Inventory full", 1000)
            }
            else {
                tiles.setTileAt(player2.tilemapLocation(), assets.tile`grass`)
                invItems[1].insertAt(invItems[1].length, "wood")
            }
        }
        else if (player2Hands === "Axe") {

            switch (dir) {
                case 0: { // left
                    if (dir == 0) {
                        let handAxe = sprites.create(assets.image`Axe`, SpriteKind.handAxe)
                        handAxe.setPosition(player2.x, player2.y)
                        handAxe.image.flipX()
                        handAxe.vx = -5
                        handAxe.vy = 0
                        console.log("case 0 reached: " + dir)
                        setTimeout(() => {
                            handAxe.destroy()
                        }, 1000)
                    }
                }

                case 1: { // right
                    if (dir == 1) {
                        let handAxe = sprites.create(assets.image`Axe`, SpriteKind.handAxe)
                        handAxe.setPosition(player2.x, player2.y)
                        handAxe.vx = 5
                        handAxe.vy = 0
                        console.log("case 1 reached: " + dir)
                        setTimeout(() => {
                            handAxe.destroy()
                        }, 1000)
                    }
                }

                case 2: { // up
                    if (dir == 2) {
                        let handAxe = sprites.create(assets.image`Axe`, SpriteKind.handAxe)
                        handAxe.setPosition(player2.x, player2.y)
                        handAxe.vy = -5
                        handAxe.vx = 0
                        console.log("case 2 reached: " + dir)
                        setTimeout(() => {
                            handAxe.destroy()
                        }, 1000)
                    }
                }

                case 3: { // down
                    if (dir == 3) {
                        let handAxe = sprites.create(assets.image`Axe`, SpriteKind.handAxe)
                        handAxe.setPosition(player2.x, player2.y)
                        handAxe.image.flipY()
                        handAxe.vy = 5
                        handAxe.vx = 0
                        console.log("case 3 reached: " + dir)
                        setTimeout(() => {
                            handAxe.destroy()
                        }, 1000)
                    }
                }

                default: {
                    console.log("stop going to this")
                }
                    console.log("Direction: " + dir)

            }
            // if (left) {
            //     let handAxe = sprites.create(assets.image`Axe`, SpriteKind.handAxe)
            //     handAxe.setPosition(player2.x, player2.y)
            //     handAxe.image.flipX()
            //     handAxe.vx = -5
            //     setTimeout(() => {
            //         handAxe.destroy()
            //     }, 1000)
            // }
            // else {
            //     let handAxe = sprites.create(assets.image`Axe`, SpriteKind.handAxe)
            //     handAxe.setPosition(player2.x, player2.y)
            //     handAxe.vx = 5
            //     setTimeout(() => {
            //         handAxe.destroy()
            //     }, 1000)

            // }
        }
    }
})

tiles.getTilesByType(assets.tile`tree`).forEach((e) => {
    tiles.setWallAt(tiles.getTileLocation(e.col, e.row), true)
})
tiles.getTilesByType(assets.tile`WALL`).forEach((e) => {
    tiles.setWallAt(tiles.getTileLocation(e.col, e.row), true)
})