class bullet {
	
	constructor(x, y, angle, type, essence) {
		this.type = type;
		this.essence = essence;
		this.x = x;
		this.y = y;
		this.spdX = Math.cos(angle/180*Math.PI);
		this.spdY = Math.sin(angle/180*Math.PI);
		this.angle = angle;
		this.alive = false;
		this.bullet_speed = 0.5;
	}
	update(delta){
		this.x += this.spdX * delta * this.bullet_speed;
		this.y += this.spdY * delta * this.bullet_speed;
	}

}

class game_scene extends Phaser.Scene {
	constructor() {
		super({
			key: 'game_scene'
		});
	}
	init(data) {
		this.socket = data.socket;
		this.character_name = data.character_name;
	}
	preload() {
		console.log("Game");
	}

	resize() {
		this.screen_center_x = Math.round(window.innerWidth / 2);
		this.screen_center_y = Math.round(window.innerHeight / 2);
		this.map_center_x = Math.round(this.cameras.main.centerX - (this.mapInfinite.widthInPixels / 2));
		this.map_center_y =  Math.round(this.cameras.main.centerY - (this.mapInfinite.heightInPixels / 2));
		this.player.x = this.screen_center_x;
		this.player.y = this.screen_center_y;
	}

	create() {
		var self = this;

		
		this.fullscreen = false;
		this.showFPS = false;
		this.showPing = false;
		this.showPlayerCount = false;

		window.addEventListener("resize", this.resize.bind(this), false);
		
		this.startTime;

		setInterval(function() {
			self.startTime = Date.now();
			self.socket.emit('latency_ping');
		}, 3000);

		this.socket.on('latency_pong', function() {
			var latency = Date.now() - self.startTime;
			if(self.showPing) {
				console.log("ping: " + latency + " ms");
			}
		});
		this.socket.on('player_count', function(count) {
			if(self.showPlayerCount){
				console.log("player Count: " + count);
			}
		});
		this.socket.emit('requestGameSettings');
		this.socket.on('gameSettings', function (settings) {
			self.sound.pauseOnBlur = settings["pause_on_blur"] ? true : false;
			self.music.volume = settings["music_volume"];
			self.sound.volume = settings["sound_volume"];
			self.fullscreen = settings["fullscreen"] ? true : false;
			self.showFPS = settings["show_fps"] ? true : false;
			self.showPing = settings["show_ping"] ? true : false;
			self.showPlayerCount = settings["show_player_count"] ? true : false;
			if(self.fullscreen) {
				self.scale.startFullscreen();
			}
			console.log("got settings: " + settings);
		});
		this.socket.emit('game_start', this.character_name);

		
		//Music Code
		this.music = this.sound.add('theme_music');
		this.music.play({
			loop: true
		});
		this.music.volume = 0.1;
		this.sound.pauseOnBlur = true;

		//Player Code
		this.screen_center_x = Math.round(window.innerWidth / 2);
		this.screen_center_y = Math.round(window.innerHeight / 2);
		this.player = this.physics.add.sprite(this.screen_center_x, this.screen_center_y, 'walk_template');
		this.player.setDepth(11);

		this.bullet = this.physics.add.sprite(0,0, 'bullet');
		this.bullet2 = this.physics.add.sprite(0,0, 'bullet2');
		this.bullet3 = this.physics.add.sprite(0,0, 'bullet3');
		this.bullet.visible = false;
		this.bullet2.visible = false;
		this.bullet3.visible = false;


		//Other Players Code
		this.otherPlayers = this.physics.add.group();
		this.otherPlayersPositions = {};
		this.otherPlayersName = {};
		this.optimizedOP = {};

		//Directional Animation Code
		//TODO: make a load from JSON function for all animations in the area
		//the player is located at.
		// this.anims.create({
		// 	key: 'idle',
		// 	frames: [{
		// 		key: 'walk_template',
		// 		frame: 8
		// 	}
		// 	],
		// 	frameRate: 20
		// });
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers('walk_template', {
				start: 8,
				end: 8
			}),
			repeat: -1,
			frameRate: 15
		});
		this.anims.create({
			key: 'downLeft',
			frames: this.anims.generateFrameNumbers('walk_template', {
				start: 0,
				end: 7
			}),
			repeat: -1,
			frameRate: 15
		});
		this.anims.create({
			key: 'down',
			frames: this.anims.generateFrameNumbers('walk_template', {
				start: 8,
				end: 15
			}),
			repeat: -1,
			frameRate: 15
		});
		this.anims.create({
			key: 'downRight',
			frames: this.anims.generateFrameNumbers('walk_template', {
				start: 16,
				end: 23
			}),
			repeat: -1,
			frameRate: 15
		});
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('walk_template', {
				start: 24,
				end: 31
			}),
			repeat: -1,
			frameRate: 15
		});
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('walk_template', {
				start: 32,
				end: 39
			}),
			repeat: -1,
			frameRate: 15
		});
		this.anims.create({
			key: 'upLeft',
			frames: this.anims.generateFrameNumbers('walk_template', {
				start: 40,
				end: 47
			}),
			repeat: -1,
			frameRate: 15
		});
		this.anims.create({
			key: 'up',
			frames: this.anims.generateFrameNumbers('walk_template', {
				start: 48,
				end: 55
			}),
			repeat: -1,
			frameRate: 15
		});
		this.anims.create({
			key: 'upRight',
			frames: this.anims.generateFrameNumbers('walk_template', {
				start: 56,
				end: 63
			}),
			repeat: -1,
			frameRate: 15
		});
		//this.anims.remove('upRight');
		
		// console.log(this.anims.anims.entries);

		//let ui_upscaled = this.add.sprite(0, 0, "ui_upscaled").setOrigin(0).setDepth(11);

		

		this.mapInfinite = this.make.tilemap({
			key: "mapInfinite"
		});
		const tileset1 = this.mapInfinite.addTilesetImage("grassTiles", "grass1");

		//console.log(map3);
		this.map_center_x = Math.round(this.cameras.main.centerX - (this.mapInfinite.widthInPixels / 2));
		this.map_center_y = Math.round(this.cameras.main.centerY - (this.mapInfinite.heightInPixels / 2));

		this.mapInfiniteLayer1 = this.mapInfinite.createStaticLayer("layer_1", tileset1, this.map_center_x, this.map_center_x);
		this.mapInfiniteLayer1.setDepth(5);

		this.nameText = this.add.text(292, 16, '', {
			fontSize: '12px',
			fill: '#00FF00'
		});
		this.nameText.setDepth(11);
		
		this.socket.on('currentPlayers', function (players) {
			Object.keys(players).forEach(function (id) {
				if (players[id].playerId === self.socket.id) {
					addPlayer(self, players[id]);
					self.mapInfiniteLayer1.x = -players[id].x + self.map_center_x;
					self.mapInfiniteLayer1.y = -players[id].y + self.map_center_y;
					self.nameText.text = players[id].name;
				} else {
					addOtherPlayers(self, players[id]);
				}
			});
		});

		this.socket.on('newPlayer', function (playerInfo) {
			addOtherPlayers(self, playerInfo);
		});

		this.socket.on('disconnect', function (playerId) {
			self.otherPlayers.getChildren().forEach(function (otherPlayer) {
				if (playerId === otherPlayer.playerId) {
					otherPlayer.destroy();
					self.otherPlayersName[otherPlayer.playerId].destroy();
				}
			});
		});

		this.socket.on('status_update', function(players){
			for(var playerInfo in players) {
				var id = players[playerInfo].playerId;
				if (id != self.socket.id && self.optimizedOP[id]) {
					self.optimizedOP[id].direction = players[playerInfo].direction;
					self.otherPlayersPositions[self.optimizedOP[id].playerId]= {x:self.screen_center_x + players[playerInfo].x,y:self.screen_center_y + players[playerInfo].y};
					
					//set other player's name above player's head.
					self.otherPlayersName[id].x = self.optimizedOP[id].x - self.otherPlayersName[id].width / 2;
					self.otherPlayersName[id].y = self.optimizedOP[id].y - 55 - 12;
					switch (self.optimizedOP[id].direction) {
						case 0:
							self.optimizedOP[id].anims.play('up', true);
							break;
						case 1:
							self.optimizedOP[id].anims.play('upRight', true);
							break;
						case 2:
							self.optimizedOP[id].anims.play('right', true);
							break;
						case 3:
							self.optimizedOP[id].anims.play('downRight', true);
							break;
						case 4:
							self.optimizedOP[id].anims.play('down', true);
							break;
						case 5:
							self.optimizedOP[id].anims.play('downLeft', true);
							break;
						case 6:
							self.optimizedOP[id].anims.play('left', true);
							break;
						case 7:
							self.optimizedOP[id].anims.play('upLeft', true);
							break;
						case 8:
							self.optimizedOP[id].anims.play('idle');
							break;
					}
				}
				if(id === self.socket.id) {
					self.mapInfiniteLayer1.x = -players[playerInfo].x + self.map_center_x;
					self.mapInfiniteLayer1.y = -players[playerInfo].y + self.map_center_y;
				}
			}
		});

		//Go back to the Title scene and disconnects it socket
		this.input.keyboard.on('keydown_ESC', function () {
			//TODO: Open up a settings tab menu in the center of the screen
			//with all the settings in their approriate tabs.
			window.location.href = "https://webrpg.io";
		}, this);

		var combo = this.input.keyboard.createCombo([Phaser.Input.Keyboard.KeyCodes.A, Phaser.Input.Keyboard.KeyCodes.S, Phaser.Input.Keyboard.KeyCodes.D], {
			maxKeyDelay: 1000,
			resetOnMatch: true
		});
		var combo2 = this.input.keyboard.createCombo('ee', {
			maxKeyDelay: 1000,
			resetOnMatch: true
		});
		

		this.input.keyboard.on('keycombomatch', function (event) {
			if (event["keyCodes"][0] == Phaser.Input.Keyboard.KeyCodes.A &&
				event["keyCodes"][1] == Phaser.Input.Keyboard.KeyCodes.S &&
				event["keyCodes"][2] == Phaser.Input.Keyboard.KeyCodes.D) {
				console.log("ASD Success");
			}
			if (event["keyCodes"][0] == Phaser.Input.Keyboard.KeyCodes.E &&
				event["keyCodes"][1] == Phaser.Input.Keyboard.KeyCodes.E) {
				console.log("EE success");
			}
		});

		this.direction_toggles = 
		{
			"up"		: true,
			"upRight"	: true,
			"right"		: true,
			"downRight"	: true,
			"down"		: true,
			"downLeft"	: true,
			"left"		: true,
			"upLeft"	: true,
			"idle"		: true,
		}
		this.time_interval_counter = 0;
		this.shot_interval_counter = 0;

		this.leftPressed = false;
		this.input.on('pointerup', function (pointer) {
			if(game.input.activePointer.buttons == 0) {
				self.leftPressed = false;
			}
		});
		this.input.on('pointerdown', function (pointer) {
			if(game.input.activePointer.buttons == 1) {
				self.leftPressed = true;
			}
		});

		this.player_bullets = [];
	}

	//sets all direction toggles to true except the direction passed in.
	update_direction_toggles(direction) {
		for(var direction_toggle in this.direction_toggles) {
			if(direction_toggle != direction){
				this.direction_toggles[direction_toggle] = true;
			}
		}
	}
	
	update() {
		//calculate delta time
		start_time = Date.now();
		delta_time = start_time - end_time;
		end_time = start_time;
		this.time_interval_counter += delta_time;
		this.shot_interval_counter += delta_time;
		if(this.time_interval_counter > 3000){
			if(this.showFPS) {
				console.log("FPS: " + game.loop.actualFps);
			}
			this.time_interval_counter = 0;
		}

		// Bullet Spell
		if(this.shot_interval_counter > 1000 && this.leftPressed) { //left mouse button is pressed
			//send the x and y cordinates to the server requesting to shoot
			//check on client side if the shot interval time has been enough
			//check on server side if shot interval has been long enough and reject 
			//shot emits if time hasn't be long enough between shots.
			this.socket.emit("player_cast", {x:game.input.activePointer.x, y:game.input.activePointer.y, type:this.bullet.type})
			console.log("x: " + game.input.activePointer.x + " y: " + game.input.activePointer.y);
			this.leftPressed = false;
			this.shot_interval_counter = 0;

			var angle = Math.atan2(game.input.activePointer.x, game.input.activePointer.y) / Math.PI * 180;
			angle = Math.atan2(10+game.input.activePointer.y - this.player.y, 10+game.input.activePointer.x - this.player.x) / Math.PI * 180;
			this.player_bullets[0] = new bullet(this.player.x - this.mapInfiniteLayer1.x + this.map_center_x, this.player.y - this.mapInfiniteLayer1.y + this.map_center_y, angle);
			this.bullet.visible = true;
			this.bullet.setDepth(6);
			this.bullet.angle = angle - Math.PI * 90 + 10;
			// this.bullet.x = game.input.activePointer.x;
			// this.bullet.y = game.input.activePointer.y;

			// Additional Effects
			// - Logic: Essence (calculate how it impacts the object it is targeting)
			// - Visual: Add an animation variable to be ran in the for loop below to be displayed
			//  - Animation
			//  - Additional effects such as: speed, distance, special effects such as duplicating, etc..
			
		}

		// 2nd Spell
		if(this.shot_interval_counter > 1000 && this.input.keyboard.addKey(current_inputs["action_1"]["keycode"]).isDown)
		{
			//send the x and y cordinates to the server requesting to shoot
			//check on client side if the shot interval time has been enough
			//check on server side if shot interval has been long enough and reject 
			//shot emits if time hasn't be long enough between shots.

			this.socket.emit("player_cast", {x:game.input.activePointer.x, y:game.input.activePointer.y, type:this.bullet.type})
			console.log("x: " + game.input.activePointer.x + " y: " + game.input.activePointer.y);
			this.leftPressed = false;
			this.shot_interval_counter = 0;

			var angle = Math.atan2(game.input.activePointer.x, game.input.activePointer.y) / Math.PI * 180;
			angle = Math.atan2(10+game.input.activePointer.y - this.player.y, 10+game.input.activePointer.x - this.player.x) / Math.PI * 180;
			this.player_bullets[0] = new bullet(this.player.x - this.mapInfiniteLayer1.x + this.map_center_x, this.player.y - this.mapInfiniteLayer1.y + this.map_center_y, angle);
			this.bullet.visible = true;
			this.bullet.setDepth(6);
			this.bullet.angle = angle - Math.PI * 90 + 10;
			// this.bullet.x = game.input.activePointer.x;
			// this.bullet.y = game.input.activePointer.y;

		
			
		}

		// 3rd Spell
		if(this.shot_interval_counter > 1000 && this.input.keyboard.addKey(current_inputs["action_2"]["keycode"]).isDown)
		{
			//send the x and y cordinates to the server requesting to shoot
			//check on client side if the shot interval time has been enough
			//check on server side if shot interval has been long enough and reject 
			//shot emits if time hasn't be long enough between shots.
			this.socket.emit("player_cast", {x:game.input.activePointer.x, y:game.input.activePointer.y, type:this.bullet.type})
			console.log("x: " + game.input.activePointer.x + " y: " + game.input.activePointer.y);
			this.leftPressed = false;
			this.shot_interval_counter = 0;

			var angle = Math.atan2(game.input.activePointer.x, game.input.activePointer.y) / Math.PI * 180;
			angle = Math.atan2(10+game.input.activePointer.y - this.player.y, 10+game.input.activePointer.x - this.player.x) / Math.PI * 180;
			this.player_bullets[0] = new bullet(this.player.x - this.mapInfiniteLayer1.x + this.map_center_x, this.player.y - this.mapInfiniteLayer1.y + this.map_center_y, angle);
			this.bullet.visible = true;
			this.bullet.setDepth(6);
			this.bullet.angle = angle - Math.PI * 90 + 10;
			// this.bullet.x = game.input.activePointer.x;
			// this.bullet.y = game.input.activePointer.y;

			

		}

		// Updates the sprites location
		for(var key in this.player_bullets) {
			this.player_bullets[key].update(delta_time);
			this.bullet.x = this.player_bullets[key].x + this.mapInfiniteLayer1.x - this.map_center_x;
			this.bullet.y = this.player_bullets[key].y + this.mapInfiniteLayer1.y - this.map_center_y;			
		}

		//reset velocities to zero to remove previous calculations
		velocity_x = 0;
		velocity_y = 0;

		if (this.player) {
			if (this.input.keyboard.addKey(current_inputs["movement_1"]["keycode"]).isDown) {
				direction = 0; //up
				velocity_y = -velocity_speed;
			}
			if (this.input.keyboard.addKey(current_inputs["movement_3"]["keycode"]).isDown) {
				direction = 4; //down
				velocity_y = velocity_speed;
			}
			if (this.input.keyboard.addKey(current_inputs["movement_2"]["keycode"]).isDown) {
				direction = 6; //left
				velocity_x = -velocity_speed;
			}
			if (this.input.keyboard.addKey(current_inputs["movement_4"]["keycode"]).isDown) {
				direction = 2; //right
				velocity_x = velocity_speed;
			}

			if (this.input.keyboard.addKey(current_inputs["movement_1"]["keycode"]).isDown && 
				this.input.keyboard.addKey(current_inputs["movement_2"]["keycode"]).isDown) {
				direction = 7; //up left
				var speed = (Math.sqrt(2) / 2) * -velocity_speed;
				velocity_x = speed
				velocity_y = speed;
			}
			if (this.input.keyboard.addKey(current_inputs["movement_1"]["keycode"]).isDown && 
				this.input.keyboard.addKey(current_inputs["movement_4"]["keycode"]).isDown) {
				direction = 1; //up right
				velocity_x = (Math.sqrt(2) / 2) * velocity_speed;
				velocity_y = (Math.sqrt(2) / 2) * -velocity_speed;
			}
			if (this.input.keyboard.addKey(current_inputs["movement_3"]["keycode"]).isDown && 
				this.input.keyboard.addKey(current_inputs["movement_2"]["keycode"]).isDown) {
				direction = 5; //down left
				velocity_x = (Math.sqrt(2) / 2) * -velocity_speed;
				velocity_y = (Math.sqrt(2) / 2) * velocity_speed;
			}
			if (this.input.keyboard.addKey(current_inputs["movement_3"]["keycode"]).isDown && 
				this.input.keyboard.addKey(current_inputs["movement_4"]["keycode"]).isDown) {
				direction = 3; //down right
				var speed = (Math.sqrt(2) / 2) * velocity_speed;
				velocity_x = speed
				velocity_y = speed;
			}

			if (this.input.keyboard.addKey(current_inputs["movement_3"]["keycode"]).isDown && 
				this.input.keyboard.addKey(current_inputs["movement_1"]["keycode"]).isDown) {
				direction = 8; //idle
				velocity_x = 0;
				velocity_y = 0;
			}
			if (this.input.keyboard.addKey(current_inputs["movement_2"]["keycode"]).isDown && 
				this.input.keyboard.addKey(current_inputs["movement_4"]["keycode"]).isDown) {
				direction = 8; //idle
				velocity_x = 0;
				velocity_y = 0;
			}

			if (this.input.keyboard.addKey(current_inputs["movement_1"]["keycode"]).isDown && 
				this.input.keyboard.addKey(current_inputs["movement_4"]["keycode"]).isDown && 
				this.input.keyboard.addKey(current_inputs["movement_3"]["keycode"]).isDown) {
				direction = 2; //right
				velocity_x = velocity_speed;
				velocity_y = 0;
			}
			if (this.input.keyboard.addKey(current_inputs["movement_4"]["keycode"]).isDown && 
				this.input.keyboard.addKey(current_inputs["movement_3"]["keycode"]).isDown && 
				this.input.keyboard.addKey(current_inputs["movement_2"]["keycode"]).isDown) {
				direction = 4; //down
				velocity_x = 0;
				velocity_y = velocity_speed;
			}
			if (this.input.keyboard.addKey(current_inputs["movement_3"]["keycode"]).isDown && 
				this.input.keyboard.addKey(current_inputs["movement_2"]["keycode"]).isDown && 
				this.input.keyboard.addKey(current_inputs["movement_1"]["keycode"]).isDown) {
				direction = 6; //left
				velocity_x = -velocity_speed;
				velocity_y = 0;
			}
			if (this.input.keyboard.addKey(current_inputs["movement_2"]["keycode"]).isDown && 
				this.input.keyboard.addKey(current_inputs["movement_1"]["keycode"]).isDown && 
				this.input.keyboard.addKey(current_inputs["movement_4"]["keycode"]).isDown) {
				direction = 0; //up
				velocity_x = 0;
				velocity_y = -velocity_speed;
			}

			if (!this.input.keyboard.addKey(current_inputs["movement_3"]["keycode"]).isDown && 
				!this.input.keyboard.addKey(current_inputs["movement_1"]["keycode"]).isDown && 
				!this.input.keyboard.addKey(current_inputs["movement_4"]["keycode"]).isDown && 
				!this.input.keyboard.addKey(current_inputs["movement_2"]["keycode"]).isDown ||
				this.input.keyboard.addKey(current_inputs["movement_3"]["keycode"]).isDown && 
				this.input.keyboard.addKey(current_inputs["movement_1"]["keycode"]).isDown && 
				this.input.keyboard.addKey(current_inputs["movement_4"]["keycode"]).isDown && 
				this.input.keyboard.addKey(current_inputs["movement_2"]["keycode"]).isDown) {
				direction = 8;
				velocity_x = 0;
				velocity_y = 0;
			}

			switch (direction) {
				case 0:
					this.player.anims.play('up', true);
					if(this.direction_toggles["up"]) {
						//console.log("up");
						this.socket.emit('playerMoved', 0);
						this.direction_toggles["up"] = false;
						this.update_direction_toggles("up");
					}
					break;
				case 1:
					this.player.anims.play('upRight', true);
					if(this.direction_toggles["upRight"]) {
						//console.log("upRight");
						this.socket.emit('playerMoved', 1);
						this.direction_toggles["upRight"] = false;
						this.update_direction_toggles("upRight");
					}
					break;
				case 2:
					this.player.anims.play('right', true);
					if(this.direction_toggles["right"]) {
						//console.log("right");
						this.socket.emit('playerMoved', 2);
						this.direction_toggles["right"] = false;
						this.update_direction_toggles("right");
					}
					break;
				case 3:
					this.player.anims.play('downRight', true);
					if(this.direction_toggles["downRight"]) {
						//console.log("downRight");
						this.socket.emit('playerMoved', 3);
						this.direction_toggles["downRight"] = false;
						this.update_direction_toggles("downRight");
					}
					break;
				case 4:
					this.player.anims.play('down', true);
					if(this.direction_toggles["down"]) {
						//console.log("down");
						this.socket.emit('playerMoved', 4);
						this.direction_toggles["down"] = false;
						this.update_direction_toggles("down");
					}
					break;
				case 5:
					this.player.anims.play('downLeft', true);
					if(this.direction_toggles["downLeft"]) {
						//console.log("downLeft");
						this.socket.emit('playerMoved', 5);
						this.direction_toggles["downLeft"] = false;
						this.update_direction_toggles("downLeft");
					}
					break;
				case 6:
					this.player.anims.play('left', true);
					if(this.direction_toggles["left"]) {
						//console.log("left");
						this.socket.emit('playerMoved', 6);
						this.direction_toggles["left"] = false;
						this.update_direction_toggles("left");
					}
					break;
				case 7:
					this.player.anims.play('upLeft', true);
					if(this.direction_toggles["upLeft"]) {
						//console.log("upLeft");
						this.socket.emit('playerMoved', 7);
						this.direction_toggles["upLeft"] = false;
						this.update_direction_toggles("upLeft");
					}
					break;
				case 8:
					this.player.anims.play('idle');
					if(this.direction_toggles["idle"]) {
						//console.log("idle");
						this.socket.emit('playerMoved', 8);
						this.direction_toggles["idle"] = false;
						this.update_direction_toggles("idle");
					}
					break;
			}

			this.mapInfiniteLayer1.x += Math.round(delta_time * -velocity_x);
			this.mapInfiniteLayer1.y += Math.round(delta_time * -velocity_y);

			this.player.direction = direction;
			
			this.nameText.x = this.player.x - this.nameText.width / 2;
			this.nameText.y = this.player.y - 55 - 12;
			
			//put other player's world cordinates into local cordinates
			localizeOtherplayersPositions(this, this.mapInfiniteLayer1.x - this.map_center_x, this.mapInfiniteLayer1.y - this.map_center_y);
		}
	}
}

