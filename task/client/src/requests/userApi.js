const USERS_URL = 'http://localhost:3001/users';

// Function to fetch users
export const fetchUsers = async (token) => {
  const response = await fetch(`${USERS_URL}/findUsers`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};

// Function to fetch current user
export const fetchCurrentUser = async (token) => {
  const response = await fetch(`${USERS_URL}/userId`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch current user');
  }

  return response.json();
};

// Function to submit Login
export const submitLogin = async (userData) => {
  const response = await fetch(`${USERS_URL}/login`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: userData.username,
      password: userData.password,
    })
  });

  if (!response.ok) {
    throw new Error('Username or password are incorrect');
  }

  return response.json();
};

// Function to register a new user
export const addUser = async (newUserData) => {
  const response = await fetch(`${USERS_URL}/register`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: newUserData.newUsername,
      email: newUserData.newEmail,
      dateOfBirth: newUserData.newDateOfBirth,
      admin: newUserData.newAdmin,
      password: newUserData.newPassword,
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error adding user');
  }

  return response.json();
};

// Function to edit a user 
export const editUser = async (userId, editUserData, token, setUsers, setLoggedIn, setError) => {
  try {
    if (!token) throw new Error('No token available');

    const response = await fetch(`${USERS_URL}/editAccount/${userId}`, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: editUserData.editUsername,
        email: editUserData.editUserEmail,
      }),
    });

    if (!response.ok) throw new Error('Failed to update user account');

    const updatedAccount = await response.json();

    setUsers((prevUsers) => prevUsers.map((user) => (user._id === userId ? updatedAccount : user)));
    setLoggedIn(true);

    console.log('User account successfully updated');
  } catch (error) {
    console.error(`Error updating user account: ${error.message}`);
    setError(`Error updating user account: ${error.message}`);
  }
};

// Function to delete a user
export const deleteUser = async (userId, setUsers, setError) => {
  try {
    const response = await fetch(`${USERS_URL}/deleteUser/${userId}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to remove user');

    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));

    console.log('User successfully removed');
  } catch (error) {
    console.error(`Error removing user: ${error.message}`);
    setError(`Error removing user: ${error.message}`);
  }
};
