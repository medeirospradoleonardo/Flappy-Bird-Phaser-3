var config = {
  type: Phaser.AUTO,
  width: 320,
  height: 505,
  backgroundColor: 0x000000,
  physics: {
    default: 'arcade',
    arcade: {
        debug: false,
        fps: 144
    }
  },
  scene: [BootJogo, MenuJogo, JogoRodando, PauseJogo]
}


var game = new Phaser.Game(config)
