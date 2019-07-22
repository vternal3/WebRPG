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
		var self = this;
		this.socket.emit('requestSettings');

		this.settings = {};
		this.settings_text = {};
		this.characterImages = {};
		
		let background = this.add.image(this.game.renderer.width / 2 - 544, 0, 'title_bg').setOrigin(0).setScale(4);

		
		this.pause_on_blur_checkbox = new checkbox(this.game.renderer.width / 2 - 250,100,0.1,false,this);
		var pause_on_blur_text = this.add.text(this.game.renderer.width / 2 - 230, 90, "Pause On Blur", {
			fontSize: '36px',
			fill: '#000000'
		});

		this.fullscreen_checkbox = new checkbox(this.game.renderer.width / 2 - 250,150,0.1,false,this);
		var fullscreen_text = this.add.text(this.game.renderer.width / 2 - 230, 140, "Full Screen", {
			fontSize: '36px',
			fill: '#000000'
		});

		this.showFPS_checkbox = new checkbox(this.game.renderer.width / 2 - 250,200,0.1,false,this);
		var showFPS_text = this.add.text(this.game.renderer.width / 2 - 230, 190, "Show FPS", {
			fontSize: '36px',
			fill: '#000000'
		});

		this.showPing_checkbox = new checkbox(this.game.renderer.width / 2 - 250,250,0.1,false,this);
		var showPing_text = this.add.text(this.game.renderer.width / 2 - 230, 240, "Show Ping", {
			fontSize: '36px',
			fill: '#000000'
		});

		this.showPlayerCount_checkbox = new checkbox(this.game.renderer.width / 2 - 250,300,0.1,false,this);
		var showPlayerCount_text = this.add.text(this.game.renderer.width / 2 - 230, 290, "Show Player Count", {
			fontSize: '36px',
			fill: '#000000'
		});

		
		var musicVolume_text = this.add.text(this.game.renderer.width / 2 - 230, 340, "Music Volume", {
			fontSize: '36px',
			fill: '#000000'
		});
		this.musicVolume_slider = new slider(Math.floor(musicVolume_text.x + musicVolume_text.width),340,400,4,0,"h", this);
		this.musicVolumeNum_text = this.add.text(this.musicVolume_slider.x + this.musicVolume_slider.width, 340, "0", {
			fontSize: '36px',
			fill: '#000000'
		});

		var soundVolume_text = this.add.text(this.game.renderer.width / 2 - 230, 390, "Sound Volume", {
			fontSize: '36px',
			fill: '#000000'
		});
		this.soundVolume_slider = new slider(Math.floor(soundVolume_text.x + soundVolume_text.width),390,400,4,0,"h", this);
		this.soundVolumeNum_text = this.add.text(this.soundVolume_slider.x + this.soundVolume_slider.width, 390, "0", {
			fontSize: '36px',
			fill: '#000000'
		});

		this.socket.on('settings', function (settings) {
			console.log(settings);
			self.settings = settings;
			self.pause_on_blur_checkbox.setValue(settings["pause_on_blur"]);
			self.fullscreen_checkbox.setValue(settings["fullscreen"]);
			self.showFPS_checkbox.setValue(settings["show_fps"]);
			self.showPing_checkbox.setValue(settings["show_ping"]);
			self.showPlayerCount_checkbox.setValue(settings["show_player_count"]);
			self.musicVolume_slider.setValue(settings["music_volume"] * 100 * 4);
			self.musicVolumeNum_text.text = settings["music_volume"] * 100 * 4;
			self.soundVolume_slider.setValue(settings["sound_volume"] * 100 * 4);
			self.soundVolumeNum_text.text = settings["sound_volume"] * 100 * 4;
		});

		let settingsButton = this.add.image(this.game.renderer.width - 64, 546, "settings");
		let settingsHoverButton = this.add.image(this.game.renderer.width - 64, 546, "settings_hover");
		
		settingsButton.setInteractive();
		settingsButton.on("pointerover", () => {
			settingsHoverButton.setVisible(true);
		});
		settingsButton.on("pointerout", () => {
			settingsHoverButton.setVisible(false);
		});
		settingsButton.on("pointerup", () => {
			console.log("starting character scene");
			document.getElementById('myText').style.display = "initial";
			this.scene.start('character_scene', { socket: this.socket });
		});


		let saveButton = this.add.image(this.game.renderer.width / 2, 546, "save_settings");
		let saveHoverButton = this.add.image(this.game.renderer.width / 2, 546, "save_settings_hover");
		
		saveButton.setInteractive();
		saveButton.on("pointerover", () => {
			saveHoverButton.setVisible(true);
		});
		saveButton.on("pointerout", () => {
			saveHoverButton.setVisible(false);
		});
		saveButton.on("pointerup", () => {
			console.log("saved settings");
			var settings = {
				fullscreen: self.fullscreen_checkbox.getValue() ? 1 : 0,
				music_volume: self.musicVolume_slider.getValue() / 100 / 4,
				pause_on_blur: self.pause_on_blur_checkbox.getValue() ? 1 : 0,
				show_fps: self.showFPS_checkbox.getValue() ? 1 : 0,
				show_ping: self.showPing_checkbox.getValue() ? 1 : 0,
				show_player_count: self.showPlayerCount_checkbox.getValue() ? 1 : 0,
				sound_volume: self.soundVolume_slider.getValue() / 100 / 4,
			};
			this.socket.emit('saveSettings', settings);
		});
    }

	
    update () {
        if(this.pause_on_blur_checkbox.value){
			console.log("pause on blur: true");
		}
		if(this.fullscreen_checkbox.value) {
			console.log("full screen: true");
		}
		if(this.showFPS_checkbox.value) {
			console.log("show fps: true");
		}
		if(this.showPing_checkbox.value) {
			console.log("show ping: true");
		}
		if(this.showPlayerCount_checkbox.value) {
			console.log("show player count: true");
		}
		console.log("Music Volume: " + this.musicVolume_slider.getValue());
		console.log("Sound Volume: " + this.soundVolume_slider.getValue());
		this.musicVolumeNum_text.text = this.musicVolume_slider.getValue() / 4;
		this.soundVolumeNum_text.text = this.soundVolume_slider.getValue() / 4;
    }
}

