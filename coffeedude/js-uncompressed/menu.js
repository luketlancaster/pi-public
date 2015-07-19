(function() {
  game.state.add('menu', {preload:preload, create:create, update:update});
  game.state.start('menu');
  var button,
      enterKey,
      aKey;

  function preload() {
    game.load.tilemap('background', './assets/groundfloor.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('background2', './assets/stage2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('bossfight', './assets/bossfight.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level3', './assets/tilesets/stage3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('cup', './assets/enemies/buxscupsheet.png', 64, 64, 4);
    game.load.spritesheet('head', './assets/player/headsheet.png', 64, 64, 3);
    game.load.spritesheet('jwb', './assets/enemies/johnwilkesbooth.png', 128, 137, 2);
    game.load.spritesheet('banner', './assets/theatrebanner.png', 48, 21, 3);
    game.load.image('sovietflag', './assets/sovietflag.png');
    game.load.image('forceBar', './assets/forcebar.png');
    game.load.image('bullet', './assets/enemies/bullet.png');
    game.load.image('bossBG', './assets/theatre.jpg');
    game.load.image('treeBG', './assets/woodgrain.jpg');
    game.load.image('start', './assets/button.png');
    game.load.image('reStart', './assets/reStartButton.png');
    game.load.image('victoryButton', './assets/victoryButton.png');
    game.load.image('menu', './assets/startmenu.png');
    game.load.image('menu2', './assets/startlvl2.png');
    game.load.image('bossLvlMenu', './assets/startBossLvl.png');
    game.load.image('finalMenu', './assets/finalMenu.png');
    game.load.image('blocks', './assets/blocks.png');
    game.load.image('steampunk', './assets/steampunkish-tilec.png');
    game.load.image('trees2', './assets/trees2.jpg');
    game.load.image('bookshelf', './assets/bookshelf.jpg');
    game.load.image('bowtie', './assets/player/bowtie.png');
    game.load.image('bean', './assets/enemies/coffeebean.png');
    game.load.image('coffeecan', './assets/enemies/coffeecan.png');
    game.load.image('record', './assets/record.png');
    game.load.image('hat', './assets/tophat.png');
    game.load.audio('shoot', './assets/Pecheew.m4a');
    game.load.audio('explosion', './assets/Explosion.m4a');
    game.load.audio('jump', './assets/Whoop.m4a');
    game.load.audio('fall', './assets/fall.m4a');
  }

  function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'menu');
    button = game.add.button(50, 275, 'start', startClick, this);
    button.scale.setTo(.5);

    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    aKey = game.input.keyboard.addKey(Phaser.Keyboard.A)
  }

  function update() {
    if (aKey.isDown && enterKey.isDown) {
      startLvl3();
    }
  }

  function startClick () {
    this.game.state.start('lvl1');
  }

  function startLvl3(){
    game.state.start('level3');
  }


})();
