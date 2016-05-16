// YOUR CODE HERE:
//https://api.parse.com/1/classes/chatterbox
// &, <, >, ", ', `, , !, @, $, %, (, ), =, +, {, }, [, and ]
//Example post: 
//var message = {
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// };


var app = {
  //Object to hold all messages
  data: {},
  //list all friends
  friends: [],
  //save server to a more managable var 
  server: 'https://api.parse.com/1/classes/chatterbox',
  //save username from window object
  userName: window.location.search.substr(10),

  //loads messages with fetch at the opening of the page (original version)
  // init: function(){
  //   app.fetch();
  // },

  //loads messages with fetch at the opening of the page 
  init: function() {
    // cache a dom reference so I don't repeat messages:
    app.$text = $('#message');
    app.fetch();
    //setInterval(app.fetch.bind(app),1000);
    $('#send').on('submit', app.handleSubmit);
  },



  fetch: function() {
    $.ajax({
      url: app.server,
      data: { order: '-createdAt'},
      contentType: 'application/json',
      success: function(json) {
        app.displayMessages(json.results);
      },
      // complete: function() {
      //   app.stopSpinner();
      // }
    })
  },

  //Original fetch
  // fetch: function(){
  //   $.ajax({
  //     url: app.server,
  //     type: 'GET',
  //     contentType: 'application/json; charset=utf-8',
  //     data: 'order=-createdAt',
  //     success: function(data) {
  //       app.data = data;

  //       // console.log('data["results"]: ', data['results']);

  //       app.sortData(data)
  //     },

  //     error: function(data) {
  //       console.error('chatterbox: Failed to get data');
  //     }
  //   });
  // },

  displayMessage: function(message) {
    if ( !app.data[message.objectId]) {
      var $html = app.renderMessage(message);
      $('#chats').append($html);
      app.data[message.objectId] = true;
    }
  }, 

  displayMessages: function(messages) {
    for (var i = 0; i < messages.length; i++) {
      app.displayMessage(messages[i]);
    }
  },

  renderMessage: function(message) {
    //Linting
    var entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;',
      "/": '&#x2F;'
    };
    function escapeHtml(string) {
      return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
      });
    }
    message.username = escapeHtml(message.username);
    message.text = escapeHtml(message.text);

    var $user = $("<div>",{class: 'user'}).text(message.username);
    var $text = $("<div>", {class:'text'}).text(message.text);
    var $message = $("<div>", {class: 'chat', 'data-id': message.objectId}).append($user, $text);
    return $message;
  },

  handleSubmit: function() {
    // e.preventDefault();
    var message = {
      username: app.username,
      text: app.$text.val()
    };
  },

  send: function(message){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      //add linter to prevent illegal messages
      data: JSON.stringify(message),
      dataType: 'json',
      contentType: 'application/json',
      success: function (data) {
        app.clearMessages();
        app.fetch();
        // message.objectId = json.objectId;
        // app.displayMessage(message)
      },
      // complete: function() {
      //   app.stopSpinner();
      // }
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },


  // sortData: function(data) {
  //   var node = {
  //     username: '',
  //     date: '',
  //     message: '',
  //     room: '',
  //     objectId: ''
  //   };

  //   var entityMap = {
  //     "&": "&amp;",
  //     "<": "&lt;",
  //     ">": "&gt;",
  //     '"': '&quot;',
  //     "'": '&#39;',
  //     "/": '&#x2F;'
  //   };

  //   //loop through data
  //   var chats = data.results;
  //   for (var i = 0; i < chats.length; i++) {
  //     for (var k in chats[i]) {
  //       // console.log(chats[i][k])
  //       if (k === 'objectId') {
  //         node.room = chats[i][k];
  //       }
  //       else if (k === 'username') {
  //         node.username = chats[i][k];
  //       }
  //       else if (k === 'createdAt') {
  //         node.date = chats[i][k];
  //       }
  //       else if (k === 'roomname') {
  //         node.room = chats[i][k];
  //       }
  //       else if (k === 'text') {
  //         // node.message = JSON.stringify(chats[i][k]).replace('setInterval', '');
  //         node.message = JSON.stringify(chats[i][k]).replace(/[&<>\/]/g, function(char) {
  //           return entityMap[char];
  //         });
  //         // .escape("&<>\"'`!@$%()=+{}[]")
  //       }
  //       var msg = $('<div>').addClass('message');
  //       msg.append($('<h3>').text(node.username).addClass('username'));
  //       msg.append($('<p>').text(node.message));
  //       msg.append($('<p>').text(node.date));
  //       msg.append($('<p>').text(node.room));

  //       app.appendMessage(msg);
  //     }
  //   };
  // },

  clearMessages: function() {  
    $('#chats').empty();
  },

  addMessage: function(message) {
    var msg = $('<div>').addClass('message');
    msg.append($('<h3>').addClass('username').text(message.username));
    msg.append($('<p>').text(message.text));
    msg.append($('<p>').text(message.roomname));
    
    app.send(message);
    app.appendMessage(msg)
  },


  appendMessage: function(message) {
    $('#chats').append(message);
  },


  addRoom: function(room) {
    var option = $('<option>').text(room);
    $('#roomSelect').append(option);
  },

  addFriend: function(username) {
    app.friends.push(username);
    app.friends = _.uniq(app.friends);
  },


  // handleSubmit: function(message) {
  //   app.send(message);
  //   app.fetch();

  // },






};

