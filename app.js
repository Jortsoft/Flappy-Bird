const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 480,
    height: 640,
    scene: [ play ],
    scale: {
        mode: Phaser.Scale.FIT,
    },
    physics:{
        default:'arcade',
        arcade:{debug:false}
    }
};

const game = new Phaser.Game(config);
