(function() {
  game.state.add('bossMenu', {create:create});
  var button,
      score,
      hitCount,
      enterKey;

  function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'bossLvlMenu');
    button = game.add.button(300, 475, 'start', startBoss, this);
    button.scale.setTo(.5);

    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    // enterKey.onDown.add(startLvl2);
  }

  function startBoss () {
    this.game.state.start('boss');
  }

  // function startLvl2(){
  //   game.state.start('boss');
  // }


})();