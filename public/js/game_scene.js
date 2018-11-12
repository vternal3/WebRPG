class game_scene extends Phaser.Scene {
	constructor() {
		super({
			key: 'game_scene'
		});
	}
	init(data) {
		this.socket = data.socket;
	}
	preload() {
		console.log("Game");
	}

	create() {
		var self = this;

		this.socket.emit('game_start');

		this.socket.emit('requestEmail');

		this.socket.on('emailSent', function (email) {
			self.nameText.setText(email);
			self.player.name = email;
		});

		this.otherPlayers = this.physics.add.group();
		this.otherPlayersName = {};

		var music = this.sound.add('theme_music');
		music.play({
			loop: true
		});
		this.sound.pauseOnBlur = false;

		this.player = this.physics.add.sprite(400, 300, 'walk_template');
		this.player.setDepth(11);

		this.anims.create({
			key: 'idle',
			frames: [{
					key: 'walk_template',
					frame: 8
				}
			],
			frameRate: 20
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

		let ui_upscaled = this.add.sprite(0, 0, "ui_upscaled").setOrigin(0).setDepth(11);

		//this.cameras.main.zoom = 2;

		const map3 = this.make.tilemap({
				key: "map3"
			});
		const tileset2 = map3.addTilesetImage("trees2", "tiles2");
		const tileset3 = map3.addTilesetImage("grass", "grass2");

		const middle = map3.createStaticLayer("middle", tileset2, 0, 0);
		middle.setDepth(10);
		const bottom = map3.createStaticLayer("bottom", tileset3, 0, 0);

		this.socket.on('currentPlayers', function (players) {
			Object.keys(players).forEach(function (id) {
				if (players[id].playerId === self.socket.id) {
					addPlayer(self, players[id]);
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

		this.socket.on('playerMoved', function (playerInfo) {
			self.otherPlayers.getChildren().forEach(function (otherPlayer) {
				if (playerInfo.playerId === otherPlayer.playerId) {
					otherPlayer.direction = playerInfo.direction;
					otherPlayer.setPosition(playerInfo.x, playerInfo.y);
					//set player email above player's head.
					self.otherPlayersName[playerInfo.playerId].setText(playerInfo.name);
					self.otherPlayersName[playerInfo.playerId].x = otherPlayer.x - self.otherPlayersName[playerInfo.playerId].width / 2;
					self.otherPlayersName[playerInfo.playerId].y = otherPlayer.y - 55 - 12;
					switch (otherPlayer.direction) {
					case 0:
						otherPlayer.anims.play('up', true);
						break;
					case 1:
						otherPlayer.anims.play('upRight', true);
						break;
					case 2:
						otherPlayer.anims.play('right', true);
						break;
					case 3:
						otherPlayer.anims.play('downRight', true);
						break;
					case 4:
						otherPlayer.anims.play('down', true);
						break;
					case 5:
						otherPlayer.anims.play('downLeft', true);
						break;
					case 6:
						otherPlayer.anims.play('left', true);
						break;
					case 7:
						otherPlayer.anims.play('upLeft', true);
						break;
					case 8:
						otherPlayer.anims.play('idle');
						break;
					}
				}
			});
		});

		this.cursors = this.input.keyboard.createCursorKeys();

		this.nameText = this.add.text(292, 16, '', {
				fontSize: '12px',
				fill: '#00FF00'
			});
		this.nameText.setDepth(11);

		//Go back to the Title scene and disconnects it socket
		this.input.keyboard.on('keydown_ESC', function () {
			this.sound.pauseAll();
			this.scene.stop('game_scene');
			this.socket.disconnect()
			window.location.href = "https://webrpg.io";
		}, this);

		var combo = this.input.keyboard.createCombo('asd', {
				maxKeyDelay: 1000,
				resetOnMatch: true
			});

		this.input.keyboard.on('keycombomatch', function (event) {

			console.log('You typed phaser quickly!');

		});
	}

	update() {
		if (this.player) {
			velocity_x = 0;
			velocity_y = 0;
			if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G).isDown) {
				console.log("select");
				this.socket.emit('select');
			}
			if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H).isDown) {
				console.log("start");
				this.socket.emit('start');
			}
			if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown) {
				console.log("A");
				this.socket.emit('A');
			}
			if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S).isDown) {
				console.log("B");
				this.socket.emit('B');
			}
			if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown) {
				console.log("X");
				this.socket.emit('X');
			}
			if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown) {
				console.log("Y");
				this.socket.emit('Y');
			}
			if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q).isDown) {
				console.log("left_tab");
				this.socket.emit('left_tab');
			}
			if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E).isDown) {
				console.log("right_tab");
				this.socket.emit('right_tab');
			}

			if (this.cursors.up.isDown) {
				direction = 0; //up
				velocity_y -= velocity_speed;
			}
			if (this.cursors.down.isDown) {
				direction = 4; //down
				velocity_y += velocity_speed;
			}
			if (this.cursors.left.isDown) {
				direction = 6; //left
				velocity_x -= velocity_speed;
			}
			if (this.cursors.right.isDown) {
				direction = 2; //right
				velocity_x += velocity_speed;
			}

			if (this.cursors.up.isDown && this.cursors.left.isDown) {
				direction = 7; //up left
				var speed = Math.round((Math.sqrt(2) / 2) * -velocity_speed);
				velocity_x = speed
					velocity_y = speed;
			}
			if (this.cursors.up.isDown && this.cursors.right.isDown) {
				direction = 1; //up right
				velocity_x = Math.round((Math.sqrt(2) / 2) * velocity_speed);
				velocity_y = Math.round((Math.sqrt(2) / 2) * -velocity_speed);
			}
			if (this.cursors.down.isDown && this.cursors.left.isDown) {
				direction = 5; //down left
				velocity_x = Math.round((Math.sqrt(2) / 2) * -velocity_speed);
				velocity_y = Math.round((Math.sqrt(2) / 2) * velocity_speed);
			}
			if (this.cursors.down.isDown && this.cursors.right.isDown) {
				direction = 3; //down right
				var speed = Math.round((Math.sqrt(2) / 2) * velocity_speed);
				velocity_x = speed
					velocity_y = speed;
			}

			if (this.cursors.down.isDown && this.cursors.up.isDown) {
				direction = 8; //idle
				velocity_x = 0;
				velocity_y = 0;
			}
			if (this.cursors.left.isDown && this.cursors.right.isDown) {
				direction = 8; //idle
				velocity_x = 0;
				velocity_y = 0;
			}

			if (this.cursors.up.isDown && this.cursors.right.isDown && this.cursors.down.isDown) {
				direction = 2; //right
				velocity_x = velocity_speed;
				velocity_y = 0;
			}
			if (this.cursors.right.isDown && this.cursors.down.isDown && this.cursors.left.isDown) {
				direction = 4; //down
				velocity_x = 0;
				velocity_y = velocity_speed;
			}
			if (this.cursors.down.isDown && this.cursors.left.isDown && this.cursors.up.isDown) {
				direction = 6; //left
				velocity_x = -velocity_speed;
				velocity_y = 0;
			}
			if (this.cursors.left.isDown && this.cursors.up.isDown && this.cursors.right.isDown) {
				direction = 0; //up
				velocity_x = 0;
				velocity_y = -velocity_speed;
			}

			if (!this.cursors.down.isDown && !this.cursors.up.isDown && !this.cursors.right.isDown && !this.cursors.left.isDown ||
				this.cursors.down.isDown && this.cursors.up.isDown && this.cursors.right.isDown && this.cursors.left.isDown) {
				direction = 8;
				velocity_x = 0;
				velocity_y = 0;
			}

			this.player.setVelocityX(velocity_x);
			this.player.setVelocityY(velocity_y);
			this.player.direction = direction;

			switch (direction) {
			case 0:
				this.player.anims.play('up', true);
				console.log("up");
				this.socket.emit('up');
				break;
			case 1:
				this.player.anims.play('upRight', true);
				console.log("upRight");
				this.socket.emit('upRight');
				break;
			case 2:
				this.player.anims.play('right', true);
				console.log("right");
				this.socket.emit('right');
				break;
			case 3:
				this.player.anims.play('downRight', true);
				console.log("downRight");
				this.socket.emit('downRight');
				break;
			case 4:
				this.player.anims.play('down', true);
				console.log("down");
				this.socket.emit('down');
				break;
			case 5:
				this.player.anims.play('downLeft', true);
				console.log("downLeft");
				this.socket.emit('downLeft');
				break;
			case 6:
				this.player.anims.play('left', true);
				console.log("left");
				this.socket.emit('left');
				break;
			case 7:
				this.player.anims.play('upLeft', true);
				console.log("upLeft");
				this.socket.emit('upLeft');
				break;
			case 8:
				this.player.anims.play('idle');
				//console.log("idle");
				//this.socket.emit('idle');
				break;
			}
			this.nameText.x = this.player.x - this.nameText.width / 2;
			this.nameText.y = this.player.y - 55 - 12;
			// emit player movement
			var x = this.player.x;
			var y = this.player.y;
			var d = this.player.direction;
			if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y || d !== this.player.oldPosition.direction)) {
				this.socket.emit('playerMovement', {
					x: this.player.x,
					y: this.player.y,
					direction: this.player.direction,
					name: this.player.name
				});
			}

			// save old position data
			this.player.oldPosition = {
				x: this.player.x,
				y: this.player.y,
				direction: this.player.direction,
				name: name
			};
		}
	}
}
var name = '';
var agvel = 0;
var direction = 0; //0:up, 1:upRight, 2:right, 3:downRight, 4:down, 5:downLeft, 6:left, 7:upLeft
var velocity_x = 0;
var velocity_y = 0;
var velocity_speed = 160;
function addPlayer(self, playerInfo) {}

function addOtherPlayers(self, playerInfo) {
	const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'walk_template');
	otherPlayer.setDepth(11);
	otherPlayer.playerId = playerInfo.playerId;
	self.otherPlayers.add(otherPlayer);
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