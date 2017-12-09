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
  $.get('http://parse.sfm8.hackreactor.com/chatterbox/classes/messages', function(data) { //FYI ajax method defaults to GET
    // console.log($('a text')); //data = array of messageObj
    // console.log($('<a href="http://www.walmart.com">clickme</a>'));
    for (var i = 0; i < data.results.length; i++) {
      app.renderMessage(data.results[i]);
    }
  });
  
};

app.clearMessages = function() {
  // clear messages from the DOM
  $('#chats').html('');
};
//message { text: '<img src='img.jpeg'></img>'}
app.renderMessage = function(message) {
  //  &, <, >, ", ', `, , !, @, $, %, (, ), =, +, {, }, [, and ]
  var escapers = {
    '&': '&#38;',
    '<': '&#60;',
    '>': '&#62;',
    '"': '&#34;',
    '\'': '&#39;',
    '`': '&#96;',
    ',': '&#44;',
    '!': '&#33;',
    '@': '&#64;',
    '$': '&#36;',
    '%': '&#37;',
    '(': '&#40;',
    ')': '&#41;',
    '=': '&#61;',
    '+': '&#43;',
    '{': '&#123;',
    '}': '&#125;',
    '[': '&#91;',
    ']': '&#93;'
  };
  
  var escapedStr = '';
  
  if (message.text) {
    for (var i = 0; i < message.text.length; i++) {
      if (escapers.hasOwnProperty(message.text[i])) {
        escapedStr += escapers[message.text[i]];
      } else {
        escapedStr += message.text[i];
      }
    }
  }
  console.log(escapedStr);
  var messageNode = $('<p>' + escapedStr + '</p>');
  $('#chats').prepend(messageNode);
};

app.renderRoom = function(roomName) {
  //grab all rooms from #roomSelector.children or sth
  //check if it exists
  $('#roomSelect').append(roomName);
};

