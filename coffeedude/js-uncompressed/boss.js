(function(){
  'use strict';
  game.state.add('boss', {create:create, update:update});

  var jumpTimer = 0,
      map,
      layer,
      cursors,
      bowties,
      facing = 'right',
      bowtie,
      bowTime = 0,
      healthText,
      hitCount = 3,
      score,
      scoreText,
      fireButton,
      shotSound,
      explosionSound,
      jwb,
      jwbBounceCount = 0,
      jwbHitCount = 0,
      bullets,
      bullet,
      bulletTime = 0,
      text,
      style,
      victoryButton,
      player;

  function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    score = game.score;
    hitCount = game.hitCount;

    //sounds
    explosionSound = game.add.audio('explosion');
    shotSound = game.add.audio('shoot');
    game.world.setBounds(0, 0, 800, 640);

    game.bg = game.add.tileSprite(0, 0, 800, 640, 'bossBG');

    map = game.add.tilemap('bossfight');
    map.addTilesetImage('steampunk');
    map.addTilesetImage('blocks');
    map.setCollisionByExclusion([1]);

    layer = map.createLayer('platforms');
    layer.resizeWorld();

    //player stuff

    player = game.add.sprite(12, 520, 'head');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
    player.body.setSize(25, 50, 19, 0);
    player.body.gravity.y = 450;
    player.animations.add('left', [2]);
    player.animations.add('right', [1]);

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);

    //jwb
    jwb = game.add.sprite(640, 200, 'jwb');
    game.physics.enable(jwb, Phaser.Physics.ARCADE);
    jwb.animations.add('mad', [0, 1], 10, true);
    jwb.body.velocity.y = 200;

    //bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.createMultiple(5, 'bullet');
    bullets.setAll('body.setSize', 31, 15);

    //bowties
    bowties = game.add.group();
    bowties.enableBody = true;
    bowties.createMultiple(2, 'bowtie');
    bowties.setAll('body.setSize', 64, 36);

    scoreText = game.add.text(20, 20, 'Local Artists\' Vinyl: ' + game.score, { fontSize: '32px', fill: '#FFF', align: 'center' });
    scoreText.fixedToCamera = true;

    healthText = game.add.text(660, 20, 'Health: ' + game.hitCount, { fontSize: '32px', fill: '#FFF'});
    healthText.fixedToCamera = true;

    style = { font: "32px Arial", fill: "#fff", wordWrap: true, wordWrapWidth: jwb.width, align: "center" };

    text = game.add.text(0, 0, "You'll Never Get Me, Abe!", style);
    text.anchor.set(0.5);
  }

  function update() {

    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(jwb, layer);
    game.physics.arcade.collide(bullets, layer, collisionHandler, null, this);
    game.physics.arcade.overlap(bullets, player, playerDeathHandler, null, this);
    game.physics.arcade.overlap(bowties, layer, killBowtie, null, this);
    game.physics.arcade.overlap(bowties, jwb, jwbHit, null, this);

    player.body.velocity.x = 0;

    jwb.animations.play('mad');

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
        player.body.velocity.y = -300;
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
    //   player.body.velocity.y = -750;
    // } else if(cursors.down.isDown) {
    //   player.body.velocity.y = 750;
    // } else {
    //   player.body.velocity.y = 0;
    // }

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

    if(player.body.velocity.x >= 0) {
      facing = 'right';
    } else {
      facing = 'left';
    }

    //jwb

    if(jwb.body.blocked.down) {
      jwb.body.velocity.y = -200;
      jwbBounceCount++;
    }

    if(jwb.body.blocked.up) {
      jwb.body.velocity.y = 200;
      jwbBounceCount++;
    }

    if(jwb.body.blocked.left) {
      jwb.body.velocity.x = 200;
      jwbBounceCount++;
    }
    if(jwb.body.blocked.right) {
      jwb.body.velocity.x = -200;
      jwbBounceCount++;
    }

    if(jwbBounceCount === 4) {
      jwb.body.velocity.y = 200;
      jwb.body.velocity.x = -200;
    }

    if(jwbBounceCount === 20) {
      jwb.body.velocity.x = 0;
      jwbBounceCount = 0;
    }

    if (game.time.now > bulletTime && jwbHitCount < 3 && hitCount <= 0) {
      bullet = bullets.getFirstExists(false);
      if(bullet) {
        bullet.reset(jwb.x, jwb.y);
        bullet.body.velocity.x = -500;
        bulletTime = game.time.now + 800;
        game.physics.arcade.moveToObject(bullet, player, 500);
      }
    }

    // bullets.forEachAlive(function(bullet){
    //   game.physics.arcade.moveToObject(bullet, player, 500);
    //   var distanceFromJWB = 600;
    //   if(Math.abs(jwb.x - bullet.x) >= distanceFromJWB) {
    //    bullet.kill();
    //   }
    // }, this);

    text.x = Math.floor(jwb.x + jwb.width / 2) - 100;
    text.y = Math.floor(jwb.y + jwb.height / 2);

    if(jwbBounceCount === 2) {
      text.destroy();
    }

    if (score % 10 === 1) {
      hitCount++;
      score++;
      healthText.text = 'Health: ' + hitCount;
    }

    if(hitCount <= 0) {
      gameOver();
    }

  }

  function fireBowtie() {
   if (game.time.now > bowTime  && facing === 'right') {
    bowtie = bowties.getFirstExists(false);
    if (bowtie) {
      bowtie.reset(player.x - 30, player.y - 10);
      bowtie.body.velocity.x = 600;
      bowTime = game.time.now + 350;
      shotSound.play();
    }

    } else if (game.time.now > bowTime && facing === 'left') {
        bowtie = bowties.getFirstExists(false);

      if (bowtie) {
        bowtie.reset(player.x - 30, player.y - 10);
        bowtie.body.velocity.x = -500;
        bowTime = game.time.now + 750;
        shotSound.play();
      }
    }
  }

  // function fireBullet() {
  //   if (game.time.now > bulletTime) {
  //     if(bullet) {
  //       bullet.reset(jwb.x, jwb.y);
  //       bullet.velocity.x = -800;
  //       bulletTime = game.time.now + 500;
  //     }
  //   }
  // }

  function jwbHit(jwb, bowtie) {
    bowtie.kill();
    jwb.body.velocity.x *= 3;
    jwb.body.velocity.y *= 3;
    jwbHitCount++;
    if (jwbHitCount === 3) {
      jwbDeath();
    }
  }

  function jwbDeath() {
    jwb.body.velocity.x = 0;
    jwb.body.velocity.y = 0;
    text = game.add.text(0, 0, "Ach! You got me this time, Abe!", style);
    text.anchor.set(0.5);
    text.x = Math.floor(jwb.x + jwb.width / 2) - 100;
    text.y = Math.floor(jwb.y + jwb.height / 2);
    victoryButton = game.add.button(300, 150, 'victoryButton', newGame, this);
  }

  function newGame() {
    this.game.state.start('finalMenu');
  }

  function restartGame() {
    this.game.state.start('menu');
    hitCount = 2;
  }

  function killBowtie(bowtie, layer) {
    bowtie.kill();
  }

  function collisionHandler (bullet, layer) {
    bullet.kill();
  }

  function playerDeathHandler (player, enemy) {
    player.animations.play('damage');
    explosionSound.play();
    enemy.kill();
    player.body.x -= 75;
    --hitCount;
    healthText.text = 'Health: ' + hitCount;
  }

  function gameOver () {
    jwb.body.velocity.x = 0;
    jwb.body.velocity.y = 0;
    text = game.add.text(0, 0, "Better luck next time, Mr. 'President'!", style);
    text.anchor.set(0.5);
    text.x = Math.floor(jwb.x + jwb.width / 2) - 100;
    text.y = Math.floor(jwb.y + jwb.height / 2);
    victoryButton = game.add.button(300, 150, 'reStart', restartGame, this);
    victoryButton.scale.setTo(.5);
  }

  function render() {
    game.debug.body(jwb);
    game.debug.body(player);
  }
})();