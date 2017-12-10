// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  currentRoom: 'lobby',
  rooms: ['lobby'],
  friendList: []
};

$(document).ready(() => {
  app.init();
});

app.init = () => {
  //initiate the stuff
  app.fetch();
  $('#refreshButton').on('click', () => {
    app.fetch();
  });
  $('#sendButton').on('click', () => {
    // send what is filled out the form
    app.handleSubmit();
    console.log('line after handle submit call');
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

app.handleSubmit = () => {
  var username = $('#usernameInput').val();
  var messageBody = $('#messageInput').val();
  if (username !== '' && messageBody !== '') {
    var messageObj = {
      username: username,
      text: messageBody 
    };
    messageObj.roomname = (app.currentRoom !== 'newRoom') ? app.currentRoom : $('#roomInput').val();
    app.send(messageObj);
  }
};

app.clearForm = () => {
  $('#usernameInput').val('');
  $('#messageInput').val('');
  $('#roomInput').val('');
};

app.send = (message) => {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: (data) => {
      app.clearForm();
      app.fetch();
      console.log('chatterbox: Message sent');
    },
    error: (data) => {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });  
};

app.fetch = () => {
  console.log('started fetching');
  console.time('fetch time');
  $.ajax({
    url: app.server, 
    type: 'GET',
    data: {
      order: '-createdAt',
    },
    success: (data) => { //FYI ajax method defaults to GET
      app.clearMessages();
      console.log('cleared messages');
      for (var i = 0; i < data.results.length; i++) {
        app.renderMessage(data.results[i]);
      }
      console.timeEnd('fetch time');
    },
    error: (data) => {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
      console.timeEnd('fetch time');
    }
  });
  
};

app.clearMessages = () => {
  // clear messages from the DOM
  $('#chats').html('');
};
//message { text: '<img src='img.jpeg'></img>'}
app.renderMessage = (message) => {
  message.roomname = message.roomname || 'lobby';
  if (message.text && message.roomname === app.currentRoom) {
    var escapedMessage = app.escapeString(message.text);
    var escapedUsername = app.escapeString(message.username);
    
    var messageNode = $('<div class="chat"></div>');
    var usernameNode = $(`<p class="username">${escapedUsername}</p>`);
    usernameNode.on('click', () => { //to add click handler to the specific instance of chat node
      app.handleUsernameClick(escapedUsername);
    });
    
    if (app.friendList.includes(escapedUsername)) {
      usernameNode.addClass('friend');
    }
    messageNode.append(usernameNode);
    messageNode.append($(`<p>${escapedMessage}</p>`));
    $('#chats').append(messageNode);
  }
  app.renderRoom(message.roomname);
};

app.renderRoom = (roomName) => {
  var escapedRoom = app.escapeString(roomName);
  if (!app.rooms.includes(escapedRoom)) {
    app.rooms.push(escapedRoom);
    var roomNode = $(`<option value="${escapedRoom}">${escapedRoom}</option>`);
    $('#roomSelect').append(roomNode);
  }
};

app.handleUsernameClick = (username) => {
  if (!app.friendList.includes(username)) {  
    app.friendList.push(username);
  } else {
    app.friendList.splice(app.friendList.indexOf(username), 1);
  }
  app.fetch();
};

app.escapeString = (string) => {
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
  for (var i = 0; i < string.length; i++) {
    if (escapers.hasOwnProperty(string[i])) {
      escapedStr += escapers[string[i]];
    } else {
      escapedStr += string[i];
    }
  }
  return escapedStr;
};

