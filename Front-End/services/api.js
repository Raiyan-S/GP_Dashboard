const API_URL = 'http://localhost:8000/api';
// import.meta.env.VITE_API_URL || 

// Fetch Unique Client IDs from the API
// This function is used to fetch unique client IDs from the API
export const fetchUniqueClientIds = async () => {
  const response = await fetch(`${API_URL}/client`);
  if (!response.ok) {
    throw new Error('Failed to fetch unique client IDs');
  }
  return response.json();
};

// Fetch Training Metrics for a specific round
// This function is used to fetch the training metrics for a specific client from the API
export const fetchTrainingMetrics = async (clientId, order) => {
  const response = await fetch(`${API_URL}/rounds/${clientId}?order=${order}`);
  if (!response.ok) {
    throw new Error('Failed to fetch client rounds');
  }
  return response.json();
};

// Fetch Best F1 Global Metrics
// This function is used to fetch the best F1 global metrics from the API
// It sends a GET request to the API endpoint and returns the response in JSON format
export const fetchBestF1Global = async () => {
  const response = await fetch(`${API_URL}/best-f1-global`);
  if (!response.ok) {
    throw new Error("Failed to fetch best F1 global metrics");
  }
  return response.json();
};

// Post login credentials to the API
// This function is used to log in the user by sending a POST request to the API with the username and password
export const login = async (username, password) => {
  console.log('DEBUG: Logging in with:', username, password);
  
  const params = new URLSearchParams({
    username: username, 
    password: password   
  });

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    credentials: 'include',
    body: params.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json(); 
    console.error('Login failed:', errorData); 
    throw new Error(errorData.detail || 'Failed to login');
  }

  return response.json();
};

// Post logout request to the API
// This function is used to log out the user by sending a POST request to the API
export const logout = async () => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to logout');
  }

  return response;
};

// Post register credentials to the API
// This function is used to register a new user by sending a POST request to the API with the username and password
export const register = async (username, password) => {
  console.log('DEBUG: Registering with:', username, password);
  
  const params = new URLSearchParams({
    username: username,
    password: password,
  });

  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    credentials: 'include', 
    body: params.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Registration failed:', errorData);
    throw new Error(errorData.detail || 'Failed to register');
  }

  return response;
};

// Verify token request to the API
// This function is used to verify the token by sending a GET request to the API
export const verify_token = async () => {
  const response = await fetch(`${API_URL}/auth/verify-token`, {
    method: 'GET',
    credentials: "include", 
  });
  console.log('DEBUG: Verifying token:', response);
  return response;
};

// Post image file to the API for prediction
// This function is used to send an image file to the API for prediction by sending a POST request with the file
// It returns the prediction result in JSON format
export const predict = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/modeltrial/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Prediction failed:", errorData);
    throw new Error(errorData.detail || "Failed to fetch prediction");
  }

  return response.json();
};

// These 3 functions are used to check if the user is authorized to access certain routes in the application
// They send a GET request to the API and check the response status
export const authDashboard = async () => {
  const response = await fetch(`${API_URL}/auth/dashboard`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }

  return response.json();
};
export const authModelTrial = async () => {
  const response = await fetch(`${API_URL}/auth/modeltrial`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch model trial data');
  }

  return response.json();
};
export const authClients = async () => {
  const response = await fetch(`${API_URL}/auth/clients`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch clients data');
  }

  return response.json();
}