$(document).ready(function() {
  // app.init(); // Initialize app
  
  $('#clear').on('click', function() {
    app.clearMessages();
  });

  $('#main').on('click', '.username', function() {
    app.addFriend(this.textContent);
    // console.log(app.friends);
  });

  $('.submit').on('click', function(e) {
    e.preventDefault();
    var msg = $('#message').val();
    var newMsg = {
      username: app.userName,
      text: msg,
      //createdAt: new Date(),
      roomname: 'lobby'
      //updatedAt: new Date()
    };
    app.handleSubmit(newMsg);
  });


});

///////////////////////////////////////////////////////////////////////
// Simplified jQuery-based implementation of chatterbox-client
///////////////////////////////////////////////////////////////////////


// var app = {

//   server: 'https://api.parse.com/1/classes/chatterbox',

//   init: function() {
//     console.log('running chatterbox');

//     // Get username:
//     app.username = window.location.search.substr(10);

//     app.onscreenMessages = {};

//     // cache a dom reference:
//     app.$text = $('#message');

//     app.loadMsgs();
//     setInterval(app.loadMsgs.bind(app),1000);

//     $('#send').on('submit', app.handleSubmit);
//   },

//   handleSubmit: function(e) {
//     e.preventDefault();
//     var message = {
//       username: app.username,
//       text: app.$text.val()
//     };

//     app.$text.val('');

//     app.sendMsg(message);
//   },

//   renderMessage: function(message) {
//     var $user = $("<div>",{class: 'user'}).text(message.username);
//     var $text = $("<div>", {class:'text'}).text(message.text);
//     var $message = $("<div>", {class: 'chat', 'data-id': message.objectId}).append($user, $text);
//     return $message;
//   },

//   displayMessage: function(message) {
//     if( !app.onscreenMessages[message.objectId]) {
//       var $html = app.renderMessage(message);
//       $('#chats').prepend($html);
//       app.onscreenMessages[message.objectId] = true;
//     }
//   }, 

//   displayMessages: function(messages) {
//     for(var i = 0; i < messages.length; i++) {
//       app.displayMessage(messages[i]);
//     }
//   },

//   loadMsgs: function() {
//     $.ajax({
//       url: app.server,
//       data: { order: '-createdAt'},
//       contentType: 'application/json',
//       success: function(json) {
//         app.displayMessages(json.results);
//       },
//       complete: function() {
//         app.stopSpinner();
//       }
//     })
//   },

//   sendMsg: function(message) {
//     app.startSpinner();
//     $.ajax({
//       type: 'POST',
//       url: app.server,
//       data: JSON.stringify(message),
//       contentType: 'application/json',
//       success: function(json) {
//         message.objectId = json.objectId;
//         app.displayMessage(message)
//       },
//       complete: function() {
//         app.stopSpinner();
//       }
//     });
//   },

//   startSpinner: function() {
//     $('spinner img').show();
//     $('form input[type=submit]').attr('disabled', "true");
//   },

//   stopSpinner: function() {
//     $('.spinner img').fadeOut('fast');
//     $('form input[type=submit]').attr('disabled', null);
//   }

// };




