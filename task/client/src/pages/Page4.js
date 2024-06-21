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
const [updateUser, setUpdateUser] = useState(null);


  //======REQUESTS===============
  //--------PUT---------------
  //Function to edit a user 
  const editUser = async (userId) => {//Define an async function to edit user account
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token available')
      }
      //Send a request to the server
      const response = await fetch (`http://localhost:3001/users/editAccount/${userId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: editUserData.editUsername,
          email: editUserData.editUserEmail,
        })
      })
      //Response handling
      if (!response.ok) {
        throw new Error('Failed to update user account');
      }

      const updatedAccount = await response.json();

          // Update the users state with the updated user data
       setUsers((prevUsers) =>
        prevUsers.map((user) => user._id === userId ? updatedAccount : user)
      );
  
      // Reset the form data and close the edit form
      setEditUserData({ editUsername: '', editUserEmail: '' });
      setUpdateUser(null);
      setLoggedIn('true');

      console.log('User Account successfully updated');
      console.log(users);
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
        method: 'DELETE',
        mode: 'cors', 
        headers: {
          'Content-type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove user');
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
        {currentUser && (
          <div>
            <Row>
              <Col xs={6} md={4}>
                <label>USERNAME:</label>
                <p className='outputText'>{currentUser.username}</p>
              </Col>
              <Col xs={6} md={4}>
                <label>EMAIL:</label>
                <p className='outputText'>{currentUser.email}</p>
              </Col>
              <Col xs={6} md={4}>
                <label>DATE OF BIRTH:</label>
                <p className='outputText'>{currentUser.dateOfBirth}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={6} md={4}>
                <label>ADMIN:</label>
                <p className='outputText'>{currentUser.admin ? 'Yes' : 'No'}</p>
              </Col>
              <Col xs={6} md={4}></Col>
              <Col xs={6} md={4}>
                <Button 
                  variant="primary" 
                  type='button' 
                  id='toggleUserEdit' 
                  onClick={() => updateAccount(currentUser._id)}>
                    {updateUser === currentUser._id ? 'Cancel' : 'Edit'}
                </Button>
              </Col>
            </Row>
            {updateUser === currentUser._id && (
              <div>
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
      <footer>
        <Row>
          <Col xs={12} md={8}></Col>
          <LogoutBtn logout={logout} />
        </Row>
      </footer>
    </>
  )
}
