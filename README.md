# SOFTWARE REQUIREMENTS
The proposed web application (`software product`) is a quiz game application that allows users to  answer questions from certain question categories from questions provided by admin users and data from third party APIs (Application Programming Interface).  

## TABLE OF CONTENTS
1. [SYSTEM ARCHITECTURE](#system-architecture)
2. [SYSTEM REQUIEREMENTS SPECIFICATION](#system-requirements-specification)
3. [REFERENCES](#references)
   
## SYSTEM ARCHITECTURE
### WEB STACK

A `web stack` refers to the combination of tools and technologies used to create a website or web application. The web stack that will be used for creating the application is the `MERN stack` which is web stack is a popular open source, `JavaScript-based` stack which is developer-friendly, highly customisable, and cost-effective, its popularity is due to `Reacts` ability to simplify the creation and management of an application’s `user interface (UI)` and `improve overall site performance`. 
React.js allows you to write code use it an unlimited number of times therefore allowing you to write more modular code therefore making it easier to read and less complicated making it highly efficient for building dynamic and interactive web pages. Further, `(CRA)` can be generated in the `command line interface` using only one command which therefore saves time.
Therefore, `MongoDB` will handle the database, `Express.js` will provide the web application framework to develop the server-side, `React.js` (create-react-app) will be used to create the front-end, user-interface and `Node.js` will be used as the JavaScript runtime environment. 

### STYLING 
External Cascading Styling Sheets (CSS) will be used because although this may take longer than other styling methods such as inline CSS styling in the React.js component(s) can make the React.js code longer, more complicated, and therefore difficult to read. 

### FILE STRUCTURE
The `root-directory` is the main folder that contains all the files and folders for the application. The file structure of the root-directory consists of the two different folders, the front-end `client` folder and the back-end `server` folder and this `README markdown file` containing information about the application. The back-end and front-end folders are in separate folders to ensure that there clear separation between the back-end and front-end code.
The front-end will contain the code relating to React.js files, and the CSS styling code. The back end will contain the Express.js code and the code that using `Mongoose` third party middleware to connect to the `MongoDB` database. 

### DEPLOYMENT

There are several platforms which can be used for deploying an application, such as, `Heroku, Vercel and Netlify`, inter alia. However, although Heroku is a `platform as a service (PaaS)` that simplifies deployment and management and supports multiple programming languages and frameworks, deploying an application on Heroku requires additional costs, `Vercel` is a platform used to host static sites and serverless functions and is optimised for `Next.js` applications and offers features like automatic `SSL (Secure Sockets Layer)`, edge caching, and serverless deployment.

The application will, however, be deployed using `Netlify` since it is a cost-free and therefore cost-effective platform and provides serverless functions allowing developers to run backend code without having to manage the server which can be used to create API’s and handle form submissions, which is fundamental to the application. Further, it also provides, security features such as `user authentication` and global `CDN (Content Delivery Network)` for fast scalable deployment, therefore ensuring high performance deployment.

## SYSTEM REQUIREMENTS SPECIFICATION
### HOW THE APPLICATION WILL WORK
### SIMILAR SOFTWARE

Examples of similar applications/software are `Kahoot`, and `Trivia Crack` . However, there are several differences significant differences between these applications and the intended web-application/software.

#### KAHOOT
The intended web-application/software is different in that Kahoot is used for educational and recreational purposes and the proposed application is only used for recreational purposes. Further, Kahoot provides real-time online live-hosted quizzes, the intended application does not provide live-hosted quizzes in order to allow the application to load faster.

#### TRIVIA CRACK
Trivia Crack is also an application used for recreational purposes, however, although the intended application/software also allows users to add questions, Trivia Crack allows users to add video questions, and the intended application/software does not provide users with the option to add questions in media format to  allow the application to load faster.

### USER STORIES

-	As a user of the application, I want the application to be able to provide a friendly user interface (UI) to ensure a positive user experience (UX)
-	As a user of the application, I want the application to provide secure user login to protect details on my account.
-	As a user of the application, I want the application to provide a user interface that is user friendly to allow a positive user experience.
-	As a user of the application, I want the application to be able to store my user account details after registration.
-	As a user of the application, I want to be able to view the results after answering questions.
-	As a user of the application, I want the application to be able to edit my account details.
-	As a user of the application, I want the application to allow me to add new questions and save them to the database.

#### ALL USERS
#### ADMIN USERS
### SYSTEM REQUIREMENTS 
#### FUNCTIONAL REQUIREMENTS 
Functional requirements are the activities required of the program. These requirements are related to the functionality of the application and `specifies what the application must do` and are dependent on the type of software being developed. These are essentially the requirements that the end user expects the web application (software product) to offer and have an impact on how the user interacts with the system and are therefore user focused. 

***The functional requirements of the application include:***

#### NON-FUNCTIONAL REQUIREMENTS
Non-functional requirements are the characteristics of the web application/software product, including its constraints. They are often more critical than individual functional requirements. Non-functional requirements are not related to the functionality of the application but rather defines `how the web application/software should perform`. Non-functional requirements are related to factors regarding the application's `usability`, `reliability`, `performance`, and `security` and are therefore essential for ensuring that the web application meets the required standards of these factors.

***The non-functional requirements of the application include:***

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
