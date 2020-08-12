/*---------------------------------------------------------------------*/
/* central_server.js
/*---------------------------------------------------------------------*/
/* Application file: central_server.js                                 */
/* Author: Arnab Adhikari(arnabadhikari93@gmail.com)       23.07.2020  */
/*---------------------------------------------------------------------*/
/* This application can be started on Node.JS Releases greater 12.XX   */
/* This application uses Socket.io library Release 2.0                 */
/* The central server receives the data from the sensor client(s)      * 
 * every 5 seconds. Then it transmits the data to the interested       * 
 * client(s) who subscribe for the data/alerts.                        *
 * Both the connections and data transmission happen in real time.     */
/*---------------------------------------------------------------------*/ 
/* PLEASE DO NOT CHANGE THE BELOW CODE MANUALLY!                       */
/*---------------------------------------------------------------------*/

const app = require('express')();			//importing the express module 
const server = require('http').createServer(app);	//importing the http module 
const io = require("socket.io")(server);		//importing the socket.io server library
const body_parser = require("body-parser");		//importing the body-parser library to parse JSON content-type
const config = require('../config.json');
var reported_sensor_reading={};			//to store temperature and timestamp values from sensor01 and sensor02
var subscription_info={};			//to store System ID(s) from subscribed client
//var arr_ref=[];var arr_acr=[];var arr_rom=[];

//to parse content-type JSON
app.use(body_parser.json());					

//CORS Middleware
app.use(function (req, res, next) {
  //Enabling CORS 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
  next();
});

var random_int= Math.round(random_number(100,500));

//converting random integer value to string to pass as response for subscription POST request(s)
var server_unique_token=random_int.toString(); 

//generates random unique key value for each client request
function random_number(min, max) {
  return Math.random() * (max - min) + min;
}

//POST API WebHook for Client(s) Subscription 
app.post("/api/registration", (req, res) => {
  var sid_len = req.body.SID_Count;
  var len_int=parseInt(sid_len);		//converting to integer
  var i=0; var sid_list_arr=[];

  if(len_int === req.body.SID_List.length)
  {
    while(i<len_int){
      sid_list_arr.push(req.body.SID_List[i]);
      i++;
    }
    subscription_info[req.body.Client_Token]=sid_list_arr;		//subscription_info[CLIENT1]=[ACR01,ROM02]
    res.send(server_unique_token);	//sending server token to the subscribed client
  }
  else
    res.send("ERROR");		//If sid count does not match with the sid list length
  res.status(200).end();			//Properly ending response on successful processing
})

//event fired upon a client connection(including a successful client reconnection)
io.on("connection", (socket) => {
  console.log("INFO: Client connected with socket id:"+socket.id);

  //event fired upon connection(including a successful reconnection) with the identifier sensor01
  socket.on('sensor', function (sensor_data) {
    for (var i=0;i<sensor_data.metrics.length;i++)
    {
    reported_sensor_reading[sensor_data.metrics[i].SID]={Temperature:sensor_data.metrics[i].Temperature,Timestamp:sensor_data.Timestamp};
    }
    console.log("Sensor Client Data:"+JSON.stringify(sensor_data));
  });

/*for (var i= 0; i<finalvalue.length;i++)
{
if(finalvalue[i].hasOwnProperty('REF'))
arr_ref.push(finalvalue[i].REF);
if(finalvalue[i].hasOwnProperty('ACR'))
arr_acr.push(finalvalue[i].ACR);
if(finalvalue[i].hasOwnProperty('ROM'))
arr_rom.push(finalvalue[i].ROM);
}*/

  //event fired upon connection (including a successful reconnection) with the server and CLIENT unique token
  socket.on(server_unique_token, function (client_token) {
    //frequency of 5 seconds
    setInterval(() => {
              var sid_info=subscription_info[client_token];	//stores the SID(s) of subscribed client(as per the CLIENT token) 
        var sid_data={};				//to store the response data for the subscribed client		
        var len = sid_info.length;
        for(var i=0;i<len;i++)
        {
          sid_data[sid_info[i]]=reported_sensor_reading[sid_info[i]];
        }
        //emits an event to the subscribed client identified by the unique CLIENT token
        socket.emit(client_token,sid_data);
    },config.frequency);   //5 seconds(frequency is fetched from config.json)
  });

  //event fired upon a client disconnection
  socket.on('disconnect', function() {
      console.log("INFO: Client disconnected with socket id:"+ socket.id);
  });
});

io.close();			//Close current server properly on disconnection

server.listen(config.port);	//http server listening on port:6002(port is fetched from config.json)

