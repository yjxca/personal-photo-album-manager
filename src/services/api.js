// src/services/api.js
const API_URL = 'http://localhost:3001';

// Auth endpoints
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/users?email=${encodeURIComponent(credentials.email)}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const users = await response.json();
    const user = users[0];
    
    if (user && user.password === credentials.password) {
      // In a real app, never compare passwords like this!
      // This is just for demonstration
      const { password, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, message: 'Invalid credentials' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'An error occurred during login' };
  }
};

export const registerUser = async (userData) => {
  try {
    // Check if user already exists
    const checkResponse = await fetch(`${API_URL}/users?email=${encodeURIComponent(userData.email)}`);
    
    if (!checkResponse.ok) {
      throw new Error('Network response was not ok');
    }
    
    const existingUsers = await checkResponse.json();
    
    if (existingUsers.length > 0) {
      return { success: false, message: 'User with this email already exists' };
    }
    
    // Create new user
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    
    const newUser = await response.json();
    
    // Remove password before returning
    const { password, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'An error occurred during registration' };
  }
};