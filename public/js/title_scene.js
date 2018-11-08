class title_scene extends Phaser.Scene {

    constructor () {
        super({key:'title_scene'});
    }

	preload() {
		console.log("Title");
		//hides the AddThis strip
		if(document.getElementsByClassName("addthis-smartlayers-desktop")[0]) {
			document.getElementsByClassName("addthis-smartlayers-desktop")[0].classList.add("nodisplay");
		}
	}
	
    create () {
		
		this.add.image(0,0,'title_bg').setOrigin(0).setScale(4);
		let startButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, "start");
		let settingsButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, "settings");
		
		let hoverSprite = this.add.sprite(100, 100, "title_crystal");
		hoverSprite.setVisible(false);
		
		this.sound.play("theme_music");
		
		this.anims.create({
			key: "rotate",
			frameRate: 16,
			repeat: -1,
			frames: this.anims.generateFrameNumbers("title_crystal", {
				frames: [0,1,2,3,4,5,6,7]
			})
		});
		
		startButton.setInteractive();
		startButton.on("pointerover", ()=> {
			hoverSprite.setVisible(true);
			hoverSprite.play("rotate");
			hoverSprite.x = startButton.x - 200;
			hoverSprite.y = startButton.y;
		});
		startButton.on("pointerout", ()=> {
			hoverSprite.setVisible(false);
		});
		startButton.on("pointerup", ()=> {
			this.sound.pauseAll();
			console.log("starting character scene");
			this.scene.start('character_scene');
			this.scene.stop('title_scene');
			console.log("stopped title scene");
		});
		
		
		settingsButton.setInteractive();
		settingsButton.on("pointerover", ()=> {
			hoverSprite.setVisible(true);
			hoverSprite.play("rotate");
			hoverSprite.x = settingsButton.x - 200;
			hoverSprite.y = settingsButton.y;
		});
		settingsButton.on("pointerout", ()=> {
			hoverSprite.setVisible(false);
		});
		settingsButton.on("pointerup", ()=> {
			this.sound.pauseAll();
			console.log("starting settings scene");
			this.scene.start('settings_scene');
			this.scene.stop('title_scene');
			console.log("stopped title scene");
		});
		
		
    }

    update () {
        
    }
}