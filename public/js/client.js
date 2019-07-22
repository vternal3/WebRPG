var config = {
  type: Phaser.CANVAS,
  parent: 'game_canvas',
  // width: window.innerWidth * window.devicePixelRatio,
  // height: window.innerHeight * window.devicePixelRatio,
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
  pixelArt: true,
  // clearBeforeRender: false,
  // dom: {
  //     createContainer: true
  // },
  //backgroundColor: '#2dab2d',
  autoResize: true,
  scale: {
      mode: Phaser.Scale.NONE,
      //autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: 'game_canvas',
      width: window.innerWidth * window.devicePixelRatio,
      height: window.innerHeight * window.devicePixelRatio,
      min: {
        width: 400,
        height: 300,
      },
      max: {
        width: 3840,
        height: 2160,
      }
  },
  // fps: {
  //   target: 60
  // },
  // dom: {
  //     createContainer: false,
  // },
  // expandParent: true,
  //mode: 3,
  // autoRound: false,
  scene: [loading_scene, character_scene, settings_scene, game_scene],
  // audio: {
	//   disableWebAudio: true
  // }
};
 
var game = new Phaser.Game(config);

function resizeGame(event) {
  game.scale.resize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resizeGame, false);
resizeGame();
