class settings_scene extends Phaser.Scene {

    constructor () {
        super({key:'settings_scene'});
    }

	preload() {
		
	}
	
    create () {
		console.log("Settings");
		this.scene.start('title_scene');
    }

    update () {
        
    }
}