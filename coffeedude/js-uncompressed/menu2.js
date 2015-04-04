(function() {
  game.state.add('menu2', {create:create});
  var button,
      score,
      hitCount,
      enterKey;

  function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'menu2');
    button = game.add.button(300, 475, 'start', start2, this);
    button.scale.setTo(.5);

    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    // enterKey.onDown.add(startLvl2);
  }

  function start2 () {
    this.game.state.start('lvl2');
  }

  // function startLvl2(){
  //   game.state.start('boss');
  // }


})();