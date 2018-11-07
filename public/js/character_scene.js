class character_scene extends Phaser.Scene {

    constructor () {
        super({key:'character_scene'});
    }

	preload() {
		
	}
	
    create () {
		console.log("Character");
		this.scene.start('game_scene');
    }

    update () {
        
    }
}