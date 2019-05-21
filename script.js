/** Hangman **/


function ready() {
  start();
  $('#new-game').on('click', start);
  $('#guess').on('click', guessButtonClicked);

}

function start() {
  $('.remaining-guesses').html('<span class="remaining">7</span> guesses left');
  $('#guess').show();
  $('.letter').show();
  $('.letter').val('');
  $('.attempts').html('');
  // setup
  // 1. request information from the API
  $.ajax({
    type: 'post',
    url: 'http://hangman-api.herokuapp.com/hangman',
  }).then(handleAfterSetup);
}

function handleAfterSetup(data) {
  // 2. hide the new game button
  $('#new-game').hide();
  //console.log(data);
  // 3. Put the text in the board and the token in the hidden field
  updateWord(data.hangman);
  updateToken(data.token)

}

function guessButtonClicked() {
  // 5. get the value of the guess
  var letter = $('.letter').val();
  var token = $('.token').val();
  var attempts = $('.attempts').text().toLowerCase();
  //console.log(attempts)
  //console.log(letter)
  // $('.letter').val('...');
  $('#guess').hide();
  //console.log(letter)
  $.ajax({
    type: 'put',
    url: 'http://hangman-api.herokuapp.com/hangman',
    data: {'token': token, 'letter': letter}  
  }).then(function(data) {
    $('#guess').show();
  	// $('.hangman-word').text(data.hangman);
    updateWord(data.hangman)
    updateToken(data.token);
    $('.letter').val('');
    var newSpan = document.createElement('span');
    $(newSpan).text(letter)
    $('.attempts').append(newSpan)
    //console.log(newSpan)
 if (data.correct) {
      newSpan.className = 'correct'
    } else {
      newSpan.className = 'wrong'
      var remaining = $(".remaining").text($(".remaining").text()-1);

      if ($('.remaining').text() == 0) {
        showStartNewGame(token)
      }

    }
  });
}


function updateWord(value) {
  $('.hangman-word').text(value)
}

function updateToken(value) {
  $(".token").val(value)
}

function showStartNewGame(token) {
  $.ajax({
    type: 'get',
    url: 'http://hangman-api.herokuapp.com/hangman',
    data: {'token': token}  
  }).then(function(data) {
    //console.log("DATA: ",data);
    //console.log($('.hangman-word').text());
    // $('.hangman-word').text(data.solution);
    updateWord(data.solution)
    updateToken(data.token);
    $('#new-game').show();
    $('#guess').hide();
    $('.letter').hide();
  });
}

$(ready)



