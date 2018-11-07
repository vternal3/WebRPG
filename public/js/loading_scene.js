class loading_scene extends Phaser.Scene {

    constructor () {
        super({key:'loading_scene'});
    }

	preload() {
		this.load.image('ship', 'assets/spaceShips_001.png');
		this.load.image('otherPlayer', 'assets/enemyBlack5.png');
		this.load.image('star', 'assets/star_gold.png');
		
		//this.load.image('gameTiles', 'spritesheets/45a71fb70eda0e7a608f09bf4a13fd6a.png');
		//this.load.tilemapTiledJSON('level1', 'spritesheets/untitled.json');
		//this.load.spritesheet('trees', 'spritesheets/45a71fb70eda0e7a608f09bf4a13fd6a.png', { frameWidth: 32, frameHeight: 32});
		this.load.image("mario-tiles", "spritesheets/1 qmckz-4ppRl9i8-tEmGmHw.png");
		
		this.load.image("tiles", "spritesheets/45a71fb70eda0e7a608f09bf4a13fd6a.png");
		this.load.image("tiles2", "spritesheets/45a71fb70eda0e7a608f09bf4a13fd6a.png");
		this.load.image("grass2", "spritesheets/grass-tile-3.png");
		this.load.spritesheet("walk_template", "spritesheets/walk_template.png", { frameWidth: 60, frameHeight: 110});
		
		this.load.spritesheet("title_crystal", "spritesheets/crystal-qubodup-ccby3-32-blue.png", { frameWidth: 32, frameHeight: 32});
		this.load.image("title_bg", "spritesheets/parallax-mountain-bg.png");
		this.load.image("start", "spritesheets/start.png");
		this.load.image("start_hover", "spritesheets/start_hover.png");
		this.load.image("settings", "spritesheets/settings.png");
		this.load.image("settings_hover", "spritesheets/settings_hover.png");
		
		
		
		this.load.tilemapCSV("map", "spritesheets/untitled2_Tile Layer 1.csv");
		this.load.tilemapTiledJSON("map2", "spritesheets/untitled2.json");
		this.load.tilemapTiledJSON("map3", "spritesheets/untitled3.json");
		
		this.load.audio('theme_music', 'music/Soliloquy.mp3');
		
		let loadingBar = this.add.graphics({
			fillStyle: {
				color: 0xffffff //white
			}
		});
		
		this.load.on("progress", (percent)=>{
			loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
			console.log(percent);
		});
		this.load.on("complete", ()=> {
			// this.scene.start("menu", "optional data" /*Optional data object to pass to Scene.Settings and Scene.init.*/);
			console.log("done");
		});
	}
	
    create () {
		
		
		console.log("Loading");
		this.scene.start('title_scene');
		this.scene.stop('loading_scene');
		console.log("stopped loading scene");
    }

    update () {
        
    }

}