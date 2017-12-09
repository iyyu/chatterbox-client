// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm8.hackreactor.com/'
};

$(document).ready(function() {
  app.init();
});

app.init = function() {
  //initiate the stuff
};

app.send = function(message) {
  //send a message
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: message,
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });  
};

app.fetch = function() {
  $.ajax('http://parse.sfm8.hackreactor.com/', function(data) { //FYI ajax method defaults to GET
    console.log(data);
  });
  
};

app.clearMessages = function() {
  // clear messages from the DOM
  $('#chats').html('');
};

app.renderMessage = function(message) {
  // var messageNode = $(`<span>${message.text}</span>`);
  var messageNode = $('<span>' + message.text + '</span>');
  $('#chats').append(messageNode);
};

app.renderRoom = function() {
  //check if room exists
  //create a new room node and append it to a #roomSelect node
};

