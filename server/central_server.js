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

const app = require('express')();				//importing the express module 
const server = require('http').createServer(app);		//importing the http module 
const io = require("socket.io")(server);			//importing the socket.io server library
const bodyParser = require("body-parser");			//importing the body-parser library to parse JSON content-type

var value={}; 							//to store temperature and timestamp values from sensor01 and sensor02
var finalvalue={};						//to store System ID(s) from subscribed client
//var arr_ref=[];var arr_acr=[];var arr_rom=[];

//to parse content-type JSON
app.use(bodyParser.json());					

//CORS Middleware
app.use(function (req, res, next) {
	//Enabling CORS 
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
	next();
});

var random_int= Math.round(randomNumber(100,500));

//converting random integer value to string to pass as response for subscription POST request(s)
var server_unique=random_int.toString(); 

//generates random unique key value for each client request
function randomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

//POST API WebHook for Client(s) Subscription 
app.post("/api/registration/:sid_length", (req, res) => {
	var sid_len = req.params.sid_length;  //length parameter from the POST url in string
	var len_int=parseInt(sid_len);        //converting to integer
	var i=1; var sid_arr=[req.body.Unique];
	if(typeof (req.body["SID"+(len_int)]) !== "undefined")
	{
		while(i<=len_int){
			sid_arr.push(req.body["SID"+i]);
			i++;
		}
		finalvalue[req.body.Unique]=sid_arr;
		res.send(server_unique);     //sending server unique key to the subscribed client
	}
	else
		res.send("ERROR"); 	     //If received POST URL is not as expected
	res.status(200).end(); 		     //Properly ending response on successful processing
})

//event fired upon a client connection(including a successful client reconnection)
io.on("connection", (socket) => {
	console.log("INFO: Client connected with socket id:"+socket.id);

	//event fired upon connection(including a successful reconnection) with the identifier sensor01
	socket.on('sensor01', function (data) {
		for (var i=0;i<data.metrics.length;i++)
		{
		value[data.metrics[i].SID]={Temperature:data.metrics[i].Temperature,Timestamp:data.Timestamp};
		}
		console.log("Sensor Client-1 Data:"+JSON.stringify(data));
	});

	//event fired upon connection(including a successful reconnection) with the identifier sensor02
	socket.on('sensor02', function (data) {
		for (var i=0;i<data.metrics.length;i++)
                {
                value[data.metrics[i].SID]={Temperature:data.metrics[i].Temperature,Timestamp:data.Timestamp};
                }
		console.log("Sensor Client-2 Data:"+JSON.stringify(data));
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

	//event fired upon connection (including a successful reconnection) with the the unique key-value pair
	socket.on(server_unique, function (data) {
		//frequency of 5 seconds
		setInterval(() => {
			var res_sid=finalvalue[data];			//stores the SID(s) of subscribed client(as per the SERVER-CLIENT key pair) 
			var unique=res_sid[0];				//stores unique key of the subscribed client(as per the SERVER-CLIENT key pair)

			//verifying whether unique CLIENT key is matching with subscription data
			if(data == unique){
				var sid_data={};      			//to store the response data for the subscribed client		
				var len = res_sid.length;
				for(var i=1;i<len;i++)
				{
					sid_data[res_sid[i]]=value[res_sid[i]];
				}
				//emits an event to the subscribed client identified by the unique CLIENT key
				socket.emit(data,sid_data); 	
			}
			else
				console.log("ERROR in verification with subscribed client");   //If the unique CLIENT key does not match with the server data
		},5000);   //5 seconds
	});
});

io.close();                 //Close current server properly on disconnection

server.listen(6002);	    //http server listening on port:6002

