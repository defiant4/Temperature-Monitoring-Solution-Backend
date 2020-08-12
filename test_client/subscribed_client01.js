/*---------------------------------------------------------------------*/
/* subscribed_client01.js
/*---------------------------------------------------------------------*/
/* Application file: subscribed_client01.js                            */
/* Author: Arnab Adhikari(arnabadhikari93@gmail.com)       23.07.2020  */
/*---------------------------------------------------------------------*/
/* This application can be started on Node.JS Releases greater 12.XX   */
/* This application uses Socket.io library Release 2.0   	       */
/* This is the interested client who has subscribed to the server      * 
 * for receiving the alerts/monitoring data every 5 seconds.           */
/*---------------------------------------------------------------------*/ 
/* PLEASE DO NOT CHANGE THE BELOW CODE MANUALLY!                       */
/*---------------------------------------------------------------------*/

var axios= require("axios");								//importing the axios module 
const io = require("socket.io-client");							//importing the socket.io client library
const config = require('../config.json');

const socket = io.connect('http://'+config.ip+':'+config.port,{reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax : 5000,
                reconnectionAttempts: 99999});	//connecting to the central server with reconnection parameters

var server_unique_token;	//to store the unique token from server
var post_json={"Client_Token":"CLIENT1","SID_List":["REF01","ACR01"],"SID_Count":2};	//JSON object to POST data

var url= "http://localhost:6002/api/registration";					//Subscription POST URL to POST data

//Checking if connection to server is successful(applicable for reconnection also)
socket.on('connect', function(){
  console.log("INFO: Connected to server with socket id:"+socket.id);
  //Axios POST call for subscription
  axios.post(url, post_json)
  .then(function (response) {
    server_unique_token=response.data;
    
    //server checking if sid count matches with sid list length
    if(server_unique_token == "ERROR")
      console.log("ERROR: SID_Count does not match with SID_List length in JSON body");
    else
      console.log("INFO: Success in Registration and received the token from server:"+server_unique_token);

    //emits an event to the server identified by the SERVER and CLIENT token
    socket.emit(server_unique_token,post_json.Client_Token);
  })
  //Runtime exception handling for POST request errors
  .catch(function (error) {
    console.log("ERROR in POST request");
  });
});

//event fired upon connection (including a successful reconnection) with the CLIENT unique token
socket.on(post_json.Client_Token, function (server_data) {
  console.log("Server Data:"+JSON.stringify(server_data));
});

//event fired upon a connection error
socket.on('connect_error', function() {
  console.log('ERROR: Failed to connect to server');
});

