(function(){
  'use strict';
  game.state.add('level3', {create:create, update:update});

  var jumpTimer = 0,
      map,
      layer,
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
      hitCount = 2,
      score,
      scoreText,
      fireButton,
      shotSound,
      jumpSound,
      explosionSound,
      fallSound,
      player,
      hat,
      bar,
      cupPath = [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150],
      cupIndex,
      cameraScrollRate = .05,
      playSound = false,
      gameStarted = false;

  function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    cupIndex = 0;
    score = 0;
    game.score = score;

    //sounds
    explosionSound = game.add.audio('explosion');
    shotSound = game.add.audio('shoot');
    fallSound = game.add.audio('fall');
    game.world.setBounds(0, 0, 800, 640);

    game.bg = game.add.tileSprite(0, 0, 7040, 640, 'sovietflag');

    map = game.add.tilemap('level3');
    map.addTilesetImage('blocks');
    map.setCollisionByExclusion([1]);

    layer = map.createLayer('foreground');
    layer.resizeWorld();

    //player stuff

    player = game.add.sprite(12, 420, 'head');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = false;
    player.body.setSize(25, 50, 19, 0);
    player.body.gravity.y = 400;
    player.animations.add('left', [2]);
    player.animations.add('right', [1]);

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //force bar
    bar = game.add.sprite(-10, 0, 'forceBar');
    game.physics.enable(bar, Phaser.Physics.ARCADE);
    bar.fixedToCamera = true;

    //collectables

    var recordPosition = [138, 419, 690, 1340, 1472, 1957, 2064, 2800, 3065, 3582, 3919, 4202, 4538, 4868, 5109, 6022, 6479, 6766],
        recordCounter = 0;

    records = game.add.group();
    records.enableBody = true;
    records.createMultiple(18, 'record');
    records.forEach(function(record){
      game.physics.enable(record, Phaser.Physics.ARCADE);
      record.anchor.set(0.5, 0.5);
      record.body.gravity.y = 750;
      record.body.bounce = 0.8;
    });

    records.forEach(function(record){
      record.reset(recordPosition[recordCounter], 400);
      recordCounter++;
    }, this);

    //hat

    hat = game.add.sprite(6798, 420, 'hat');
    game.physics.enable(hat, Phaser.Physics.ARCADE);
    hat.body.collideWorldBounds = true;
    hat.body.gravity.y = 950;


    //enemies
    var cupPosition = [627,982,1397,1912,2263,2417,2552,2709,3094,3503,3919,4402,4975,5392,5841,6323,6703];
    var cupCounter = 0;

    cups = game.add.group();
    cups.enableBody = true;
    cups.createMultiple(17, 'cup');
    cups.forEach(function(cup) {
      game.physics.enable(cup, Phaser.Physics.ARCADE);
      cup.anchor.set(0.5, 0.5);
      cup.body.setSize(44, 63);
      cup.body.gravity.y = 950;
      cup.body.collideWorldBounds = true;
      cup.animations.add('left', [0, 1, 2, 3], 10, true);
      cup.animations.add('right', [0, 3, 2, 1], 10, true);
    });

    cups.forEach(function(cup) {
      cup.reset((cupPosition[cupCounter] + 12), 600);
      cupCounter++;
    }, this);

    //cans

    var coffeecanPosition = [493,756,1205,1557,1813,2070,2902,3286,3696,4152,4593,4756,5168,5619,6072,6484,6867];
    var canCounter = 0;

    coffeecans = game.add.group();
    coffeecans.enableBody = true;
    coffeecans.createMultiple(17, 'coffeecan');
    coffeecans.setAll('collideWorldBounds', true);
    coffeecans.forEach(function(coffeecan) {
      game.physics.enable(coffeecan, Phaser.Physics.ARCADE);
      coffeecan.body.gravity.y = 0;
      coffeecan.anchor.set(0.5, 0.5);
      coffeecan.body.setSize(41, 48);
    });

    coffeecans.forEach(function(coffeecan) {
      coffeecan.reset((coffeecanPosition[canCounter] + 20), -48);
      canCounter++;
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
    beans.createMultiple(50, 'bean');
    beans.forEach(function(bean){
      bean.body.setSize(15, 15);
    });

    game.cameraLastX = game.camera.x;
    game.cameraLastY = game.camera.y;

    scoreText = game.add.text(20, 20, 'Local Artists\' Vinyl: 0', { fontSize: '32px', fill: '#FFF', align: 'center' });
    scoreText.fixedToCamera = true;

    healthText = game.add.text(660, 20, 'Health: 3', { fontSize: '32px', fill: '#FFF'});
    healthText.fixedToCamera = true;
  }

  function update() {

      game.physics.arcade.collide(player, layer);
      game.physics.arcade.collide(records, layer);
      game.physics.arcade.collide(cups, layer);
      game.physics.arcade.collide(coffeecans, layer);
      game.physics.arcade.collide(player, bar);
      game.physics.arcade.overlap(player, records, collectRecords, null, this);
      game.physics.arcade.overlap(bowties, layer, killBowtie, null, this);
      game.physics.arcade.overlap(bowties, cups, cupHandler, null, this);
      game.physics.arcade.overlap(bowties, coffeecans, cupHandler, null, this);
      game.physics.arcade.overlap(bowties, beans, cupHandler, null, this);
      game.physics.arcade.overlap(beans, layer, killBowtie, null, this);
      game.physics.arcade.overlap(beans, cups, collisionHandler, null, this);
      game.physics.arcade.overlap(player, beans, playerDeathHandler, null, this);
      game.physics.arcade.overlap(player, coffeecans, playerDeathHandler, null, this);
      game.physics.arcade.overlap(player, cups, playerDeathHandler, null, this);

      player.body.velocity.x = 0;

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

      if (player.body.blocked.down) {
        player.body.velocity.y = -275;
        gameStarted = true;
      }
      /* flying movement */
      // if (cursors.left.isDown) {
      //   player.body.velocity.x = -350;
      //   player.animations.play('left');
      // } else if (cursors.right.isDown) {
      //   player.body.velocity.x = 350;
      //   player.animations.play('right');
      // } else {
      //   player.frame = 0;
      //   player.body.velocity.x = 0;
      // }
      //
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

      if (gameStarted && player.body.position.x > 300 ) {
        game.camera.x = (game.camera.x + 2)
      }

      if (player.x < game.cameraLastX) {
        player.x + 2
      }

      if(game.camera.x !== game.cameraLastX){
        game.bg.x -= 0.2 * (game.cameraLastX - game.camera.x);
        game.cameraLastX = game.camera.x;
      }

      if(player.body.y >= 700) {
        gameOver();
      }

      if(player.body.velocity.x >= 0) {
        facing = 'right';
      } else {
        facing = 'left';
      }

      // cups
      cups.forEachAlive(function(cup) {
        if(cup.body.y > 559) {
          cup.body.velocity.y = -650;
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
        if (can.body.position.y > 493) {
          can.body.velocity.x = cupPath[cupIndex];
        }
        if(can.body.x - player.body.x <= 200) {
          can.body.gravity.y = 1000;
        }
        if(can.body.velocity.y > 0 && can.body.position.y < -47) {
          if (!fallSound.isPlaying) {
            fallSound.play();
          }
        }
        if(can.body.position.y > 493) {
          can.body.gravity.y = 0;
        }
        if(can.body.position.y === 495) {
          if(!hitSound.isPlaying) {
            hitSound.play();
          }
        }
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

  function collectHat (player, hat) {
    player.destroy();
    game.world.setBounds(0, 0, 0, 0);
    game.score = score;
    game.hitCount = hitCount;
    game.state.start('menu2');
  }

  function playerDeathHandler (player, enemy) {
    enemy.kill();
    player.animations.play('damage');
    explosionSound.play();
    enemy.body.x = -200000;
    player.body.y -= 75;
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
    bowties.forEachAlive(function(bowtie){
      game.debug.body(bowtie);
    });
  }
})();
