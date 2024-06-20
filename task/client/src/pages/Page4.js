import React, { useState } from 'react'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
//Components
import Header from '../components/Header'
import LogoutBtn from '../components/LogoutBtn';
import EditUser from '../components/EditUser';

//Page 4 function component
export default function Page4({logout, users, setUsers, setLoggedIn, setError }) {
  //======STATE VARIABLES====
 const [editUserData, setEditUserData] = useState({
  editUsername: ' ',
  editUserEmail: ''
 })
 const [newUsername, setNewUsername] = useState('')
 const [newEmail, setNewEmail] = useState('')
 const [updateUser, setUpdateUser] =  useState(false)
 const [userToUpdate, setUserToUpdate] = useState(null)

  //======REQUESTS===============
  //--------PUT---------------
  //Function to edit a user 
  const editUser = async (userId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token available')
      }
      const response = await fetch (`http://localhost:3001/users/${userId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          newUsername,
          newEmail,
        })
      })
      if (!response.ok) {
        throw new Error('Failed to update user account');
      }
      const updatedAccount = await response.json();

      setUsers((prevUsers) =>
        prevUsers.map((user) => user.id === userId ? updatedAccount : user)
      );

      setNewUsername('')
      setNewEmail(' ')
      setLoggedIn('true')

      console.log('User Account successfully updated');
      console.log(users);
    } 
    catch (error) {
      console.error(`Error updating UserAccount: ${error.message}`);
      setError(`Error updating UserAccount: ${error.message}`)
    }
  }
  //--------DELETE----------------
  // Function to delete user
  /*const deleteUser = async (userId) => {
    try {
      //Send delete request to server
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'DELETE',//Request method
        mode: 'cors',
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
  // Function to handle input changes in the form
  const handleInputChange = (event) => {
    const {name, value} = event.target
    setEditUserData((prevData) => ({
      ...prevData,
      [name] : value,
    }))
  }

  const updateAccount = (userId) => {
    setUpdateUser(!updateUser)
    setUserToUpdate(userId)
  }
  //=======JSX RENDERING==============
  return (
    
    <>
    <Header heading='USER ACCOUNT'/>
    <secton className="section1">
      <div>
          { users.map((user) => (
      <div key={user._id}>
              <Row>
                <Col xs={6} md={4}>
                <label>USERNAME:</label>
                  <p>{user.username}</p>  {/*userData.username  */}
                </Col>
                <Col xs={6} md={4}>
                <label>EMAIL:</label>
                  <p>{user.email}</p>{/*userData.email */}
                </Col>
                <Col xs={6} md={4}>
                <label>DATE OF BIRTH</label>
                  <p>{user.dateOfBirth}</p>  {/* userData.DateOfBirth */}
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={8}>
                <label>ADMIN:</label>
                  <p>{}</p>  {/* Boolean to state if user is admin or not userData.admin*/}
                </Col>
                <Col xs={6} md={4}>
                  {/* Button to toggle edit user account */}
                  <Button variant="primary" type='button' id='toggleUserEdit' onClick={() => updateAccount(user._id)}>
                    {updateUser}
                  </Button>
                </Col>
              </Row>
              {updateUser && userToUpdate === user._id && (
                <div>
                  <EditUser
                    editUserData={editUserData}
                    handleInputChange={handleInputChange}
                    editUser={editUser}
                  />

                </div>
              )}
      </div>
      ))}
      </div>
    </secton>
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
