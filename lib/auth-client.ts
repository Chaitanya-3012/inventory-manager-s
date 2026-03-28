interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  department: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Login failed",
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Network error",
    };
  }
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Registration failed",
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Network error",
    };
  }
}

export async function logout(): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        error: data.error || "Logout failed",
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Network error",
    };
  }
}

export async function checkSession(): Promise<{ authenticated: boolean; user?: User }> {
  try {
    const response = await fetch("/api/auth/session");
    const data = await response.json();

    if (!response.ok || !data.authenticated) {
      return { authenticated: false };
    }

    return {
      authenticated: true,
      user: data.user,
    };
  } catch (error) {
    console.error("Session check error:", error);
    return { authenticated: false };
  }
}