var inputs = {
    "movement_1"    : {
        "toggle" : true, 
        "keycode" : Phaser.Input.Keyboard.KeyCodes.W,        
        "downCallback" : function(){          
				// direction = 0; //up
				// velocity_y -= velocity_speed;
        }, 
        "upCallback" : function(){
            // direction = 8; //up
            // velocity_y = 0;
        }
    },
    "movement_2"    : {
        "toggle" : true, 
        "keycode" : Phaser.Input.Keyboard.KeyCodes.A,        
        "downCallback" : function(){
            // direction = 6; //left
            // velocity_x -= velocity_speed;
        }, 
        "upCallback" : function(){
            // direction = 8; //up
            // velocity_x = 0;
        }
    },
    "movement_3"    : {
        "toggle" : true, 
        "keycode" : Phaser.Input.Keyboard.KeyCodes.S,        
        "downCallback" : function(){
            // direction = 4; //down
            // velocity_y += velocity_speed;
        }, 
        "upCallback" : function(){
            // direction = 8; //up
            // velocity_y = 0;
        }
    },
    "movement_4"    : {
        "toggle" : true, 
        "keycode" : Phaser.Input.Keyboard.KeyCodes.D,        
        "downCallback" : function(){
            // direction = 2; //right
            // velocity_x += velocity_speed;
        }, 
        "upCallback" : function(){
            // direction = 8; //up
            // velocity_x = 0;
        }
    },
    "action_1"      : {
        "toggle" : true, 
        "keycode" : Phaser.Input.Keyboard.KeyCodes.ONE,      
        "downCallback" : function(){}, 
        "upCallback" : function(){}
    },
    "action_2"      : {
        "toggle" : true, 
        "keycode" : Phaser.Input.Keyboard.KeyCodes.TWO,      
        "downCallback" : function(){}, 
        "upCallback" : function(){}
    },
    "action_3"      : {
        "toggle" : true, 
        "keycode" : Phaser.Input.Keyboard.KeyCodes.THREE,    
        "downCallback" : function(){}, 
        "upCallback" : function(){}
    },
    "action_4"      : {
        "toggle" : true, 
        "keycode" : Phaser.Input.Keyboard.KeyCodes.FOUR,     
        "downCallback" : function(){}, 
        "upCallback" : function(){}
    },
    "action_5"      : {
        "toggle" : true, 
        "keycode" : Phaser.Input.Keyboard.KeyCodes.Q,        
        "downCallback" : function(){}, 
        "upCallback" : function(){}
    },
    "action_6"      : {
        "toggle" : true, 
        "keycode" : Phaser.Input.Keyboard.KeyCodes.E,        
        "downCallback" : function(){}, 
        "upCallback" : function(){}
    },
    "action_7"      : {
        "toggle" : true, 
        "keycode" : Phaser.Input.Keyboard.KeyCodes.Z,        
        "downCallback" : function(){}, 
        "upCallback" : function(){}
    },
    "action_8"      : {
        "toggle" : true, 
        "keycode" : Phaser.Input.Keyboard.KeyCodes.X,        
        "downCallback" : function(){}, 
        "upCallback" : function(){}
    },
    "action_9"      : {
        "toggle" : true, 
        "keycode" : Phaser.Input.Keyboard.KeyCodes.C,        
        "downCallback" : function(){}, 
        "upCallback" : function(){}
    },
    "action_10"     : {
        "toggle" : true, 
        "keycode" : Phaser.Input.Keyboard.KeyCodes.V,        
        "downCallback" : function(){}, 
        "upCallback" : function(){}
    },
    "action_11"     : {
        "toggle" : true, 
        "keycode" : Phaser.Input.Keyboard.KeyCodes.F,        
        "downCallback" : function(){}, 
        "upCallback" : function(){}
    },
    "action_12"     : {
        "toggle" : true, 
        "keycode" : Phaser.Input.Keyboard.KeyCodes.TAB,      
        "downCallback" : function(){}, 
        "upCallback" : function(){}
    },
    "action_13"     : {
        "toggle" : true, 
        "keycode" : Phaser.Input.Keyboard.KeyCodes.SHIFT,    
        "downCallback" : function(){}, 
        "upCallback" : function(){}
    },
    "action_14"     : {
        "toggle" : true, 
        "keycode" : Phaser.Input.Keyboard.KeyCodes.TILDE,    
        "downCallback" : function(){}, 
        "upCallback" : function(){}
    },
}
var current_inputs = inputs;