//create a new scene
let gameScene = new Phaser.Scene('Game');

//initiate scene parameters
gameScene.init = function(){
  //player/enemy speed
  this.playerSpeed = 4;
  this.enemySpeed = 3;

  //boundaries
  this.enemyMinY = 80;
  this.enemyMaxY = 280;
  

  //enemy speeds
  this.enemyMinSpeed = 2;
  this.enemyMaxSpeed = 5;
  //game is not terminating at beginning
  this.isTerminating = false;
};

//load assets

gameScene.preload = function(){
  // load background
  this.load.image('background','assets/background.png')
  this.load.image('player','assets/player.png')
  this.load.image('enemy','assets/dragon.png')
  this.load.image('goal','assets/treasure.png')
};

  //called once after the preload ends
  gameScene.create = function(){
    //create background sprite
    let background = this.add.sprite(0,0,'background');
    //change the origin to the top left corner
    //background.origin(0,0)
    //change the position to the center
    background.setPosition(320,180);

    //create the player
      this.player = this.add.sprite(50,this.sys.game.config.height/2,'player');
    //changes order in which sprites appear
    //player.depth = 1;

    // changes size of sprite half the width twice the height
      this.player.setScale(.5);

      this.goal = this.add.sprite(this.sys.game.config.width - 80,this.sys.game.config.height/2,'goal').setScale(.5);
    //create an enemy
      //this.enemy1 = this.add.sprite(250,180,'enemy')
    //scale enemy
      //this.enemy1.setScale(1);
      //enemy1.scaleX = 2;
      //enemy1.scaleY = 2;
    //rotation angle and radians. Rotation is around origin
      //enemy1.angle = 45;
      //enemy1.setAngle(-45);
      //enemy1.rotation = Math.PI/4;
      //enemy1.setOrigin(0,0)
      //this.enemy1.setRotation(Math.PI/4);
    // second enemy creation
      //let enemy2 = this.add.sprite(450,180,'enemy')
      //enemy2.displayWidth = 300;

    //flip
      //enemy1.flipX = true;
      //enemy1.flipY = true;

    //game height and width
    //this refers to gameScene, 
    //sys refers to system componant which gives access to game level properties,
    //game gives access to game object, config gives access to config object which has width and height in it 
    let gameWidth = this.sys.game.config.width;
    let gameHeight = this.sys.game.config.height;

    //enemy 
      this.enemies = this.add.group({
        key: 'enemy',
        repeat: 4,
        setXY:{
          x: 105,
          y: 100,
          stepX: 90,
          stepY: 20,
        }
      });
      //this.enemy = this.add.sprite(120,this.sys.game.config.height/2,'enemy')
      //this.enemy.flipX = true;
      //this.enemies.add(this.enemy)
      Phaser.Actions.ScaleXY(this.enemies.getChildren(),-0.4,-0.4)

      Phaser.Actions.Call(this.enemies.getChildren(), function(enemy){
        //flip enemy
        enemy.flipX = true;

        //set enemy speed
        let direction = Math.random() < 0.5 ? 1 : -1;
        let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed)
        enemy.speed = direction * speed;
  
      },this);

      //set enemy speed ##Important for randomness between two numbers
      //let direction = Math.random() < 0.5 ? 1 : -1;
      //let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed)
      //this.enemy.speed = direction * speed;

  };
  //console.time('loop') and console.timeEnd('loop') times operations
  // this is called up to 60 times per second
  gameScene.update = function(){

    // dont execute if we are terminating
    if(this.isTerminating) return;

    //this.enemy1.x += 1
    //this.enemy1.angle += 1;
    //this.enemy.setScale(1)
    //challenge to make enemy grow twice as big and stop
      //if((this.enemy1.scaleX < 2) && (this.enemy1.scaleY < 2)){
      //this.enemy1.scaleX += .01;
      //this.enemy1.scaleY += .01;
      //}
    //check for active input
    if(this.input.activePointer.isDown){
      //player walks
      this.player.x += this.playerSpeed; 
    };

    //treasure overlap check
    let playerRect = this.player.getBounds();
    let treasureRect = this.goal.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect,treasureRect)){
      console.log('reached goal!')

      //restart the scene
      this.scene.restart();
      return;
    }

    //get enemies
      let enemies = this.enemies.getChildren();
      let numberEnemies = enemies.length;

      for(let i = 0; i < numberEnemies;i++){
        enemies[i].y += enemies[i].speed;
        let conditionUp = enemies[i].speed < 0 && enemies[i].y <= this.enemyMinY
        let conditionDown = enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY
        if(conditionUp || conditionDown){
          enemies[i].speed *= -1;
        };

        
        let enemyRect = enemies[i].getBounds();
    
        if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect,enemyRect)){
          console.log('Game over!')
    
          //end game
          return this.gameOver();
          
      };

      gameScene.gameOver = function(){

        //initiated game over sequence
        this.isTerminating = true;

        //shake camera
        this.cameras.main.shake(500);

        //listen for shake completion
        this.cameras.main.on('camerashakecomplete', function(camera, effect){

          // fade out
          this.cameras.main.fade(500);

        },this);

        this.cameras.main.on('camerafadeoutcomplete', function(camera,effct){
          //restart scene
          this.scene.restart();
        },this);
        

      };
      
    //enemy movement
      //this.enemy.y += this.enemy.speed;

    //check enemy min y
      //let conditionUp = this.enemy.speed < 0 && this.enemy.y <= this.enemyMinY
      //let conditionDown = this.enemy.speed > 0 && this.enemy.y >= this.enemyMaxY
      //if we pass upper or lower limit reverse
      //if(conditionUp || conditionDown){
        //this.enemy.speed *= -1;
      //};
      //if(coniditionUp){
        //this.enemySpeed *= -1;
      //};

    //check enemy max y
    //if(coniditionDown ){
     // this.enemySpeed *= -1;
    //};

  };
};
//set the configuration of the game
let config = {
  type: Phaser.AUTO, //phaser will use webgl if available or canvas api if it cant
  width: 640,
  height: 360,
  scene: gameScene
};

// create a new game and pass configuration to game

let game = new Phaser.Game(config);