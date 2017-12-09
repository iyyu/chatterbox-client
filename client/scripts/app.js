// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages'
  
};

$(document).ready(function() {
  app.init();
});

app.init = function() {
  //initiate the stuff
  $('#refreshButton').on('click', () => {
    app.clearMessages();
    app.fetch();
    //fetch messages
  });
  $('#sendButton').on('click', () => {
    // send what is filled out the form
    var username = $('#usernameInput').val();
    var messageBody = $('#messageInput').val();
    if (username !== '' && messageBody !== '') {
      var messageObj = {
        username: username,
        text: messageBody 
      };
      app.send(messageObj);
    }
  });
};

app.send = function(message) {
  //send a message
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
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
  $.get(app.server, function(data) { //FYI ajax method defaults to GET
    // console.log(data);
    for (var i = 0; i < data.results.length; i++) {
      console.log(data.results[i]);
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
  var messageNode = $('<p>' + escapedStr + '</p>');
  $('#chats').prepend(messageNode);
};

app.renderRoom = function(roomName) {
  //grab all rooms from #roomSelector.children or sth
  //check if it exists
  $('#roomSelect').append(roomName);
};

