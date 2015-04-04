(function(){

  'use strict';
  game.state.add('lvl2', {create:create, update:update});

  var jumpTimer = 0,
      map,
      layer,
      platformLayer,
      cups,
      cup,
      coffeecans,
      coffeecan,
      cursors,
      bowties,
      facing = 'right',
      bowtie,
      bowTime = 0,
      cupTime = 0,
      beans,
      bean,
      records,
      record,
      healthText,
      hitCount = 0,
      score,
      scoreText,
      fireButton,
      shotSound,
      jumpSound,
      explosionSound,
      player,
      banner,
      cupPath = [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150],
      cupIndex;

  // function init() {
  //   hitCount = hitCount;
  //   score = score;
  // }

  function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    cupIndex = 0;
    score = game.score;
    hitCount = game.hitCount;

    //sounds
    explosionSound = game.add.audio('explosion');
    shotSound = game.add.audio('shoot');

    game.world.setBounds(0, 0, 800, 640);

    game.bg = game.add.tileSprite(0, 0, 7040, 640, 'treeBG');

    map = game.add.tilemap('background2');
    map.addTilesetImage('steampunk');
    map.addTilesetImage('blocks');
    map.addTilesetImage('trees2');

    layer = map.createLayer('background');
    platformLayer = map.createLayer('platforms');
    layer.resizeWorld();
    platformLayer.resizeWorld();
    map.setCollisionByExclusion([1]);


    //player stuff

    player = game.add.sprite(40, 0, 'head');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = false;
    player.body.setSize(36, 56, 14, -8);
    player.body.gravity.y = 400;
    player.animations.add('left', [2]);
    player.animations.add('right', [1]);

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);

    //collectables

    var recordPosition = [173, 674, 815, 1300, 1521, 1907, 2294, 2398, 2499, 2682, 2846, 2992, 3148, 3279, 3404, 3495, 3724, 4160, 4574, 4841, 5103, 5230, 5650, 5935, 6144, 6419, 6705],
        recordCounter = 0;

    records = game.add.group();
    records.enableBody = true;
    records.createMultiple(27, 'record');
    records.forEach(function(record){
      game.physics.enable(record, Phaser.Physics.ARCADE);
      record.anchor.set(0.5, 0.5);
      record.body.gravity.y = 750;
      record.body.bounce = 0.8;
    });

    records.forEach(function(record){
      record.reset(recordPosition[recordCounter], 200);
      recordCounter++;
    }, this);

    //hat

    banner = game.add.sprite(6982, 70, 'banner');
    game.physics.enable(banner, Phaser.Physics.ARCADE);
    banner.body.collideWorldBounds = true;
    banner.animations.add('marquee', [0, 1, 2], 10, true);
    banner.scale.set(2, 2);

    //enemies

    var cupPosition = [475, 1079, 1733, 2113, 3015, 3711, 4129, 4839, 5252, 5678, 6688];
    var counter = 0;

    cups = game.add.group();
    cups.enableBody = true;
    cups.createMultiple(10, 'cup');
    cups.setAll('collideWorldBounds', true);
    cups.setAll('body.gravity.y', 950);
    cups.forEach(function(cup) {
      game.physics.enable(cup, Phaser.Physics.ARCADE);
      cup.anchor.set(0.5, 0.5);
      cup.body.setSize(52, 63);
      cup.body.gravity.y = 950;
      cup.animations.add('left', [0, 1, 2, 3], 10, true);
      cup.animations.add('right', [0, 3, 2, 1], 10, true);
    });

    cups.forEach(function(cup) {
      cup.reset(cupPosition[counter], 90);
      counter++;
    }, this);

    //cans

    var coffeecanPosition = [597, 3437, 4000, 4531, 6287, 6743];
    var counter = 0;

    coffeecans = game.add.group();
    coffeecans.enableBody = true;
    coffeecans.createMultiple(7, 'coffeecan');
    coffeecans.forEach(function(coffeecan) {
      game.physics.enable(coffeecan, Phaser.Physics.ARCADE);
      coffeecan.body.gravity.y = 950;
      coffeecan.anchor.set(0.5, 0.5);
      coffeecan.body.setSize(41, 48);
    });

    coffeecans.forEach(function(coffeecan) {
      coffeecan.reset(coffeecanPosition[counter], 300);
      counter++;
    }, this);


    //bowties
    bowties = game.add.group();
    bowties.enableBody = true;
    bowties.createMultiple(2, 'bowtie');
    bowties.forEach(function(bowtie){
      bowtie.body.setSize(64, 30, 0, 13);
    });

    beans = game.add.group();
    beans.enableBody = true;
    beans.createMultiple(2, 'bean');
    beans.setAll('body.setSize', 32, 32);

    game.cameraLastX = game.camera.x;
    game.cameraLastY = game.camera.y;

    scoreText = game.add.text(20, 20, 'Local Artists\' Vinyl: ' + game.score, { fontSize: '32px', fill: '#FFF', align: 'center' });
    scoreText.fixedToCamera = true;

    healthText = game.add.text(660, 20, 'Health: ' + game.hitCount, { fontSize: '32px', fill: '#FFF'});
    healthText.fixedToCamera = true;
  }

  function update() {

      game.physics.arcade.collide(player, platformLayer);
      game.physics.arcade.collide(banner, platformLayer);
      game.physics.arcade.collide(records, platformLayer);
      game.physics.arcade.collide(cups, platformLayer);
      game.physics.arcade.collide(coffeecans, platformLayer);
      game.physics.arcade.overlap(player, records, collectRecords, null, this);
      game.physics.arcade.overlap(player, banner, collectBanner, null, this);
      game.physics.arcade.overlap(bowties, platformLayer, killBowtie, null, this);
      game.physics.arcade.overlap(bowties, cups, cupHandler, null, this);
      game.physics.arcade.overlap(bowties, coffeecans, cupHandler, null, this);
      game.physics.arcade.overlap(bowties, beans, cupHandler, null, this);
      game.physics.arcade.overlap(beans, platformLayer, killBowtie, null, this);
      game.physics.arcade.overlap(beans, cups, collisionHandler, null, this);
      game.physics.arcade.overlap(player, beans, playerDeathHandler, null, this);
      game.physics.arcade.overlap(player, coffeecans, playerDeathHandler, null, this);
      game.physics.arcade.overlap(player, cups, playerDeathHandler, null, this);

      player.body.velocity.x = 0;
      banner.animations.play('marquee');

      /* actual movement */
      if (cursors.left.isDown) {
        player.body.velocity.x = -250;
        player.animations.play('left');
      } else if (cursors.right.isDown) {
        player.body.velocity.x = 250;
        player.animations.play('right');
      } else {
        player.frame = 0;
      }

      if (cursors.up.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
          player.body.velocity.y = -275;
          jumpTimer = game.time.now + 750;
      }

      /* flying movement */
      // if (cursors.left.isDown) {
      //   player.body.velocity.x = -750;
      //   player.animations.play('left');
      // } else if (cursors.right.isDown) {
      //   player.body.velocity.x = 750;
      //   player.animations.play('right');
      // } else {
      //   player.frame = 0;
      //   player.body.velocity.x = 0;
      // }

      // if(cursors.up.isDown) {
      //   player.body.velocity.y = -250;
      // } else if(cursors.down.isDown) {
      //   player.body.velocity.y = 250;
      // } else {
      //   player.body.velocity.y = 0;
      // }
      // if (player.body.onFloor() && game.time.now > jumpTimer) {
      //     player.body.velocity.y = -350;
      //     jumpTimer = game.time.now + 750;
      // }

      if(game.camera.x !== game.cameraLastX){
        game.bg.x -= 0.2 * (game.cameraLastX - game.camera.x);
        game.cameraLastX = game.camera.x;
      }

      if(player.body.y >= 700) {
        player.body.y = 0;
      }

      if(player.body.velocity.x >= 0) {
        facing = 'right';
      } else {
        facing = 'left';
      }

      // cups
      cups.forEachAlive(function(cup) {
        if(cup.body.onFloor()) {
          cup.body.velocity.y = -350;
          cup.animations.play('left');
        }
        if(cup.body.y >= 655) {
          cup.kill();
        }
        if(cup.body.x - player.body.x <= 200) {
          cupFire(cup);
        }
      });

      //coffeecans
      coffeecans.forEachAlive(function(can){
        can.body.velocity.x = 0;
        can.body.velocity.x = cupPath[cupIndex];
      });
      cupIndex = cupIndex + 1 >= cupPath.length ? 0 : cupIndex + 1;

      //bowties
      bowties.forEachAlive(function(bowtie){
        var distanceFromPlayer = 600;
        if(Math.abs(player.x - bowtie.x) >= distanceFromPlayer) {
          bowtie.kill();
        }
      }, this);

      if(fireButton.isDown) {
        fireBowtie();
      }

      beans.forEachAlive(function(bean){
        if(bean.body.x - game.cameraLastX <= 0) {
          bean.kill();
        }
      });

    if (score % 10 === 1) {
      hitCount++;
      score++;
      healthText.text = 'Health: ' + hitCount;
    }

    if(hitCount === 0) {
      gameOver();
    }
  }

  function fireBowtie() {
     if (game.time.now > bowTime  && facing === 'right') {
          bowtie = bowties.getFirstExists(false);

          if (bowtie) {
              bowtie.reset(player.x - 30, player.y - 20);
              bowtie.body.velocity.x = 600;
              bowTime = game.time.now + 750;
              shotSound.play();
          }
      } else if (game.time.now > bowTime && facing === 'left') {
          bowtie = bowties.getFirstExists(false);

          if (bowtie) {
              bowtie.reset(player.x - 30, player.y - 20);
              bowtie.body.velocity.x = -600;
              bowTime = game.time.now + 750;
              shotSound.play();
          }
    }
  }

  function cupFire (cup) {
    if (game.time.now > cupTime)
    {
      bean = beans.getFirstExists(false);
      if (bean) {
        bean.anchor.setTo(0.5, 0.5);
        bean.reset(cup.body.x - 30, cup.body.y);
        cupTime = game.time.now + 2000;
        game.physics.arcade.moveToObject(bean, player, 140);
      }
    }
  }

  function resetBowtie(bowtie) {
    bowtie.kill();
  }

  function killBowtie(bowtie, layer) {
    bowtie.kill();
  }

  function collisionHandler (bowtie, cup) {
    explosionSound.play();
    bowtie.kill();
    cup.kill();
  }

  function collectRecords (player, record) {
    record.kill();
    score += 1;
    scoreText.text = 'Local Artists\' Vinyl: ' + score;
  }

  function collectBanner (player, hat) {
    player.destroy();
    game.world.setBounds(0, 0, 0, 0);
    game.state.start('bossMenu');
    game.hitCount = hitCount;
    game.score = score;
  }

  function playerDeathHandler (player, enemy) {
    player.animations.play('damage');
    explosionSound.play();
    enemy.body.x = -200000;
    player.body.x -= 75;
    --hitCount;
    healthText.text = 'Health: ' + hitCount;
  }

  function cupHandler (bowtie, cup) {
    explosionSound.play();
    bowtie.kill();
    cup.kill();
  }

  function gameOver () {
    game.state.start('menu');
    hitCount = 2;
  }

  function render() {
    game.debug.body(beans.children[0]);
    game.debug.body(player);
    cups.forEachAlive(function(cup){
      game.debug.body(cup);
    });
  }
})();