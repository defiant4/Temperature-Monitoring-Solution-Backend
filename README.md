# Temperature-Monitoring-Solution-Backend

Simplified backend components of a temperature monitoring solution implemented using web technology.

## Status

This project contains simplified components of a monitoring solution which has been implemented using web
technology. It has 3 parts:
- Source code for server.
- Source code for simulated sensor clients with random temperature values.
- Source code for test client(interested/subscribed clients)

## Getting Started

The application is a part of an overall temperature monitoring solution. Various temperature
sensors send real time temperature updates to the server(here, random whole integer values are being generated to simulate the sensor). There are http clients which are interested in continuously monitoring the temperature and they subscribe for it with the server. Whenever server receives an update, it publishes the real-time updates to all interested clients. Every real-time data transmission occurs with a frequency of 5 seconds as of now.

### Pre-installation Information

I have used the following technologies to implement this project:
Node.js, NPM, Socket.io, PM2, Linux OS.

Please note that the 3 parts have been automated(except historical data) since I am not using any DB or persistence layer in this project. Also, the sensor client connections with the central server have been hardcoded with the identifiers "sensor01" and "sensor02", which can later be automated using the same SERVER-CLIENT key pair logic as the server-subscribed clients. Any number of clients/System-IDs(SIDs) can be used to connect to the server since the whole application is highly scalable. I have currently used 3 keywords for 3 SIDs such as REF->Refrigerators, ACR->Air-Coolers, ROM-> Room. More information on this is available in the Web Service Interface Document.

### Installing

This application has been developed focusing on Linux OS and the [Setup.md](https://github.com/defiant4/Temperature-Monitoring-Solution-Backend/blob/master/Setup.md) installation guide is intended for Linux users mostly. But interested users can use this code on Windows or Mac too.(The codebase has also been tested on Windows).

Please read the [Setup.md](https://github.com/defiant4/Temperature-Monitoring-Solution-Backend/blob/master/Setup.md) file for detailed information on how to run this project.

## Running the tests

Apart from the main central_server.js we have 2 sensor clients(sensor_client01.js and sensor_client02.js) and also 2 interested clients(subscribed_client01.js and subscribed_client02.js) for testing.

Ideally, you should start the server first , then the sensor clients and finally the interested clients. But proper connection error and disconnection has been handled in the websocket, hence you can start the application in any order you want for testing and you would get the relevant messages.
For any ERROR other than connection errors, you would need to run the relevant js files once more.

### Break down into end to end tests

The sensor clients send real time data in JSON format to the central server every 5 seconds and prints the same on the console.

The central server receives the data from the sensor clients, prints the acknowledged data on the console and then processes it.
The central server provides a Webhook POST API so that interested clients can subscribe to it. Once the interested clients subscribe to the server, the server acknowledges the same with the CLIENT unique key and sends its own random generated unique key to each client.
Then the server verifies the connection with the respective subscribed clients once more and sends the relevant data for the requested System-IDs(SIDs) in JSON format.

The interested clients send POST request(which includes the POST url, POST JSON body, CLIENT unique key) to the server using axios(http) and once subscription is successful ,it receives a unique key from the server.]
After successful subscription, the client requests for real time data from the server which then in response verifies the client request and starts sending requested SIDs data(in JSON format) to the subscribed client.


### And coding style tests

I have used Vanilla Javascript(ES6) with Node.js(v12.00XX) and Socket.io(2.0) for coding the whole codebase.
Proper coding indentation and comments have been maintained throughout each js file for easy code readability.

## Deployment

You can use simple node command to run the files on the session itself and logs would be available on the same shell.
For daemonizing , I have used the PM2 tool. More information on this is available in the Setup.md file.

## Built With

1. Node.js -> https://nodejs.org/en/
2. NPM -> https://www.npmjs.com/
3. Socket.io -> https://socket.io/
4. PM2 -> https://pm2.keymetrics.io/

## Versioning

Currently, there is only 1 active version of this project.

## Author

* **Arnab Adhikari** - *Complete E2E Development*

## License

This project is currently not licensed and is free to use subject to clearance from the author.

## Acknowledgments

* Hat tip to Mr.Kiran Kumar M R for his support.
