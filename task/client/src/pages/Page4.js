// Import necessary modules and packages
import React, { useState } from 'react'// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap
//Components
import Header from '../components/Header';// Import the Header component from '../components/Header'
import LogoutBtn from '../components/LogoutBtn';// Import the LogoutBtn component from '../components/LogoutBtn'
import EditUser from '../components/EditUser';//Import the EditUser component from '../components/EditUser'

//Page 4 function component
export default function Page4({logout, users, setUsers, setLoggedIn, setError }) {
  //======STATE VARIABLES====
 const [editUserData, setEditUserData] = useState({//State used to store the form Data being edited
  editUsername: ' ', //Initial value for the username field
  editUserEmail: ''//Initial value for the email field
 })
 // State variable used to track which user is currently being updated
const [updateUser, setUpdateUser] = useState(null); // Initial value is null, meaning no user is currently being edited


  //======REQUESTS===============
  //--------PUT---------------
  //Function to edit a user 
  const editUser = async (userId) => {//Define an async function to edit user account
    try {
      const token = localStorage.getItem('token')// Retrieve the token from localStorage
      if (!token) {
        throw new Error('No token available')//Throw an error message if the token is not available
      }
      //Send a request to the server
      const response = await fetch (`http://localhost:3001/users/${userId}`, {
        method: 'PUT',//HTTP request method
        mode: 'cors',//Set the mode to cors, allowing cross-origin requests 
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload
          'Authorization': token,// Specify the Content-Type being sent in the request payload
        },
        body: JSON.stringify({// Convert data to JSON string and include it in the request body
          username: editUserData.editUsername,// New username from the state
          email: editUserData.editUserEmail,// New email from the state
        })
      })
      //Response handling
     // Conditional rendering to check if the response indicates success (status code 200-299)    
      if (!response.ok) {
        throw new Error('Failed to update user account');//Throw an error message if the PUT request is unsuccessful
      }
          // Parse the JSON response to get the updated user account
      const updatedAccount = await response.json();

          // Update the users state with the updated user data
       setUsers((prevUsers) =>
        prevUsers.map((user) => user._id === userId ? updatedAccount : user)
      );
  
      // Reset the form data and close the edit form
      setEditUserData({ editUsername: '', editUserEmail: '' });
      setUpdateUser(null);//Close the edit form by setting the updateUser state to null
      setLoggedIn('true');//Set the loggedIn state to true

      console.log('User Account successfully updated');//Log a success message in the console for debugging purpose
      console.log(users);//Log the updated users in console for debugging purpose
    } 
    catch (error) {
      console.error(`Error updating UserAccount: ${error.message}`);//Log an error message in the console for debugging purposes
      setError(`Error updating UserAccount: ${error.message}`);//Set the error state with an error message
    }
  }
  //--------DELETE----------------
  // Function to delete user
  /*const deleteUser = async (userId) => {
    try {
      //Send delete request to server
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'DELETE',//Request method
        mode: 'cors',//Set the mode to cors, allowing cross-origin requests 
        headers: {
          'Content-type': 'application/json',
        },
      });

      //Conditional rendering to check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to remove user');//Throw an error message if the request is unsuccessful
      }


      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userId)
      );
      console.log('User Successfully removed');
    }
    catch (error) {
      setError('Error removing user', error);
      console.error('Error removing user:', error.message);
    }
  };*/
  //======EVENT LISTENERS============
  // Function to handle input changes in the edit form
  const handleInputChange = (event) => {
  // Destructure name and value from the event target (the input field)
  const { name, value } = event.target;

  // Update the editUserData state with the new value for the corresponding field
  setEditUserData((prevData) => ({
    // Spread the previous state to retain existing values
    ...prevData,
    // Dynamically set the value for the input field that changed
    [name]: value,
  }));
};

   // Function to toggle the display of the update form
  const updateAccount = (userId) => {
      // Check if the provided userId is the same as the current updateUser state
    setUpdateUser(userId === updateUser ? null : userId);
  };

  //=======JSX RENDERING==============
  return (
    
    <>
      <Header heading='USER ACCOUNT' />
      <section className="section1">
        <div>
          {users.map((user) => (
            <div key={user._id}>
              <Row>
                <Col xs={6} md={4}>
                  <label>USERNAME:</label>
                  <p>{user.username}</p>
                </Col>
                <Col xs={6} md={4}>
                  <label>EMAIL:</label>
                  <p>{user.email}</p>
                </Col>
                <Col xs={6} md={4}>
                  <label>DATE OF BIRTH</label>
                  <p>{user.dateOfBirth}</p>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={8}>
                  <label>ADMIN:</label>
                  <p>{user.admin ? 'Yes' : 'No'}</p>
                </Col>
                <Col xs={6} md={4}>
                  <Button
                    variant="primary"
                    type='button'
                    id='toggleUserEdit'
                    onClick={() => updateAccount(user._id)}>
                    {updateUser === user._id ? 'Cancel' : 'Edit'}
                  </Button>
                </Col>
              </Row>
              {updateUser === user._id && (
                <div>
                  <EditUser
                    editUserData={editUserData}
                    handleInputChange={handleInputChange}
                    editUser={() => editUser(user._id)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      {/* Footer */}
      <footer>
        <Row>
          <Col xs={12} md={8}>
          </Col>
          <LogoutBtn
            logout={logout}
          />
        </Row>
      </footer>
    </>
  )
}
