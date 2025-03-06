
type RegisterParams = {
  nombre: string;
  apellidos: string;
  username: string;
  password: string;
};

// API base URL - you might want to move this to an environment variable in a real app
const API_URL = "http://localhost:3000/api"; // Replace with your actual API URL

class UserService {
  async register(userData: RegisterParams): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle server errors
        throw new Error(data.message || "Error al registrar usuario");
      }

      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async checkUsername(username: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/users/check-username?username=${username}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Error al verificar nombre de usuario");
      }
      
      return data.available;
    } catch (error) {
      console.error("Username check error:", error);
      // In case of error, we'll assume the username is available to avoid blocking registration
      // You might want to handle this differently in a production environment
      return true;
    }
  }
}

export const userService = new UserService();
