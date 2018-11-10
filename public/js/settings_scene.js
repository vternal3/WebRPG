class settings_scene extends Phaser.Scene {

    constructor () {
        super({key:'settings_scene'});
    }

	init(data) {
		this.socket = data.socket;
	}
	
	preload() {
		
	}
	
    create () {
		console.log("Settings");
		console.log("starting title scene");
		this.scene.start('title_scene', {socket:this.socket});
		this.scene.stop('settings_scene');
		console.log("stopped settings scene");
    }

    update () {
        
    }
}