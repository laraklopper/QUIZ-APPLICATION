# SOFTWARE REQUIREMENTS

## TABLE OF CONTENTS
1. [SYSTEM ARCHITECTURE](#system-architecture)
2. [SYSTEM REQUREMENTS SPECIFICATION](#system-requirements-specification)
3. [REFERENCES](#references)

## SYSTEM ARCHITECTURE

### WEB STACK

The to be web stack used for developing the proposed application is `Create React App (CRA)` or `React.js`, together with Express, Node and MongoDB, otherwise known as MERN stack. `MongoDB` to manage the database, `Express.js` for the server-side, `React.js` for the (front-end) user interface, and `Node.js` for the primary runtime environment. The application/software will use `Mongoose` middleware to connect to the `MongoDB` database. 

The reasoning for this is that `Create React App (CRA)` is that `React.js` allows you to write code and use it an unlimited number of times therefore allowing you to write more modular code therefore making it easier to read and less complicated, making it highly efficient for building dynamic and interactive web pages. Further, `Create React App (CRA)` can be generated in the `command line interface` using only one command which therefore saves time.

### STYLING 

External `Cascading Styling Sheets (CSS)` will be used because although this may take longer than other styling methods such as inline CSS styling in the React.js component(s) can make the React.js code longer, more complicated and therefore difficult to read. 

### DEPLOYMENT
There are several platforms which can be used for deploying an application, such as, `Heroku, Vercel and Netlify`, inter alia. However, although Heroku is a platform as a service (PaaS) that simplifies deployment and management and supports multiple programming languages and frameworks, deploying an application on Heroku requires additional costs, Vercel is a platform used to host static sites and serverless functions and is optimised for Next.js applications and offers features like automatic SSL, edge caching, and serverless deployment.

The application will therefore be deployed using `Netlify` which is a free and therefore cost-effective platform that offers features like continuous deployment, serverless functions and global CDN (Content Delivery Network) for fast scalable deployment.

## SYSTEM REQUIREMENTS SPECIFICATION

The proposed application is a sport betting application that allows to bet on sporting data such as matches/sport fixtures related to specific types of sport relating to certain kinds found on a third-party API (application programming interface). The target users who will benefit from the application are South African sports fans older than 18 who enjoy sports betting within the legal parameters of sport betting in South Africa.

The application will be created in `React.js`, `Express.js`, `Node.js`, and `MongoDB` and should be able to be run in the command line interface using `npm start`.

### SIMILAR SOFTWARE

Similar applications/software include `Betway` and `Sporting bet`. The proposed application or software is, however, similar in certain aspects for example, users must be above 18 years.  

#### BETWAY
The software/application will be different in that it will be limited to South Africans and the software/application will be different in the it will predominately focus on South African sport at a national/international level, major international sport events and other sport where the data can be accessed. Further, unlike Betway, the proposed application/software does not include any form of gambling. 

#### SPORTING BET
The proposed software/application will be different in that it will be limited to South Africans and the software/application will be different in the it will predominately focus on South African sport at a national/international level, major international sport events and other sport where the data can be accessed. 

### USER STORIES

-	As a user of the application, I want the application to be able to provide a friendly user interface (UI) to ensure a positive user experience (UX)
-	As a user of the application, I want the application to provide secure user login to protect details on my account.
-	As a user of the application, I want the application to be able to edit my account details.
-	As a user of the application who handles administrative functions, I want the software/application to allow me to remove user who do not adhere to the applications terms and the legal regulations regarding sport betting.
-	As a user of the application who handles administrative functions, I want to be able to view and monitor all bets made by the users to avoid any suspicious user activity. 
-	As a user of the application who handles administration functions, I want the application/software to prohibit individuals under 18 years  to register to ensure responsible sports betting.
-	As a user of the application who handles administration functions, I want to be able to store data in the database, and retrieve the from the database after logging in.
-   As a user of the application who handles administration functions, I want the application/software to prohibit individuals who are not South African citezeb resident in South Africa to register.
- 	As a user of the application who handles administration functions, I want the application/software to the application to ensure that users only the application/software for Sport betting and no other form of gambling. 

### FUNCTIONAL REQUIREMENTS
Functional requirements are the activities required of the program. These requirements are related to the functionality of the application and specifies what the application must do and are essentially the requirements that the end user expects the web application to offer. 

Functional requirements are also dependent on the type of software being developed.

**The functional requirements relaing to the application are:**

-	The application provides a login page with secure user for both normal end-user login and admin user login.
-	The registration form includes middleware to ensure that users are older than 18 years and reside in South Africa
-	A toggle button which allows users to toggle between the login and registration pages.
-	A navigation bar to allow users to navigate between the different pages.
-	Users can get/fetch user information/details and edit user account. 
-	A page which includes a form for users to add a bet based on information from third-party APIs to collect information about sporting events.
-	Application stores new user data on the database after registration.
-	Application stores new data after it is added to the database.
-	Users are authenticated when accessing the application.
-	Separate user interface for admin users with user authorization for specific rights and permissions.
-	The application is able, to recover data from the database after user login and can store data added to the database after a user logs out.


### NON-FUNCTIONAL REQUIREMENTS

Non-functional requirements are the characteristics of the web application (software product), including its constraints. They are often more critical than individual functional requirements. Non-functional requirements are not related to the functionality of the application but rather defines how the web application should perform. 

Non-functional requirements are related to factors regarding the applications usability, reliability, performance, and security and are therefore essential for ensuring that the web application meets the required standards of these factors.

**The non-functional requirements in the web application are:**

#### USABILITY

-	User friendly interface design.
-	Data integrity and persistence across sessions.
-	Compatibility with different devices and browsers for broader accessibility.

#### RELIABILITY

-	Thorough testing, including unit, integration, and end-to-end testing, to ensure system reliability.
-	System responsiveness to user actions and requests.

#### PERFORMANCE
-	The application can accommodate an increasing user load and data volume.
-	New user data is added to the database after user registration.
-	Performance optimisation for efficient data retrieval and processing.

#### SECURITY
-	Security measures to protect user data and system from unauthorized access or breaches.
-	All users are authenticated when accessing the application to ensure secure user login, the application includes regulatory requirements for user data handling and privacy.

## REFERENCES

- https://www.geeksforgeeks.org/what-are-functional-requirements-in-system-design-examples-definition/
- https://www.geeksforgeeks.org/what-are-non-functional-requirements-in-system-design-examples-definition/?ref=next_article
- https://www.geeksforgeeks.org/software-engineering-classification-of-software-requirements/
- https://www.sangoco.org.za/sports-betting-in-s%D0%B0/
- National Gambling Act 7 of 2004
- https://www.sabcsport.com/news/online-betting-in-south-africa-understanding-the-legal-framework
- https://www.geeksforgeeks.org/nextjs-vs-reactjs-which-one-to-choose/#is-next-better-than-react