var direction = 0; //0:up, 1:upRight, 2:right, 3:downRight, 4:down, 5:downLeft, 6:left, 7:upLeft
var start_time = 0;
var end_time = 0;
var delta_time = 0;
var velocity_x = 0;
var velocity_y = 0;
var velocity_speed = 0.2;

function localizeOtherplayersPositions(self, x, y){
	self.otherPlayers.getChildren().forEach(function (otherPlayer) {
		if(self.socket.id != otherPlayer.playerId && self.otherPlayersPositions[otherPlayer.playerId])
			otherPlayer.setPosition(x + self.otherPlayersPositions[otherPlayer.playerId].x, y + self.otherPlayersPositions[otherPlayer.playerId].y);
			self.otherPlayersName[otherPlayer.playerId].x = otherPlayer.x - self.otherPlayersName[otherPlayer.playerId].width / 2;
			self.otherPlayersName[otherPlayer.playerId].y = otherPlayer.y - 55 - 12;
	});
}

function addPlayer(self, playerInfo) {}

function addOtherPlayers(self, playerInfo) {
	const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'walk_template');
	otherPlayer.setDepth(10);
	otherPlayer.playerId = playerInfo.playerId;
	self.otherPlayers.add(otherPlayer);

	self.otherPlayers.getChildren().forEach(function (otherPlayer) {
		self.optimizedOP[otherPlayer.playerId] = otherPlayer;
	});

	if (playerInfo.name.length) {
		self.otherPlayersName[playerInfo.playerId] = self.add.text(playerInfo.x - (8 * playerInfo.name.length / 2), playerInfo.y - 55 - 12, playerInfo.name, {
			fontSize: '12px',
			fill: '#00FF00'
		});
	} else {
		self.otherPlayersName[playerInfo.playerId] = self.add.text(playerInfo.x, playerInfo.y - 55 - 12, playerInfo.name, {
			fontSize: '12px',
			fill: '#00FF00'
		});
	}
	self.otherPlayersName[playerInfo.playerId].setDepth(11);
}