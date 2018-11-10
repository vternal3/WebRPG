class character_scene extends Phaser.Scene {

    constructor () {
        super({key:'character_scene'});
    }
	
	init(data) {
		this.socket = data.socket;
	}
	
	preload() {
		
	}
	
    create () {
		console.log("Character");
		console.log("starting game scene");
		this.scene.start('game_scene', {socket:this.socket});
		this.scene.stop('character_scene');
		console.log("stopped character scene");
    }

    update () {
        
    }
}