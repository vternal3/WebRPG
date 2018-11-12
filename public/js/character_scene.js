class character_scene extends Phaser.Scene {

    constructor () {
        super({key:'character_scene'});
    }
	
	init(data) {
		this.socket = data.socket;
	}
	
	preload() {
		//hides the AddThis strip
		if(document.getElementsByClassName("addthis-smartlayers-desktop")[0]) {
			document.getElementsByClassName("addthis-smartlayers-desktop")[0].classList.add("nodisplay");
		}
	}
	
    create () {
		//retrieve character list from database
		//then for loop over each one and 'add'
		//a character border with the character
		//over the board with it's name text next 
		//to it.
		let background = this.add.image(this.game.renderer.width / 2 - 544, 0,'title_bg').setOrigin(0).setScale(4);
		
		let character_background = this.add.image(this.game.renderer.width - 130, 54, "character_boarder");
		let character_background_hover = this.add.image(this.game.renderer.width - 130, 54, "character_boarder_hover");
		
		
		let character_name_textbox = this.add.image(this.game.renderer.width / 2, 400, "character_name_textbox");
		let character_name_textbox_focus = this.add.image(this.game.renderer.width / 2, 400, "character_name_textbox_focus");
		
		this.character_name_text = this.add.text(this.game.renderer.width / 2 - 90, 385, 'TextName', {
				fontSize: '36px',
				fill: '#000000'
			});
		
		let startButton = this.add.image(this.game.renderer.width / 2, 500, "start");
		let startHoverButton = this.add.image(this.game.renderer.width / 2, 500, "start_hover");
		
		let settingsButton = this.add.image(this.game.renderer.width - 64, 546, "settings");
		let settingsHoverButton = this.add.image(this.game.renderer.width - 64, 546, "settings_hover");
		
		let focus_textbox = false;
		character_name_textbox_focus.setVisible(false);
		startHoverButton.setVisible(false);
		settingsHoverButton.setVisible(false);
		character_background_hover.setVisible(false);
		
		this.sound.play("theme_music");
		
		
		
		
		character_background.setInteractive();
		character_background.on("pointerover", ()=> {
			character_background_hover.setVisible(true);
		});
		character_background.on("pointerout", ()=> {
			character_background_hover.setVisible(false);
		});
		character_background.on("pointerup", ()=> {
			
		});
		
		
		character_name_textbox.setInteractive();
		character_name_textbox.on("pointerover", ()=> {
			character_name_textbox_focus.setVisible(true);
		});
		character_name_textbox.on("pointerout", ()=> {
			character_name_textbox_focus.setVisible(false);
		});
		character_name_textbox.on("pointerup", ()=> {
			focus_textbox = true;
		});
		
		
		
		startButton.setInteractive();
		startButton.on("pointerover", ()=> {
			startHoverButton.setVisible(true);
		});
		startButton.on("pointerout", ()=> {
			startHoverButton.setVisible(false);
		});
		startButton.on("pointerup", ()=> {
			this.sound.pauseAll();
			console.log("starting game scene");
			this.scene.start('game_scene', {socket:this.socket});
			this.scene.stop('character_scene');
			console.log("stopped title scene");
		});
		
		settingsButton.setInteractive();
		settingsButton.on("pointerover", ()=> {
			settingsHoverButton.setVisible(true);
		});
		settingsButton.on("pointerout", ()=> {
			settingsHoverButton.setVisible(false);
		});
		settingsButton.on("pointerup", ()=> {
			console.log("starting settings scene");
			this.scene.start('settings_scene', {socket:this.socket});
		});
		
		this.toggle = {
			'a':true, 
			'b':true,
			'c':true,
			'd':true,
			'e':true,
			'f':true,
			'g':true,
			'h':true,
			'i':true,
			'j':true,
			'k':true,
			'l':true,
			'm':true,
			'n':true,
			'o':true,
			'p':true,
			'q':true,
			'r':true,
			's':true,
			't':true,
			'u':true,
			'v':true,
			'w':true,
			'x':true,
			'y':true,
			'z':true,
			'backspace':true
		}
	}
    update () {
		if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE).isDown) {
			if(this.toggle['backspace']) {
				this.character_name_text.text = this.character_name_text.text.substring(0,this.character_name_text.text.length - 1);
				this.toggle['backspace'] = false;
			}
		}
		if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE).isDown) {
			this.toggle['backspace'] = true;
		}
		
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G).isDown) {
			if(this.toggle['g']) {
				this.character_name_text.text += "g";
				this.toggle['g'] = false;
			}
		}
		if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G).isDown) {
			this.toggle['g'] = true;
		}
    }
}