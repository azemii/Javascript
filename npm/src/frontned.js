function displayNumber(number) {
    var placeholder = document.getElementById("placeholder");
    placeholder.innerHTML = number;
  }
  
  var dice = new Dice(6);
  var button = document.getElementById("button");
  
  button.onclick = function() {
    console.log('clicked');
    var result = dice.roll();
    displayNumber(result);
  };
  