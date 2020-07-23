# Setup/Installation Steps for this Backend Project

You can use the steps below to setup and install the required dependencies to run and test this project:

1. Install Node.js from the official site: https://nodejs.org/en/download/
	You can even use Google to search the different ways to install node.js for various flavours of Linux OS.
	For Windows OS, always install the latest LTS version.
	
2. Create a new directory(assuming the directory name is: nodejs_app).
    Once you are in the above directory you can run the following commands from the terminal to check whether node and npm is available or not and also check the version:
	node -v
	npm -v
	
3. Now in the same directory install the following modules using npm:

		a) npm init -> This initializes and creates the package.json. It also asks you series of development signature related questions and you can press ENTER and skip(with default values) if you want(since this is for demo purpose only).
		The package.json is the main file which will help in installing npm modules by saving the dependencies inside it.
		b) npm config set strict-ssl false -> since we are using the same server(localhost) for all the trasmission and communication.
		c) npm install npm-install-all
		d) npm install express
		e) npm install axios
		f) npm install body-parser
		g) npm install socket.io
		h) npm install pm2 -g -> installs production process manager to daemonize and run the js files. Run pm2 list command on the terminal after pm2 installtion to check if pm2 is working or not. If not working or stuck, run pm2 kill and then pm2 list once more.
		
		Please note that for any issues related to npm modules you can search on Google or you can use the official site: https://www.npmjs.com/
		For socket.io , you can use: https://socket.io/get-started/chat/
		For PM2 : https://pm2.keymetrics.io/docs/usage/quick-start/
		
4. Now in the same directory(nodejs_app) clone the codebase using git     clone(https://github.com/defiant4/Temperature-Monitoring-Solution-Backend.git).

5. Session-based: Once cloned, now to run the application you need to go to the relevant directories.
				  server-> contains the central_server.js file
				  simulated_sensor-> contains the sensor_client01.js and sensor_client02.js files
                  test_client-> contains the subscribed_client01.js and subscribed_client02.js files
   
   Ideally you should run the server first then the simualted sensor clients and finally the interested clients.
   But in this project I have handled connection errors and disconnections properly and hence you can run in any sequence and you would receive the relevant messages.
   Please note that for any ERROR apart from connection error you will have to run the relevant files once more.
   
   To run any file you can use node <filename.js> on the terminal and in the same session(shell), the messages would be visible to you via the console.
   For example, if I want to run the central_server.js file I would go to the server directory and run the command:
   node central_server.js. For each file/application you would have to open separate sessions(shell) to run them.
   
6. Daemonize the applications: Now to daemonize the applications I have used the PM2 tool.
							   If you would like to start an application you need to run: 
							   pm2 start <filename.js> -l ./filename.log
							   To list the processes, run: pm2 list
							   To stop a process:
							   pm2 stop <filename>
							   To check logs use:
							   pm2 logs <filename>
	
  For example, if I want to start and daemonize the central_server.js file, I would go to the server directory and use the following commands:
								pm2 start central_server.js -l ./central_server.log (storing the logs in the same directory with the name central_server.log)
								To list: pm2 list
								To stop:
								pm2 stop central_server
								To check the logs:
								pm2 logs central_server
								
								To flush all the logs, use the command:
								pm2 flush
								
  For more information on pm2 commands, you can do pm2 --help from the terminal or use the following link:
  https://pm2.keymetrics.io/docs/usage/quick-start/		

N.B: For further queries you can always reach out me at arnabdhikari93@gmail.com



