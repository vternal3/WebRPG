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
    //retrieve character list from database
    //then for loop over each one and 'add'
    //a character border with the character
    //over the board with it's name text next 
    //to it.
    let background = this.add.image(this.game.renderer.width / 2 - 544, 0, 'title_bg').setOrigin(0).setScale(4);

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

    this.characterNameLengthLimit = 10; // TODO: This is a temp name till we get something better

    character_name_textbox_focus.setVisible(false);
    startHoverButton.setVisible(false);
    settingsHoverButton.setVisible(false);
    character_background_hover.setVisible(false);

    this.sound.play("theme_music");

    background.setInteractive();
    background.on("pointerup", () => {
    });

    // Character Selection Background - Top Right selection window
    character_background.setInteractive();
    character_background.on("pointerover", () => {
      character_background_hover.setVisible(true);
    });
    character_background.on("pointerout", () => {
      character_background_hover.setVisible(false);
    });
    character_background.on("pointerup", () => {
    });

    // Character Name Background - 
    character_name_textbox.setInteractive();
    character_name_textbox.on("pointerover", () => { // When mouse is over - loads image
      character_name_textbox_focus.setVisible(true);
    });
    character_name_textbox.on("pointerout", () => { // When mouse leaves - loads image
      character_name_textbox_focus.setVisible(false);
    });
    character_name_textbox.on("pointerup", () => { // When letting go of left-click
      this.character_name_text.text = "";
    });



    startButton.setInteractive();
    startButton.on("pointerover", () => {
      startHoverButton.setVisible(true);
    });
    startButton.on("pointerout", () => {
      startHoverButton.setVisible(false);
    });
    startButton.on("pointerup", () => {
      this.sound.pauseAll();
      console.log("starting game scene");
      this.scene.start('game_scene', { socket: this.socket });
      this.scene.stop('character_scene');
      console.log("stopped title scene");
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
      this.scene.start('settings_scene', { socket: this.socket });
    });

    this.toggle = {
      'a': true,
      'b': true,
      'c': true,
      'd': true,
      'e': true,
      'f': true,
      'g': true,
      'h': true,
      'i': true,
      'j': true,
      'k': true,
      'l': true,
      'm': true,
      'n': true,
      'o': true,
      'p': true,
      'q': true,
      'r': true,
      's': true,
      't': true,
      'u': true,
      'v': true,
      'w': true,
      'x': true,
      'y': true,
      'z': true,
      'backspace': true,
      'space': true
    }
  }
  
  update() {

    if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE).isDown) {
      if (this.toggle['backspace']) {
        this.character_name_text.text = this.character_name_text.text.substring(0, this.character_name_text.text.length - 1);
        this.toggle['backspace'] = false;
      }
    }

    if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE).isDown) {
      this.toggle['backspace'] = true;
    }
    
    if (this.character_name_text.text.length <= this.characterNameLengthLimit) {      

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).isDown) {
        if (this.toggle['space']) {
          this.character_name_text.text += '';
          this.toggle['space'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).isDown) {
        this.toggle['space'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown) {
        if (this.toggle['a']) {
          this.character_name_text.text += 'a';
          this.toggle['a'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown) {
        this.toggle['a'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B).isDown) {
        if (this.toggle['b']) {
          this.character_name_text.text += 'b';
          this.toggle['b'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B).isDown) {
        this.toggle['b'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C).isDown) {
        if (this.toggle['c']) {
          this.character_name_text.text += 'c';
          this.toggle['c'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C).isDown) {
        this.toggle['c'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown) {
        if (this.toggle['d']) {
          this.character_name_text.text += 'd';
          this.toggle['d'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown) {
        this.toggle['d'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E).isDown) {
        if (this.toggle['e']) {
          this.character_name_text.text += 'e';
          this.toggle['e'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E).isDown) {
        this.toggle['e'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F).isDown) {
        if (this.toggle['f']) {
          this.character_name_text.text += 'f';
          this.toggle['f'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F).isDown) {
        this.toggle['f'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G).isDown) {
        if (this.toggle['g']) {
          this.character_name_text.text += 'g';
          this.toggle['g'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G).isDown) {
        this.toggle['g'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H).isDown) {
        if (this.toggle['h']) {
          this.character_name_text.text += 'h';
          this.toggle['h'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H).isDown) {
        this.toggle['h'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I).isDown) {
        if (this.toggle['i']) {
          this.character_name_text.text += 'i';
          this.toggle['i'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I).isDown) {
        this.toggle['i'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J).isDown) {
        if (this.toggle['j']) {
          this.character_name_text.text += 'j';
          this.toggle['j'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J).isDown) {
        this.toggle['j'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K).isDown) {
        if (this.toggle['k']) {
          this.character_name_text.text += 'k';
          this.toggle['k'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K).isDown) {
        this.toggle['k'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L).isDown) {
        if (this.toggle['l']) {
          this.character_name_text.text += 'l';
          this.toggle['l'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L).isDown) {
        this.toggle['l'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M).isDown) {
        if (this.toggle['m']) {
          this.character_name_text.text += 'm';
          this.toggle['m'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M).isDown) {
        this.toggle['m'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N).isDown) {
        if (this.toggle['n']) {
          this.character_name_text.text += 'n';
          this.toggle['n'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N).isDown) {
        this.toggle['n'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O).isDown) {
        if (this.toggle['o']) {
          this.character_name_text.text += 'o';
          this.toggle['o'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O).isDown) {
        this.toggle['o'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P).isDown) {
        if (this.toggle['p']) {
          this.character_name_text.text += 'p';
          this.toggle['p'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P).isDown) {
        this.toggle['p'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q).isDown) {
        if (this.toggle['q']) {
          this.character_name_text.text += 'q';
          this.toggle['q'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q).isDown) {
        this.toggle['q'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R).isDown) {
        if (this.toggle['r']) {
          this.character_name_text.text += 'r';
          this.toggle['r'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R).isDown) {
        this.toggle['r'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S).isDown) {
        if (this.toggle['s']) {
          this.character_name_text.text += 's';
          this.toggle['s'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S).isDown) {
        this.toggle['s'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T).isDown) {
        if (this.toggle['t']) {
          this.character_name_text.text += 't';
          this.toggle['t'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T).isDown) {
        this.toggle['t'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U).isDown) {
        if (this.toggle['u']) {
          this.character_name_text.text += 'u';
          this.toggle['u'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U).isDown) {
        this.toggle['u'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V).isDown) {
        if (this.toggle['v']) {
          this.character_name_text.text += 'v';
          this.toggle['v'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V).isDown) {
        this.toggle['v'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown) {
        if (this.toggle['w']) {
          this.character_name_text.text += 'w';
          this.toggle['w'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown) {
        this.toggle['w'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X).isDown) {
        if (this.toggle['x']) {
          this.character_name_text.text += 'x';
          this.toggle['ax'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X).isDown) {
        this.toggle['x'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y).isDown) {
        if (this.toggle['y']) {
          this.character_name_text.text += 'y';
          this.toggle['y'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y).isDown) {
        this.toggle['Y'] = true;
      }

      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z).isDown) {
        if (this.toggle['z']) {
          this.character_name_text.text += 'z';
          this.toggle['z'] = false;
        }
      }
      if (!this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z).isDown) {
        this.toggle['z'] = true;
      }


    }


    // // This maps all the alphebet keys
    // foreach(let key in Phaser.Input.Keyboard.KeyCodes)

    // {
    // 	if (key >= 65 && key <= 90) {

    // 		if (this.input.keyboard.addKey(key).isDown) {
    // 			if (focus_textbox && this.toggle[String.fromCharCode(key).toLowerCase()]) {
    // 				this.character_name_text.text += String.fromCharCode(key).toLowerCase();
    // 				this.toggle[String.fromCharCode(key).toLowerCase()] = false;
    // 			}
    // 		}
    // 		if (!this.input.keyboard.addKey(key).isDown) {
    // 			this.toggle[String.fromCharCode(key).toLowerCase()] = true;
    // 		}
    // 	}
    // }
  }

}
