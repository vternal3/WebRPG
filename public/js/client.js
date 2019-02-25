var config = {
  type: Phaser.AUTO,
  parent: 'game_canvas',
  width: window.innerWidth * window.devicePixelRatio,
  height: window.innerHeight * window.devicePixelRatio,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  render:{
	  pixelArt: true,
  },
  scene: [loading_scene, character_scene, settings_scene, game_scene],
  audio: {
	disableWebAudio: true
  }
};
 
var game = new Phaser.Game(config);

window.addEventListener('resize', function (event) {
	game.resize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
}, false);
