
import bcrypt from 'bcryptjs';

type RegisterParams = {
  nombre: string;
  apellidos: string;
  username: string;
  password: string;
};

const API_URL = "http://localhost:3000/api";

class UserService {
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async register(userData: RegisterParams): Promise<any> {
    try {
      // Hash password before sending to API
      const hashedPassword = await this.hashPassword(userData.password);

      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...userData,
          password: hashedPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
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
