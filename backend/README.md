
## Backend Server Setup - READ CAREFULLY!!!

Instructions on how to set up your backend environment to connect to our database:

1. If you don't have a node_modules folder in the backend folder, run the following command in your terminal: npm install

2. Create a file in this folder (/backend) called '.env' and inside this file paste the following line:
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@cluster0.0w2jc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

3. Replace the bracketed parts of the above line with the username and password that were privately shared with you. Save the file.

4. Create an OpenAI account and follow their instrucions to get an API key for ChatGPT. Create another variable in your .env file: OPENAI_API_KEY=<your_key>

5. Create a file in the "firebaseAdmin" folder called "firebaseCredentials.json" and paste within it the JSON file found in the discord chat

5. The .gitignore file in /backend should already list the .env file, the firebaseCredentials.json, and the node_modules folder, but just in case make sure it contains those files. Never commit those files to github

7. To run the backend server on your machine, cd into the /backend folder and run the command 'npm start'. If everything works, you should see the message "Connected to MongoDB!" appear in the console.

8. To run the backend and frontend simultaneously, run the command 'npm run dev' from the backend folder. Make sure you look at the frontend README and follow the steps there as well
