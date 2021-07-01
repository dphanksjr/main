// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
  // word database
  this.words = [{
      key: 'building',
      setXY: {
        x: 80,
        y: 240
      },
      spanish: '10 x 0 = ?'
    },
    {
      key: 'house',
      setXY: {
        x: 200,
        y: 240
      },
      setScale: {
        x: 0.8,
        y: 0.8
      },
      spanish: '10 x 1 = ?'
    },
    {
      key: 'car',
      setXY: {
        x: 340,
        y: 240
      },
      setScale: {
        x: 0.8,
        y: 0.8
      },
      spanish: '10 x 10 = ?'
    },
    {
      key: 'tree',
      setXY: {
        x: 500,
        y: 240
      },
      spanish: '10 x 100= ?'
    }
  ];
}

// load asset files for our game
gameScene.preload = function() {
  // load images
  this.load.image('background', 'assets/images/background-city.png');
  this.load.image('building', 'assets/images/zero.png');
  this.load.image('car', 'assets/images/hundred.png');
  this.load.image('house', 'assets/images/ten.png');
  this.load.image('tree', 'assets/images/thousand.png');
  this.load.image('heading', 'assets/images/heading.png');

  this.load.audio('treeAudio', 'assets/audio/thousand.mp3');
  this.load.audio('carAudio', 'assets/audio/hundred.mp3');
  this.load.audio('houseAudio', 'assets/audio/ten.mp3');
  this.load.audio('buildingAudio', 'assets/audio/zero.mp3');
  this.load.audio('correct', 'assets/audio/correct.mp3');
  this.load.audio('wrong', 'assets/audio/wrong.mp3');
};

// executed once, after assets were loaded
gameScene.create = function() {

  this.items = this.add.group(this.words);

  // background
  let bg = this.add.sprite(0, 0, 'background').setOrigin(0, 0);
  let heading = this.add.image(315, 40, 'heading');
  
  // show group sprites on top of the background
  this.items.setDepth(1);

  // getting group array
  let items = this.items.getChildren();

  for(let i = 0; i < items.length; i++) {

    let item = items[i];

    // make item interactive
    item.setInteractive();

    // creating tween - resize tween
    item.correctTween = this.tweens.add({
      targets: item,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 300,
      paused: true,
      yoyo: true,
      ease: 'Quad.easeInOut'
    });

    item.wrongTween = this.tweens.add({
      targets: item,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 300,
      angle: 90,
      paused: true,
      yoyo: true,
      ease: 'Quad.easeInOut'
    });

    // transparency tween
    item.alphaTween = this.tweens.add({
      targets: item,
      alpha: 0.7,
      duration: 200,
      paused: true
    });

    // listen to the pointerdown event
    item.on('pointerdown', function(pointer) {

      let result = this.processAnswer(this.words[i].spanish);

      // depending on the result, we'll play one tween or the other
      if(result) {
        item.correctTween.play();
      }
      else {
        item.wrongTween.play();
      }

      // show next question
      this.showNextQuestion();
    }, this);

    // listen to the pointerover event
    item.on('pointerover', function(pointer) {
      item.alphaTween.play();
    }, this);

    // listen to the pointerout event
    item.on('pointerout', function(pointer) {
      //stop alpha tween
      item.alphaTween.stop();

      // set no transparency
      item.alpha = 1;
    }, this);

    // create sound for each word
    this.words[i].sound = this.sound.add(this.words[i].key + 'Audio');

  }

  // text object

  this.wordText = this.add.text(50, 88, ' ', {
    font: '60px Open Sans',
    fill: '#000000'
  });

  // correct / wrong sounds
  this.correctSound = this.sound.add('correct');
  this.wrongSound = this.sound.add('wrong');

  // show the first question
  this.showNextQuestion();
};

// show new question
gameScene.showNextQuestion = function(){

  // select a random word
  this.nextWord = Phaser.Math.RND.pick(this.words);

  // play a sound for that word
  //this.nextWord.sound.play();

  // show the text of the word in Spanish
  this.wordText.setText(this.nextWord.spanish);
};

// answer processing
gameScene.processAnswer = function(userResponse) {

  // compare user response with correct response
  if(userResponse == this.nextWord.spanish) {
    // it's correct

    // play sound
    this.correctSound.play();
    return true;
  }
  else {
    // it's wrong

    // play sound
    this.wrongSound.play();

    return false;
  }
}

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene,
  title: 'Learning Your Tens',
  pixelArt: false,
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
