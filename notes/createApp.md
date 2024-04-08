# HOW TO CREATE A MERN APP

## CREATE A MERN (MONGODB, EXPRESS.JS, REACT.JS, NODE.JS) APP USING TERMINAL OR COMMAND-LINE INTERFACE (CLI)

1. **Create a new directory** for your project:
   
```bash
mkdir my-mern-app
cd my-mern-app
```

2. **Initialize a new Node.js project**:

```bash
npm init -y
```

3. **Install necessary dependencies**:
   
```bash
//Express.js for server-side framework
npm install express

//Mongoose for MongoDB object modeling
npm install mongoose

// Concurrently to run backend and frontend servers simultaneously
npm install concurrently

// Nodemon for automatic server restart on file changes
npm install nodemon --save-dev

npm install jsonwebtoken

npm install cors

npm install body-parser
```

4. **Set up your server**:
   
Create a file named `server.js` or `index.js` in the root directory and set up your Express server.

5. **Set up MongoDB**:
   
Set MongoDB database. You can set up a local instance or use a cloud-based service like MongoDB Atlas.

6. **Set up your React.js frontend**:
   
```bash
npx create-react-app client-side
```

This command will create a new directory named `client` with a basic React.js project structure.

7. **Update package.json to include scripts**:
   
Add the following scripts in your `package.json`:

```json
"scripts": {
  "start": "node server.js",
  "server": "nodemon server.js",
  "client": "npm start --prefix client",
  "dev": "concurrently \"npm run server\" \"npm run client\""
}
```

8. **Set up your backend and frontend code**:
   
Write your backend code in `server.js` and your frontend code in the `client` directory.

9. **Connect your frontend to the backend**:
   
You might need to set up proxy in `client/package.json` to forward API requests to the backend.

```json
"proxy": "http://localhost:5000"
```

10. **Run your app**:

```bash
npm run dev
