
## Backend Server Setup - READ CAREFULLY!!!

Instructions on how to set up your backend environment to connect to our database:

1. If you don't have a node_modules folder in the backend folder, run the following command in your terminal: npm install

2. Create a file in this folder (/backend) called '.env' and inside this file paste the following line:
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@cluster0.0w2jc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

3. Replace the bracketed parts of the above line with the username and password that were privately shared with you. Save the file.

4. The .gitignore file in /backend should already list the .env file, but just in case, make sure it contains that file. NEVER COMMIT THE .env FILE TO GITHUB!!!!!

5. Make sure the .gitignore file in /backend also lists your node_modules folder. You should never commit this folder to github

6. To run the backend server on your machine, cd into the /backend folder and run the command 'npm start'. If everything works, you should see the message "Connected to MongoDB!" appear in the console.
