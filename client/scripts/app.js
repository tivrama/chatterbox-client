// YOUR CODE HERE:
//https://api.parse.com/1/classes/chatterbox

// &, <, >, ", ', `, , !, @, $, %, (, ), =, +, {, }, [, and ]

var app = {
  data: {},
  friends: [],
  server: 'https://api.parse.com/1/classes/chatterbox',

  init: function(){
    app.fetch();
    // console.log('test');
    // $('#chats').text('hello');
  },

  send: function(message){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      //add linter to prevent illegal messages
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent. Message: ', message);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });


  },

  fetch: function(){
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/JSON',
      success: function(data) {
        // console.log(data.results);
        // console.log('get data before stringify, ', data);
        app.data = data;
        // console.log(JSON.stringify(data));
        // $('#chats').append(JSON.stringify(data).replace('setInterval', ''));

        data['results'] = data['results'].sort(function(a,b) {
          return a.createdAt < b.createdAt ? -1 : 1;
        });

        console.log('sorted data:', data['results']);

        app.sortData(data)
      },

      error: function(data) {
        console.error('chatterbox: Failed to get data');
      }
    });
  },

  sortData: function(data) {
    var node = {
      username: '',
      date: '',
      message: ''
    };
    //loop through data
    var chats = data.results;
    for (var i = 0; i < chats.length; i++) {
      for (var k in chats[i]) {
        if (k === 'username') {
          node.username = chats[i][k];
        }
        else if ( k === 'createdAt') {
        node.date = chats[i][k];
        }
        else if ( k === 'text') {
        node.message = JSON.stringify(chats[i][k]).replace('setInterval', '');
        }
        var msg = $('<div>').addClass('message');
        msg.append($('<h3>').text(node.username).addClass('username'));
        msg.append($('<p>').text(node.message));
        msg.append($('<p>').text(node.date));

        $("#chats").append(msg);
      }
    }
  },

  clearMessages: function() {  
    $('#chats').empty();
  },

  addMessage: function(message) {
    var msg = $('<div>').addClass('message');
    msg.append($('<h3>').addClass('username').text(message.username));
    msg.append($('<p>').text(message.text));
    msg.append($('<p>').text(message.roomname));
    
    $('#chats').append(msg);
    app.send(message);
  },

  addRoom: function(room) {
    var option = $('<option>').text(room);
    $('#roomSelect').append(option);
  },

  addFriend: function(username) {
    app.friends.push(username);
    app.friends = _.uniq(app.friends);
  },


  handleSubmit: function(message) {
    app.send(message);
    app.fetch();

  },



};

$(document).ready(function() {
  app.init(); // Initialize app
  
  $('#clear').on('click', function() {
    app.clearMessages();
  });

  $('#main').on('click', '.username', function() {
    app.addFriend(this.textContent);
    console.log(app.friends);
  });

  $('.submit').on('click', function(e) {
    e.preventDefault();
    console.log('hello');
    var msg = $('#message').val();
    app.handleSubmit(msg);
  });


});



