// Import necessary modules and packages
import React, { useState } from 'react';// Import the React module to use React functionalities
import '../CSS/Page4.css'//Import CSS stylesheet
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap
//Components
import Header from '../components/Header';//Import Header function component
import EditUser from '../components/EditUser';//Import EditUser function component
import Footer from '../components/Footer';//Import Footer function component
import UserViewBtn from '../components/UserViewBtn';//Import UserViewBtn function component

//Page 4 function component
export default function Page4(//Export default Page4 function component
  {//PROPS PASSED FROM PARENT COMPONENT
    logout, 
    currentUser, 
    setUsers, 
    setLoggedIn, 
    setError, 
    users
   }
  ) {
  //===========STATE VARIABLES===============
// State to store and manage the input data for editing a user
const [editUserData, setEditUserData] = useState({
  editUsername: '', // Initial value for the username input field
  editUserEmail: '' // Initial value for the email input field
});
const [updateUser, setUpdateUser] = useState(null); // State to track which user's details are being updated
const [viewUsers, setViewUsers] = useState(false); // Boolean to toggle the visibility of the users list
  //---------------------------------------

  // Function to specify the date format
const dateDisplay = (dateString) => {
  // Define the options for formatting the date
  const options = {
    day: '2-digit',   // Display the day with two digits (e.g., 05)
    month: '2-digit', // Display the month with two digits (e.g., 09)
    year: 'numeric'   // Display the full year (e.g., 2024)
  };
  /* Convert the date string into a Date object and format it according 
  to the 'en-GB' locale (UK format: DD/MM/YYYY)*/
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

  //======REQUESTS===============
  //--------PUT---------------
  // Function to edit a user
const editUser = async (userId) => {//Define an async function to edit user data
  try {
    
    const token = localStorage.getItem('token');// Retrieve the authentication token from local storage
    //Conditional rendering to check if the token is present
    if (!token) {
      throw new Error('No token available');// If there is no token, throw an error

    }

    // Send a PUT request to the server to update the user account
    const response = await fetch(`http://localhost:3001/users/editAccount/${userId}`, {
      method: 'PUT', // HTTP request method 
      mode: 'cors',  // Enable CORS for Cross-Origin Resource Sharing mode
      headers: {
        'Content-Type': 'application/json', // Specify the Content-Type being sent in the request payload
        'Authorization': `Bearer ${token}`, // Pass the JWT token in Authorization header
      },
      body: JSON.stringify({// Convert data to JSON string and include it in the request body
        username: editUserData.editUsername, // Include the updated username in the request body
        email: editUserData.editUserEmail,   // Include the updated email in the request body
      })
    });

    // Conditional rendering to check if the response is not OK (status code outside the range 200-299)
    if (!response.ok) {
      throw new Error('Failed to update user account');//Throw an error message if the PUT request is unsuccessful
    }
   
    const updatedAccount = await response.json();// Parse the JSON response to get the updated user account data
    setUsers((prevUsers) =>// Update the state with the new user data, replacing the old user data
    prevUsers.map((user) => 
    /* If the current user's ID matches the ID of the user being updated,
    replace that user with the updated account information. Otherwise, 
    return the user unchanged.*/
    user._id === userId ? updatedAccount : user
  )
);


    // Reset the edit form fields and clear the updateUser state
    setEditUserData({ editUsername: '', editUserEmail: '' });
    setUpdateUser(null);

    
    setLoggedIn(true);// Ensure the user is still logged in after the update
    console.log('User account successfully updated'); // Log a success message in the console for debugging purposes
  } 
  catch (error) {
    // Handle any errors that occur during the update process
    console.error(`Error updating user account: ${error.message}`);//Log an error message in the console for debugging purpose
    setError(`Error updating user account: ${error.message}`);//Set the error state with an error message
  }
};

  

  //-----------DELETE----------------------
  //Function to remove a user
  const deleteUser = async (userId) => {
    try {
// Send a DELETE request to the server to remove the user with the specified ID
      const response = await fetch(`http://localhost:3001/users/deleteUser/${userId}`, {
        method: 'DELETE',//HTTP request method
        mode: 'cors',// Enable CORS for Cross-Origin Resource Sharing mode
        headers: {
          'Content-type': 'application/json',// Specify the Content-Type being sent in the request payload 
        },
      });
    // Conditional rendering to check if the response indicates success (status code 200-299)
      if (!response.ok) {
        throw new Error('Failed to remove user');//Throw a error message if the DELETE request is unsuccessful
      }
       // Update the state by filtering out the deleted user
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user._id !== userId) // Return a new array excluding the user with the given ID
    );
      console.log('User Successfully removed');//Log a message in the console for debugging purposes
    }
    catch (error) {
      setError('Error removing user', error);//Set the error state with an error message
      console.error('Error removing user:', error.message);//Log an error message in the console for debugging purposes
    }
  };

  //==========EVENT LISTENERS=============
  //Function to handle input change in the update form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle input changes in the update form
