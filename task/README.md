# SOFTWARE REQUIREMENTS

## TABLE OF CONTENTS 
1. [SYSTEM ARCHITECTURE](#system-architecture)
2. [SYSTEM REQUIREMENTS SPECIFICATION](#system-architecture)

## SYSTEM ARCHITECTURE

### WEB STACK
The to be webstack used for developing the proposed application is Create React App (CRA)/React.js, together with Express, Node and MongoDB, otherwise known as MERN stack. 
The reasoning for this is that Create React App (CRA) can be generated using only one command and therefore saves time. Further, React.js allows a developer to write user interfaces and use it an unlimited number of times and only requires a basic knowledge of HTML and CSS.

### STYLING
External Cascading Styling Sheets (CSS) will be used because although this may take longer than other styling methods such as inline CSS styling in the React.js component(s) can make the code complicated and more difficult to read. Therefore, the code is easier to read.

### DEPLOYMENT
The application will deployed on netlify because it is a free site with good services.

### CONCLUSION
In conclusion the application/website will be developed used is using MERN stack. `MongoDB` to manage the database, `Express.js` for the server-side, `React.js` for the (front-end) user interface, and `Node.js` for the primary runtime environment. The application/website will be styled using external CSS documents and will be deployed using Netlify.

## SYSTEM REQUIREMENTS SPECIFICATION

The proposed application/website is an Disaster Management System to create an efficient user friendly user-interface .The proposed application is a disaster management website. The purpose of the application/website is to an efficient and user interface and user experience system for handling, monitoring and coordinating disaster-related activities.

Users will benefit from the application because it provides users with a platform to efficiently handle and manage disasters. 

The application should be able to be run in the command line interface using npm start.

### SIMILAR SOFTWARE
Examples of software which does something similar are`Nomola` and `SCP security` These are both applications that provide similar resources, however, they are mainly used for security and emergency medical services and do not in general cater for any natural disasters. The proposed application is intended to provide assistance in any disater as defined in section 1 of the Disaster Management Act 57 of 2002:

”'disaster' means a progressive or sudden, widespread or localised, natural or human-caused occurrence which –
(a)	causes or threatens to cause – 
    (i)	death, injury or disease;
    (ii)	damage to property, infrastructure or the environment; or
    (iii)	significant disruption of the life of a community; and
(b)	is of a magnitude that exceeds the ability of those affected by the disaster to cope with its effects using only their own resources;”

### USER STORIES

- As a responder or volunteer who uses the application, I want the application to be able to display all current disasters, so that I can quickly view the current situation and respond effectively to emergencies.
- 

### FUNCTIONAL REQUIREMENTS

Functional requirements specify what the web application must do. these requirements are essentially what the user(s) expect the application to do.
In the proposed application the functional requirements include:
-	Secure user authentication upon user login, for normal end user login and administration access
-	Classify users to allow users to fetch data from the database based on the user type
-	Classify users to allow users to allow specific users to delete or edit objects on the database.
-	Provide admin users with the ability to delete certain users from the database for administrative purposes.


### NON-FUNCTIONAL REQUIREMENTS 

Non-Functional requirements define how the web application should perform. These requirements are essential for ensuring that the required standards are met for usability, reliability, performance and security.
Usability: 
-	The user interface is simple and easy and provides a positive user experience
Reliability 
-	The application is able to recover data from the database after a user logs in.
-	The application stores data added to the database after a user logs out.
-	New user data is added to the database after user registration
-	Information about a new disaster event is stored after a disaster item is added to the database
Performance:
-	Users are able to make multiple requests. 
-	The application allows requests to third party API’s.
Security:
-	User authentication: Users authenticated and verified when accessing the system.
-	User authorization: specific users have certain rights and permissions.


