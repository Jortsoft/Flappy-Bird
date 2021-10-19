var player
var GRAVITY = 500
var UP_VELOCITY = -250
var WALLCOUNTER = 5
var DISTANCE = 0
var WALLS = []
var WALLS_SPEED = -200
var RESPWNED_WALLS = []
var KEY = true
var SCORES = 0
var BREAK = true
var SCORETEXT
var UP_SOUND
class play extends Phaser.Scene {
    constructor() {
        super('PLay')
    }
    preload() {
        this.load.image('bg', '/images/bg.png')
        this.load.image('ground', '/images/ground.png')
        this.load.image('bird', '/images/bird.png')
        this.load.image('topWall', '/images/topwall.png')
        this.load.image('bottomWall', '/images/bottomwall.png')
        this.load.image('gameOver', '/images/gameover.png')
        this.load.audio('up', '/audio/wing.mp3');
        this.load.audio('die', '/audio/die.mp3');
        this.load.audio('hit', '/audio/hit.mp3');
        this.load.audio('point', '/audio/point.mp3');
    }
    create() {
        this.setWalls()
        var TWEEN = this.tweens
        this.setScore()
        UP_SOUND =  this.sound
        var bg = this.add.image(0, 0, 'bg').setOrigin(0)
        bg.displayWidth = this.game.config.width
        bg.displayHeight = this.game.config.height

        var ground = this.physics.add.sprite(0, game.config.height - 100, 'ground').setOrigin(0)
        ground.displayWidth = this.game.config.width
        ground.displayHeight = 100
        ground.setDepth(3)
        ground.setImmovable()

        player = this.physics.add.sprite(50, 100, 'bird').setOrigin(0)
        player.setScale(2)
        player.setGravityY(GRAVITY)

        this.physics.add.collider(player, ground, function(e) {
            KEY = false
        });
        this.input.on('pointerdown', function(e) {
            TWEEN.add({
                targets: player,
                angle: -10, // '+=100'
                duration: 600,
                yoyo: false 
                });
            UP_SOUND.play('up')
            player.angle = -30
            player.setVelocityY(UP_VELOCITY)
            setTimeout(() => {
                player.angle = 0
            }, 700);
        })
           
    }
    update() {
        if (KEY) {
            this.respawnWalls() 
        } else {
            this.gameOver()
        }
    }

    // Custom functions
    setWalls() {
        WALLS = this.physics.add.group()

        for (var i = 0; i < WALLCOUNTER; i++) {
            var topWall =  WALLS.create(0, 0, 'bottomWall').setDepth(2).setScale(1.5).setImmovable()
            var bottomWall = WALLS.create(0, 0, 'topWall').setDepth(2).setScale(1.5).setImmovable()
            this.renderWalls(topWall, bottomWall)
        }
        WALLS.setVelocityX(WALLS_SPEED)
    }
    renderWalls(topWall, bottomWall) {
        DISTANCE = 200 + this.rightMost()
        var randpmY = Phaser.Math.Between(-200, 20)
        topWall.x = DISTANCE + 120
        topWall.y = randpmY

        bottomWall.x = topWall.x
        bottomWall.y = topWall.y + 620
        console.log('created')
    }
    respawnWalls() {
        var bonusArr = []
        for (var i = 0; i < WALLS.getChildren().length; i++) {
            this.physics.add.collider(WALLS.getChildren()[i], player, function(e) {
                KEY = false
            })
            if (WALLS.getChildren()[i].getBounds().right < 0) {
                bonusArr.push(WALLS.getChildren()[i]) 
                if (bonusArr.length === 2) {
                    this.renderWalls(bonusArr[0], bonusArr[1])
                    SCORES++
                    SCORETEXT.setText(`Score: ${SCORES}`)
                    this.sound.play('point')
                }
            }
        }
    }
    rightMost() {
        var most = 0
        WALLS.getChildren().forEach(function(item) {
            most = Math.max(item.x, most)
        })
        return most
    }
    setScore() {
        const style = { font: "bold 32px Arial", fill: "#fff" };
        SCORETEXT = this.add.text(0, 0, `Score: ${SCORES}`, style).setDepth(8)
    }
    gameOver() {
        this.sound.play('hit')
        var img = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'gameOver').setDepth(9).setScale(1.5)
        this.scene.pause()
        KEY = false
        setTimeout(() => {
            this.sound.play('die')
        }, 700);
    }
    // Custom functions
}