class checkbox {
	constructor(x,y,size,initalValue,scene) {
		this.value = initalValue;

		console.log(scene);

		this.checked_checkbox = scene.add.image(x, y, 'checked_checkbox').setScale(size);
		this.unchecked_checkbox = scene.add.image(x, y, 'unchecked_checkbox').setScale(size);
		this.hover_checkbox = scene.add.image(x, y, 'hover_checkbox').setScale(size);

		this.hover_checkbox.setVisible(false);
		this.unchecked_checkbox.setVisible(true);
		this.checked_checkbox.setVisible(false);

		if(this.value) {
			this.checked_checkbox.setInteractive();
		} else {
			this.unchecked_checkbox.setInteractive();
		}
		
		this.unchecked_checkbox.on("pointerover", () => {
			this.hover_checkbox.setVisible(true);
		});
		this.unchecked_checkbox.on("pointerout", () => {
			this.hover_checkbox.setVisible(false);
		});
		this.unchecked_checkbox.on("pointerup", () => {
			this.unchecked_checkbox.setVisible(false);
			this.checked_checkbox.setInteractive();
			this.checked_checkbox.setVisible(true);
			this.value = true;
		});

		this.checked_checkbox.on("pointerover", () => {
			this.hover_checkbox.setVisible(true);
		});
		this.checked_checkbox.on("pointerout", () => {
			this.hover_checkbox.setVisible(false);
		});
		this.checked_checkbox.on("pointerup", () => {
			this.checked_checkbox.setVisible(false);
			this.unchecked_checkbox.setInteractive();
			this.unchecked_checkbox.setVisible(true);
			this.value = false;
		});
	}
	setValue(value) {
		this.value = value;
		if(this.value) {
			this.unchecked_checkbox.setVisible(false);
			this.checked_checkbox.setVisible(true);
			this.checked_checkbox.setInteractive();
		}
		else {
			this.unchecked_checkbox.setVisible(true);
			this.unchecked_checkbox.setInteractive();
			this.checked_checkbox.setVisible(false);
		}
	}
	getValue() {
		return this.value;
	}
}

class slider {
	constructor(x, y, length, step, initialValue, orientation, scene) {
		var self = this;
		this.x = x;
		this.y = y;
		this.orientation = orientation;
		this.trackImage = scene.add.sprite(x, y, 'track').setOrigin(0,0);
		this.width = this.trackImage.width;
		this.barImage = scene.add.sprite(x, y - 5, 'bar').setOrigin(0,0).setInteractive();
		this.barImage.step = step;
		this.barImage.value = initialValue;
		this.barImage.track_length = this.trackImage.width;
		this.barImage.x_pos = x;

		this.barImage.on('pointerover', function () {
			self.barImage.setTexture('bar_hover');
		});
	
		this.barImage.on('pointerout', function () {
			self.barImage.setTexture('bar');
		});

		scene.input.setDraggable(this.barImage);

		scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
			var step = gameObject.step;
			if(step < 2) {
				var calculation = Math.round(dragX);
				if(calculation >= gameObject.x_pos && calculation <= gameObject.x_pos + gameObject.track_length) {
					gameObject.x = calculation;
					gameObject.value = calculation - gameObject.x_pos;
				}
			} else {
				var mod = dragX % step;
				if (mod != 0) {
					if (mod < step / 2) {
						var calculation = Math.floor(dragX / step) * step;
						if(calculation >= gameObject.x_pos && calculation <= gameObject.x_pos + gameObject.track_length) {
							gameObject.value = gameObject.x = calculation
							gameObject.value = gameObject.value - gameObject.x_pos;
						}
					} else if (mod >= step / 2) {
						var calculation = Math.ceil(dragX / step) * step;
						if(calculation >= gameObject.x_pos && calculation <= gameObject.x_pos + gameObject.track_length) {
							gameObject.value = gameObject.x = calculation;
							gameObject.value = gameObject.value - gameObject.x_pos;
						}
					}
				}
			}
		});
	}
	
	getValue() {
		console.log("getvalue: " + this.barImage.value);
		return Math.round(this.barImage.value);
	}
	setValue(value) {
		this.barImage.value = value;
		this.barImage.x = value + this.barImage.x_pos;
	}
}