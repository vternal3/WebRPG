
class character_scene extends Phaser.Scene {

  constructor() {
    super({ key: 'character_scene' });
  }

  init(data) {
    this.socket = data.socket;
  }

  preload() {
    //hides the AddThis strip
    if (document.getElementsByClassName("addthis-smartlayers-desktop")[0]) {
      document.getElementsByClassName("addthis-smartlayers-desktop")[0].classList.add("nodisplay");
    }
  }

  create() {
    var el = document.getElementById('myText');
    el.style.position = "absolute";
    el.style.top = 400 - 19 + "px";
    el.style.left = this.game.renderer.width / 2 - 180+ "px";
    el.style.height = "39px";
    el.style.fontSize = "36pt";
    el.style.width = "360px";

    var self = this;

    this.socket.emit('requestCharacters');
    
    this.socket.on('name_unavailable', function () {
      self.name_unavailable.setVisible(true);
    });

    this.characterImages = {};
    this.characterImagesHover = {};
    this.characters_list = {};
    this.delete_buttons = {};
    this.characterNames = {};
    this.characterSprite = {};
    this.socket.on('characters', function (characters) {

      
      for(var k in self.characterImages) {
        self.characterImages[k].setVisible(false);
        self.characterImages[k].destroy();
        delete self.characterImages[k];
      }

      for(var k in self.characterSprite) {
        self.characterSprite[k].setVisible(false);
        self.characterSprite[k].destroy();        
        delete self.characterSprite[k];
      }

      for(var k in self.characterNames) {
        self.characterNames[k].setVisible(false);
        self.characterNames[k].destroy();        
        delete self.characterNames[k];
      }

      for(var k in self.delete_buttons) {
        self.delete_buttons[k].setVisible(false);
        self.delete_buttons[k].destroy();
        delete self.delete_buttons[k];
      }

        //console.log(characters);
        self.characters_list = characters;
        var charCount = 0;
        for(var character in characters) {
          self.characterSprite[charCount] = self.physics.add.sprite(self.game.renderer.width - 550, 60 * (charCount + 1), 'walk_template');
          self.characterImages[charCount] = self.add.image(self.game.renderer.width - 510, 60 * (charCount + 1), "character_boarder").setOrigin(0, 0);
          
          self.characterNames[charCount] = self.add.text(self.game.renderer.width - 500, 60 * (charCount + 1), characters[character].name, {
            fontSize: '36px',
            fill: '#000000'
          });
          self.characterImages[charCount].displayWidth = self.characterNames[charCount].width + 20;

          self.delete_buttons[charCount] = self.add.image(self.game.renderer.width - 225, 60 * (charCount + 1), "x_button").setScale(0.08,0.08).setOrigin(0, 0);

          charCount++;
        }
    });
    
    let background = this.add.image(this.game.renderer.width / 2 - 544, 0, 'title_bg').setOrigin(0).setScale(4);

    this.character_name_text = this.add.text(this.game.renderer.width / 2 - 140, 380, '', {
      fontSize: '36px',
      fill: '#000000'
    });

    this.name_unavailable = this.add.text((self.game.renderer.width / 2) - 175, 300, "name unavailable", {
      fontSize: '36px',
      fill: '#ff0000' //red
    }).setVisible(false);

    this.characters_only = this.add.text((self.game.renderer.width / 2) - 150, 300, "Names can only contain letters", {
      fontSize: '36px',
      fill: '#ff0000' //red
    }).setVisible(false);

    let startButton = this.add.image(this.game.renderer.width / 2, 500, "start");
    let startHoverButton = this.add.image(this.game.renderer.width / 2, 500, "start_hover");

    let settingsButton = this.add.image(this.game.renderer.width - 64, 546, "settings");
    let settingsHoverButton = this.add.image(this.game.renderer.width - 64, 546, "settings_hover");

    this.characterNameLengthLimit = 12; // TODO: This is a temp name till we get something better

    startHoverButton.setVisible(false);
    settingsHoverButton.setVisible(false);

    startButton.setInteractive();
    startButton.on("pointerover", () => {
      startHoverButton.setVisible(true);
    });
    startButton.on("pointerout", () => {
      startHoverButton.setVisible(false);
    });
    startButton.on("pointerup", () => {
      this.name_unavailable.setVisible(false);
      this.socket.emit("create_player", document.getElementById('myText').value);
      document.getElementById('myText').value = "";
    });

    settingsButton.setInteractive();
    settingsButton.on("pointerover", () => {
      settingsHoverButton.setVisible(true);
    });
    settingsButton.on("pointerout", () => {
      settingsHoverButton.setVisible(false);
    });
    settingsButton.on("pointerup", () => {
      console.log("starting settings scene");
      document.getElementById('myText').style.display = "none";
      this.scene.start('settings_scene', { socket: this.socket });
    });

    //game.input.mouse.capture = true;
    this.leftReleased = false;
    this.input.on('pointerup', function (pointer) {
      if(game.input.activePointer.buttons == 0) {
        self.leftReleased = true;
      }
    });
  }
  update() {
    var characterCount = 0;
    var selection = -1;
    for(var buttons in this.characterImages) {
      if(game.input.mousePointer.x > this.characterImages[buttons].x && 
        game.input.mousePointer.x < this.characterImages[buttons].x + this.characterImages[buttons].width &&
        game.input.mousePointer.y > this.characterImages[buttons].y && 
        game.input.mousePointer.y < this.characterImages[buttons].y + this.characterImages[buttons].height
        ) {
          selection = characterCount;
        }
      characterCount++;
    }
    var characterCount2 = 0;
    var selection2 = -1;
    for(var buttons in this.delete_buttons) {
      if(game.input.mousePointer.x > this.delete_buttons[buttons].x && 
        game.input.mousePointer.x < this.delete_buttons[buttons].x + this.delete_buttons[buttons].width &&
        game.input.mousePointer.y > this.delete_buttons[buttons].y && 
        game.input.mousePointer.y < this.delete_buttons[buttons].y + this.delete_buttons[buttons].height
        ) {
          selection2 = characterCount2;
        }
      characterCount2++;
    }

    if(this.leftReleased) { //left mouse button was released
      
      if(selection2 != -1) {
        for(var k in this.characterImages) {
          this.characterImages[k].setVisible(false);
          this.characterImages[k].destroy();
          delete this.characterImages[k];
        }
  
        for(var k in this.characterSprite) {
          this.characterSprite[k].setVisible(false);
          this.characterSprite[k].destroy();        
          delete this.characterSprite[k];
        }
  
        for(var k in this.characterNames) {
          this.characterNames[k].setVisible(false);
          this.characterNames[k].destroy();        
          delete this.characterNames[k];
        }
  
        for(var k in this.delete_buttons) {
          this.delete_buttons[k].setVisible(false);
          this.delete_buttons[k].destroy();
          delete this.delete_buttons[k];
        }

        console.log("deleted character: " + this.characters_list[selection2].name);
        this.socket.emit('deleteCharacter', this.characters_list[selection2].name);
      }
      if(selection != -1)
      {
        //TODO: Make sure to validate that the socket which is using this character name actually owns this character name
        //on the server sided before allowing the person to load the character.
        document.getElementById('myText').style.display = "none";
        this.scene.start('game_scene', { socket: this.socket, character_name:  this.characters_list[selection].name});
      }
      this.leftReleased = false;
    }
  }
}
