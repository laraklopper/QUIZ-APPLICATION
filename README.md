# QUIZ APPLICATION
Final capstone task

The web application is a quiz application. The intended users who will benefit from the application are individuals who enjoy quiz games for recreational purposes.
The application is written using `MERN stack` which is a popular open source `JavaScript-based` developer friendly web stack. MERN stack uses `MongoDB` (a `NoSQL` database), to handle the database, `React.js` to create the front-end, `Express.js` to create the backend and uses `Node.js` as the runtime environment.

## TABLE OF CONTENTS
1. [HOW TO USE THE APPLICATION](#how-to-use-the-application) 
2. [HOW TO RUN THE APPLICATION](#how-to-run-the-application)
3. [DEPLOYEMENT](#deployment)
4. [REFERENCES](#references)


## HOW TO USE THE APPLICATION 

To use the application users are required to register(sign up) and login. Users are also able to register as admin users subject to certain age restrictions controlled by custom middleware. 
After login users are able to add quizzes and play quizzes. Users are also able to edit their user account. 

The application also allows users to edit and delete quizzes subject to certain requirements based on whether the user is a normal endpoint or an admin user. 
Admin users are allowed certain privileges such as the ability to edit or delete any quiz and also view all users and remove users. 
## HOW TO RUN THE APPLICATION
A `proxy server` is included in the front-end to allow the front and back-end to run together. The application uses `‘nodemon’` third-party middleware in the backend to allow the application to run the backend and front-end in the command line interface(CLI) or terminal using `npm start`. The folders must, however, be run separately.
The server is started (listens) on the port specified in the .env file using `app.listen()` in the app.js file or defaults to Port 3001. 

The application is connected to the MongoDB database using mongoose third-party middleware in the `app.js` file in the back end (server) folder. The code uses `mongoose.connect()` to establish a connection between the application and the MongoDB database.

The MongoDB connection URI is constructed using the username, password, cluster URL and the database name. These are stored as environmental variables in the .env file. The `.env` file is configured using `dotenv` middleware.

The application is connected to the MongoDB database using mongoose third party middleware in the backend. The code uses `mongoose.connect()` to connect to establish a connection with the MongoDB database. 

The MongoDB connection URI is constructed using the username, password, cluster URL and the database name. these are stored in the .env file which stores sensitive information.
The application does not include any third-party API. All API requests in the application are REST API requests made from the front end to the backend.

### Application security

To ensure security the application implements multiple layers of security to protect user data and ensure safe interactions. 
All API requests to the backend include a JSON Web Token (`JWT`) in the authorization header. JWTs, being stateless, eliminates the need for the server to store session data, providing secure user authentication. 
Further third-party middleware security used in the application includes `Helmet` and `CORS`. 
Helmet is an Express middleware setup in the backend that provides secure HTTP headers, protecting the application from common vulnerabilities such as cross-site scripting (`XSS`) and `clickjacking` without requiring additional configuration.

`Cross-Origin Resource Sharing (CORS)` is setup in the backend and added in all API fetch requests to regulate HTTP requests from external origins, reducing the risk of cross-origin attacks.
Other methods of security in the application include custom middleware for JWT verification and middleware that ensures that when a user registers a strong secure password is created by enforcing requirements for length and special characters, safeguarding user accounts

### Testing and Error handling

APIs in the application were tested using `Postman` which is an API testing tool which act as an interface between a couple of applications and establishes a connection between them.
Most requests in Postman require authentication to verify the eligibility of the user to access the resources in the server.
Debugging is also used for testing to indicate and to identify any errors in the code by logging error and success messages in  the console.
The app uses try catch statements in the front and back-end for error handling. 

The application also uses HTTP status response status codes in the backend for error handling. HTTP response status codes indicate whether a HTTP request was successfully completed.

**HTTP response status codes used in the application for error handling include:**

_Client Errors:_ 

-	400 (`Bad request`), 
-	401 (`Unauthorised`), 
-	403 (`Forbidden`), 
-	404 (`Not Found`), and 
-	409 (`Conflict`)

_Server Errors:_ 
-	500 (`Internal Server Error`)
  
#### Unit and snapshot testing

Unit and snapshot tests, were also done in the backend and frontend code to test the code for errors using `Jest` in the frontend and `Supertest` in the backend.

**_UNIT TESTING_**

Unit testing involves individual testing. Instead of testing the functionality of the code as a whole, unit testing involves testing individual components and functions.

**_SNAPSHOT TESTING_**

Snapshot tests are used to make sure that the UI(`user interface`) does not change unexpectedly.
## DEPLOYMENT

There are several platforms that can be used to deploy a web application, for example, `Heroku`, `Vercel`, `Render` and `Netlify`, inter alia.
However, although Heroku is a ‘`platform as a service (PaaS)`’ that simplifies management and supports multiple programming languages and frameworks, deploying an application on `Heroku` requires additional costs, `Vercel` is a platform used to host static sites and serverless functions and is largely optimised for `Next.js` applications and offers features like automatic `SSL (Secure Sockets Layer)` , edge caching and serverless deployment.

### How was the application deployed

The application was deployed using Render because it focuses on general full-stack hosting for web-services, APIs, and static sites. Therefore, the 
backend(`server side`) and frontend(`client side`) were both deployed using Render. The backend and frontend were deployed separately because the back end was deployed as a `web service` and the front end was deployed as a `static site`.  

### Link

**_Front End_**

https://client-9cop.onrender.com

**_Back End_**

https://server-siwu.onrender.com 


## REFERENCES
- https://www.nobledesktop.com/classes-near-me/blog/
- https://www.geeksforgeeks.org/nextjs-vs-reactjs-which-one-to-choose/#is-next-better-than-react
- https://www.geeksforgeeks.org/folder-structure-for-a-node-js-project/
- https://www.geeksforgeeks.org/what-is-package-json-in-node-js/?ref=ml_lbp
- https://www.geeksforgeeks.org/what-are-functional-requirements-in-system-design-examples-definition/
- https://www.geeksforgeeks.org/what-are-non-functional-requirements-in-system-design-examples-definition/?ref=next_article
- https://www.geeksforgeeks.org/software-engineering-classification-of-software-requirements/
- https://vercel.com/docs/cli/domains#usage
- https://docs.netlify.com/
- https://devcenter.heroku.com/categories/reference 
- https://www.geeksforgeeks.org/explain-the-purpose-of-the-helmet-middleware-in-express-js/
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Status



