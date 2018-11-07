class game_scene extends Phaser.Scene {

    constructor () {
        super({key:'game_scene'});
    }

	preload() {
		console.log("Game");
	}
	
    create () {
		var self = this;
	
		this.socket = io();
		
		this.socket.emit('crpTokenHandshake', window.location.href.split(/[=,&]+/)[2]);
		
		this.otherPlayers = this.physics.add.group();
		
		// this.map = this.add.tilemap('level1');
		// var tileset = this.map.addTilesetImage('tiles_spritesheet','gameTiles');
		// this.backgroundLayer = this.map.createLayer('backgroundLayer', tileset);
		if(document.getElementsByClassName("addthis-smartlayers-desktop")[0]) {
			document.getElementsByClassName("addthis-smartlayers-desktop")[0].classList.add("nodisplay");
		}
		var music = this.sound.add('theme_music');
		music.play({loop:true});
		this.sound.play('theme_music',{loop:true});
		this.sound.pauseOnBlur = false;
		
		this.player = this.physics.add.sprite(400, 300, 'walk_template');
		//player.setScale(0.8);
		this.player.setDepth(11);
		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);
		this.player.body.setGravityY(0);
		
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
				key: 'idle',
				frames: [ { key: 'walk_template', frame: 8 } ],
				frameRate: 20
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
		
			
			
		//this.sound.loop = true;
		
		// Load a map from a 2D array of tile indices
	  const level = [
		[  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
		[  0,   1,   2,   3,   0,   0,   0,   1,   2,   3,   0 ],
		[  0,   5,   6,   7,   0,   0,   0,   5,   6,   7,   0 ],
		[  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
		[  0,   0,   0,  14,  13,  14,   0,   0,   0,   0,   0 ],
		[  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
		[  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
		[  0,   0,  14,  14,  14,  14,  14,   0,   0,   0,  15 ],
		[  0,   0,   0,   0,   0,   0,   0,   0,   0,  15,  15 ],
		[ 35,  36,  37,   0,   0,   0,   0,   0,  15,  15,  15 ],
		[ 39,  39,  39,  39,  39,  39,  39,  39,  39,  39,  39 ]
	  ];

	  //this.cameras.main.zoom = 2;
	  
	  // When loading from an array, make sure to specify the tileWidth and tileHeight
	  // const map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
	  // const tiles = map.addTilesetImage("mario-tiles");
	// const layer = map.createStaticLayer(0, tiles, 0, 0);

	// // When loading a CSV map, make sure to specify the tileWidth and tileHeight!
	  // const map2 = this.make.tilemap({ key: "map", tileWidth: 32, tileHeight: 32 });
	  // const tileset = map2.addTilesetImage("tiles");
	//const layer2 = map2.createStaticLayer(0, tileset, 0, 0).setOrigin(0); // layer index, tileset, x, y
		
		const map3 = this.make.tilemap({key: "map3"});
		// Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
		// Phaser's cache (i.e. the name you used in preload)
		const tileset2 = map3.addTilesetImage("trees2", "tiles2");
		const tileset3 = map3.addTilesetImage("grass", "grass2");
		
		// Parameters: layer name (or index) from Tiled, tileset, x, y
		const middle = map3.createStaticLayer("middle", tileset2, 0, 0);
		middle.setDepth(10);
		const bottom = map3.createStaticLayer("bottom", tileset3, 0, 0);
		
		//map3.setCollisionBetween(1, 999, true, 'middle');
		
	  // const belowLayer = map3.createStaticLayer("below", tileset2, 0, 0);
	  // const belowbelowLayer = map3.createStaticLayer("belowbelow", tileset2, 0, 0);
	  // belowLayer.setDepth(10);
	  // const worldLayer = map3.createStaticLayer("above", tileset2, 0, 0);
	// const aboveLayer = map3.createStaticLayer("Above Player", tileset2, 0, 0);
		
		
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
				}
				//TODO: test if this code actually will ever run. If ever you will receive a diconnect message from timeouts.
				//else if you don't ever execute this code delete it and this comment with in.
				if(playerId === self.socket.id) {
					location.reload();
				}
			});
		});
		
		this.socket.on('playerMoved', function (playerInfo) {
			self.otherPlayers.getChildren().forEach(function (otherPlayer) {
				if (playerInfo.playerId === otherPlayer.playerId) {
					otherPlayer.setRotation(playerInfo.rotation);
					otherPlayer.setPosition(playerInfo.x, playerInfo.y);
				}
			});
		});
		
		this.cursors = this.input.keyboard.createCursorKeys();
		
		this.blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#0000FF' });
		
		this.redScoreText = this.add.text(584, 16, '', { fontSize: '32px', fill: '#FF0000' });
		
		this.nameText = this.add.text(292, 16, '', { fontSize: '32px', fill: '#00FF00' });
		  
		this.socket.on('scoreUpdate', function (scores) {
			self.blueScoreText.setText('Blue: ' + scores.blue);
			self.redScoreText.setText('Red: ' + scores.red);
		});
		
		this.socket.on('starLocation', function (starLocation) {
			if (self.star) self.star.destroy();
			self.star = self.physics.add.image(starLocation.x, starLocation.y, 'star');
			self.physics.add.overlap(self.ship, self.star, function () {
				this.socket.emit('starCollected');
			}, null, self);
		});
		//send CRP Token to the server
		this.socket.emit('requestEmail', window.location.href.split(/[=,&]+/)[2]);
		
		this.socket.on('emailSent', function (email) {
			self.nameText.setText(email);
			//Removes the crp token params after the domain name.
			//window.history.pushState("object or string", "Clear return params", "/#");
			//Fades out the AddThis buttons
			document.getElementsByClassName("addthis-smartlayers-desktop")[0].classList.add("nodisplay");
		});
		//TODO: Send a one time token to request updates, then on server side 
		//set the socket id that is associated with the one time token as set
		//for heart beat refresh id... any other id that tries will be blocked
		//until the heart beat refresh has stopped recieving refresh requests 
		//from the socket id. Also login attempts to the account will be rejected
		//until the heart beat refresh has stopped and the account's live flag 
		//has been set to 0 (zero)
		
		this.input.keyboard.on('keydown_ESC', function(){
			this.sound.pauseAll();
			this.scene.stop('game_scene');
			this.socket.disconnect()
			this.scene.start('title_scene');
		}, this);
    }

    // agvel = 0;
	//once = 1;
	// var tick = 0;
	update() {
		// tick++;
		// if(tick > 300){
			// console.log("emitting stayalive");
			// this.socket.emit('stayalive');
			// tick = 0;
		// }
		//
		
		if (this.ship) {
			if (this.cursors.left.isDown && this.cursors.up.isDown) {
				this.player.anims.play('upLeft', true);
			} else 
			if (this.cursors.right.isDown && this.cursors.up.isDown) {
				this.player.anims.play('upRight', true);
			} else 
			if (this.cursors.left.isDown && this.cursors.down.isDown) {
				this.player.anims.play('downLeft', true);
			} else 
			if (this.cursors.right.isDown && this.cursors.down.isDown) {
				this.player.anims.play('downRight', true);
			} else 
			if (this.cursors.right.isDown) {
				agvel = 250;
				if(this.sound.volume > 0.01)
					this.sound.volume -= 0.01;
				this.player.anims.play('right', true);
			} else
			if (this.cursors.up.isDown) {
				this.player.anims.play('up', true);
			} else
			if (this.cursors.down.isDown) {
				this.player.anims.play('down', true);
			} else
			if (this.cursors.left.isDown) {
				agvel = -250;
				if(this.sound.volume < 1)
					this.sound.volume += 0.01;
				this.player.anims.play('left', true);
			}
			
			if ((!this.cursors.right.isDown && !this.cursors.left.isDown) ||
			this.cursors.right.isDown && this.cursors.left.isDown) {
				agvel = 0;
			}
			
			
			
			if(!this.cursors.down.isDown && !this.cursors.up.isDown && !this.cursors.right.isDown && !this.cursors.left.isDown) {
				this.player.anims.play('idle');
			}
			
			this.ship.setAngularVelocity(agvel);
		  
			if (this.cursors.up.isDown) {
				this.physics.velocityFromRotation(this.ship.rotation + 1.5, 2000, this.ship.body.acceleration);
			} else {
				this.ship.setAcceleration(0);
			}
		  
			//this.physics.world.wrap(this.ship, 5);
			
			// emit player movement
			var x = this.ship.x;
			var y = this.ship.y;
			var r = this.ship.rotation;
			if (this.ship.oldPosition && (x !== this.ship.oldPosition.x || y !== this.ship.oldPosition.y || r !== this.ship.oldPosition.rotation)) {
				this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.y, rotation: this.ship.rotation });
			}
			 
			// save old position data
			this.ship.oldPosition = {
				x: this.ship.x,
				y: this.ship.y,
				rotation: this.ship.rotation
			};
		}
	}
	
	
}
var agvel = 0;
	function addPlayer(self, playerInfo) {
		self.ship = self.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
		if (playerInfo.team === 'blue') {
			self.ship.setTint(0x0000ff);
		} else {
			self.ship.setTint(0xff0000);
		}
		self.ship.setDrag(100);
		self.ship.setAngularDrag(100);
		self.ship.setMaxVelocity(200);
	}

	function addOtherPlayers(self, playerInfo) {
		const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
		if (playerInfo.team === 'blue') {
			otherPlayer.setTint(0x0000ff);
		} else {
			otherPlayer.setTint(0xff0000);
		}
		otherPlayer.playerId = playerInfo.playerId;
		self.otherPlayers.add(otherPlayer);
	}