const handleInputChange = (event) => {
  // Extract the name and value from the event's target (the input field)
  const { name, value } = event.target;
    // Update the state for editUserData to reflect the changes in the form fields
  setEditUserData((prevData) => ({
    ...prevData,       // Spread the previous data to retain other unchanged fields
    [name]: value,    // Update the specific field (e.g., editUsername or editUserEmail) with the new value
  }));
};
  //Function to toggle the update form
const updateAccount = (userId) => {
  // If the current userId matches the updateUser state, set it to null (hide the form)
  // Otherwise, set it to the current userId (show the form for this user)
  setUpdateUser(userId === updateUser ? null : userId);
};

  /* Function to toggle the display of the users list if 
   the current user is an admin user */
const toggleViewUsers = () => {
  // Conditional rendering to check if the current user has admin privileges
  if (currentUser.admin) {
    setViewUsers(!viewUsers);// Toggle the visibility of the users list
  } else {
    console.log('Unauthorized');//Log an error message in the console for debugging purposes    
    alert('Unauthorized');//Display an alert if the user is not an admin
  }
};
  //=======JSX RENDERING==================

  return (
    <>
    {/* Header */}
      <Header heading='USER ACCOUNT' />
    {/*Section1*/}
      <section className="page4Section1">
        {/* Current User output */}
        {currentUser && (
          <div id='currentUserOutput'>
            <Row className='userOutputRow'>
              <Col xs={6} md={4} className='userOutputCol'>
              {/* Current user username */}
                <label className='userDataLabel'>USERNAME:</label>
                <p className='outputText'>{currentUser.username}</p>
              </Col>
              <Col xs={6} md={4} className='userOutputCol'>
              {/* Current user email */}
                <label className='userDataLabel'>EMAIL:</label>
                <p className='outputText'>{currentUser.email}</p>
              </Col>
              <Col xs={6} md={4} className='userOutputCol'>
              {/* current user Date of Birth */}
                <label className='userDataLabel'>DATE OF BIRTH:</label>
                <p className='outputText'>{dateDisplay(currentUser.dateOfBirth)}</p>
              </Col>
            </Row>
            <Row className='userOutputRow'>
              <Col xs={6} md={4} className='userOutputCol'>
              {/* Output to state if the current user is an admin user */}
                <label className='userDataLabel'>ADMIN:</label>
                <p className='outputText'>{currentUser.admin ? 'Yes' : 'No'}</p>
              </Col>
              <Col xs={6} md={4}></Col>
              <Col xs={6} md={4} className='userOutputCol'>
              {/* Button to toggle the update User details  */}
                <Button
                  variant="primary"
                  type='button'
                  id='toggleUserEdit'
                  onClick={() => updateAccount(currentUser._id)}>
                  {updateUser === currentUser._id ? 'Exit' : 'Edit'}
                </Button>
              </Col>
            </Row>
            {updateUser === currentUser._id && (
              <div>
                {/* EditUser form */}
                <EditUser
                  editUserData={editUserData}
                  handleInputChange={handleInputChange}
                  editUser={() => editUser(currentUser._id)}
                />
              </div>
            )}
          </div>
        )}
      </section>
        {/*section2*/}
      <section className='section2'>
        <div>
          {/* Display all USERS if user is an admin user */}
          {!viewUsers ? (
            <Row>
              {/* Button to display all users */}
              <UserViewBtn toggleViewUsers={toggleViewUsers}/>
            </Row>
          ):(
          <div id='usersList'>
            <Row>
              <Col>
              <h2 className='h2'>USERS</h2>
              </Col>
            </Row>
            {/* User Output */}
              {users.map((user) => (
                <div key={user._id} className='user'>
                  <Row>
                    <Col xs={6}>
                    {/* Username output */}
                      <label>USERNAME:</label>
                      <p className='outputText'>{user.username}</p>
                    </Col>
                    <Col xs={6}>
                    {/* Email output */}
                      <label>EMAIL:</label>
                      <p className='outputText'>{user.email}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>
                    {/* Date of Birth output */}
                      <label>DATE OF BIRTH:</label>
                      <p className='outputText'>{dateDisplay(user.dateOfBirth)}</p>
                    </Col>
                    <Col xs={6}>
                    {/* Button to delete user */}
                      <Button
                        variant='danger'
                        type='button'
                        onClick={() => deleteUser(user._id)}>
                        REMOVE USER
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
              <Row>
                <Col>
                {/* Toggle Button to hide user list */}
                <Button variant='secondary'
                onClick={toggleViewUsers}
                >
                  HIDE USERS
                </Button>
                </Col>
              </Row>
            </div>
          )}
        </div>
      </section>
      {/* Page Footer */}
     <Footer logout={logout}/>
    </>
  );
}
