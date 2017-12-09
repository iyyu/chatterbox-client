// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  currentRoom: 'lobby',
  rooms: ['lobby']
};

$(document).ready(function() {
  app.init();
});

app.init = function() {
  //initiate the stuff
  app.fetch();
  $('#refreshButton').on('click', () => {
    app.fetch();
  });
  $('#sendButton').on('click', () => {
    // send what is filled out the form
    var username = $('#usernameInput').val();
    var messageBody = $('#messageInput').val();
    if (username !== '' && messageBody !== '') {
      var messageObj = {
        username: username,
        text: messageBody, 
      };
      if (app.currentRoom !== 'newRoom') {
        messageObj.roomname = app.currentRoom;
      } else {
        messageObj.roomname = $('#roomInput').val();
        // user needs to see messages from the new room
        // make newly create room to be the selected room
      }
      // messageObj.roomname = (app.currentRoom !== 'newRoom') ? app.currentRoom : $('#roomInput').val();
      app.send(messageObj);
    }
  });
  $('#roomSelect').change((e) => {
    let selectedName = $('#roomSelect').find(':selected').val();
    if (selectedName === 'newRoom') {
      $('#roomInputTitle').show();
      $('#roomInput').show();
    } else {
      $('#roomInputTitle').hide();
      $('#roomInput').hide();
    }
    app.currentRoom = selectedName;
    console.log('selected: ' + app.currentRoom);
    app.fetch();
  });
  // setInterval(app.fetch, 5000);
};

app.clearForm = function() {
  $('#usernameInput').val('');
  $('#messageInput').val('');
  $('#roomInput').val('');
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    // data: message,
    contentType: 'application/json',
    success: function (data) {
      app.clearForm();
      app.fetch();
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });  
};

app.fetch = function() {
  console.log('started fetching');
  console.time('fetch time');
  $.ajax({
    url: app.server, 
    type: 'GET',
    data: {
      order: '-createdAt',
    },
    success: function(data) { //FYI ajax method defaults to GET
      app.clearMessages();
      console.log('cleared messages');
      for (var i = 0; i < data.results.length; i++) {
        app.renderMessage(data.results[i]);
      }
      console.timeEnd('fetch time');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
      console.timeEnd('fetch time');
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
  
  message.roomname = message.roomname || 'lobby';
  if (message.text && message.roomname === app.currentRoom) {
    var escapedStr = '';
    for (var i = 0; i < message.text.length; i++) {
      if (escapers.hasOwnProperty(message.text[i])) {
        escapedStr += escapers[message.text[i]];
      } else {
        escapedStr += message.text[i];
      }
    }
    var messageNode = $('<p>' + escapedStr + '</p>');
    $('#chats').append(messageNode);
  }
  app.renderRoom(message.roomname);
};

app.renderRoom = function(roomName) {
  //grab all rooms from #roomSelector.children
  //check if it exists
  if (!app.rooms.includes(roomName)) {
    app.rooms.push(roomName);
    var roomNode = $(`<option value="${roomName}">${roomName}</option>`);
    $('#roomSelect').append(roomNode);
  }
  
};

