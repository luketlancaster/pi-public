(function() {
  game.state.add('finalMenu', {create:create});
  var startButton,
      enterKey;

  function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'finalMenu');
    startButton = game.add.button(300, 400, 'reStart', backToStart, this);
    startButton.scale.setTo(.5);

    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    // enterKey.onDown.add(startLvl2);
  }

  function backToStart () {
    this.game.state.start('level3');
  }

  // function startLvl2(){
  //   game.state.start('boss');
  // }


})();
