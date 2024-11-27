# FINAL CAPSTONE
The proposed web application (‘software product’) is a quiz application. The intended users who will benefit are individuals who will benefit from the application are individuals that enjoy quiz games for recreational purposes
The application is written (created) using MERN stack which is a popular open source `JavaScript-based` developer friendly web stack. MERN stack uses MongoDB to handle the database, React.js to create the front-end, Express.js to create the back end and uses Node.js as the runtime environment.

## TABLE OF CONTENTS
1. [HOW TO USE THE APPLICATION](#how-to-use-the-application)
2. [SYSTEM REQUIEREMENTS SPECIFICATION](#how-to-run-the-application)
3. [DEPLOYMENT](#deployment)
4. [REFERENCES](#references)

## HOW TO USE THE APPLICATION
To use the application users are required to register(sign up) and login. Users are also able to register as admin users subject to certain age restrictions controlled by custom middleware. 
## HOW TO RUN THE APPLICATION

A proxy server is included in the front-end to allow the front and back-end to run together. The application uses ‘nodemon’ third-party middleware in the back-end to allow the application to run the back-end and front-end in the command line interface(CLI) or terminal using `npm start`. The folders must, however, be run separately.
The server is started (listens) on the port specified in the .env file using app.listen() in the app.js file or defaults to port 3001.

The application is connected to the MongoDB database using mongoose third-party middleware in the `app.js` file in the back end (server) folder. The code uses `mongoose.connect()` to establish a connection between the application and the MongoDB database.

### How to modify MongoDB URI's and API keys

The application is connected to the MongoDB database using mongoose third party middleware in the backend. The code uses `mongoose.connect()` to connect to establish a connection with the MongoDB database. 
The MongoDB connection URI is constructed using the username, password, cluster URL and the database name. these are stored in the .env file which stores sensitive information.
The application does not include any third-party API. All API requests in the application are REST API requests made from the front end to the backend

### Security measures
To ensure security the application uses several third-party middleware libraries, custom-middleware in the back end and general user authentication and authorisation in the front and backend code.

**Third party middleware used for Security:**

**_JWT(‘Jsonwebtoken’):_** A JSON web token is an open standard that securely relays information between client and servers as a compact, self-contained JSON object. A JWT is attached to each request in the backend and is attached in the authorisation header. The benefit of JWT is that it is stateless since it does server does not have to remember the user’s information in session storage which significantly reduces the amount of work required to manage the state. 

_**Helmet:**_ Helmet is an Express.js third-party middleware package that enables Express to enhance security through Cross-Site-Scripting protection(XSS) and helps secure the application by setting up various HTTP response headers in the Express backend. 

_**CORS (Cross-Origin-Resource Sharing):**_ CORS is a http-header based mechanism that indicates the origins (domain, schema or port) that the which the browser should permit loading resources. Cross-Origin-Resource Sharing are added in the front-end fetch functions and is installed and setup added in backend.

**_.dotenv:_** the application also contains a .env file using dotenv middleware to store sensitive information or environmental variables such as the database URL, port and database name which are accessed in the app.js file in the backend.


### Testing

APIs in the application were tested using Postman which is an API testing tool which acts as an interface between application and establishes a connection between them. Most requests in Postman require authorisation to verify the eligibility of the user to access the resource in the server. The authorisation process is applied for identification to allow access.

Error handling in express.js refers to how express catches and process errors that occur both asynchronously and synchronously.  Express provides built in error handling methods.
The application uses try catch statements and HTTP status codes in the backend for error handling. 

## DEPLOYMENT
### PLATFORMS
There are several platforms that can be used to deploy  a web application, for example, `Heroku`, `Vercel`, `Render` and `Netlify`, inter alia.
However, although Heroku is a ‘platform as a service (PaaS)’ that simplifies management and supports multiple programming languages and frameworks, deploying an application on Heroku requires additional costs, `Vercel` is a platform used to host static sites and serverless functions and is largely optimised for `Next.js` applications and offers features like automatic `SSL (Secure Sockets Layer)` , edge caching and serverless deployment.

### HOW WAS THE APPLICATION DEPLOYED
### LINK
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
- https://aws.amazon.com/what-is/cdn/
- https://developer.mozilla.org/en-US/docs/Web/URI#syntax_of_uniform_resource_identifiers_uris
- https://vercel.com/docs/cli/domains#usage
- https://devcenter.heroku.com/categories/reference
- https://www.geeksforgeeks.org/what-is-package-json-in-node-js/?ref=ml_lbp
- https://www.geeksforgeeks.org/folder-structure-for-a-node-js-project/
- https://www.geeksforgeeks.org/nextjs-vs-reactjs-which-one-to-choose/#is-next-better-than-react
- https://expressjs.com/en/5x/api.html#app.listen_path_callback
  

