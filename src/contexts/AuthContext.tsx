import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = 'admin' | 'gestor' | 'instrutor' | 'veterano' | 'novato';

export interface UserProfile {
  id: string;
  nomeCompleto: string;
  email: string;
  matricula?: string;
  cpf?: string;
  perfilTipo: 'novato' | 'veterano' | 'instrutor' | 'gestor';
  roles: UserRole[];
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

interface RegisterData {
  nomeCompleto: string;
  email: string;
  password: string;
  perfilTipo: 'novato' | 'veterano';
  matricula?: string;
  cpf?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - check against stored users
    const usersData = localStorage.getItem('nexus_users');
    const users = usersData ? JSON.parse(usersData) : [];
    
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('nexus_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    // Mock registration
    const usersData = localStorage.getItem('nexus_users');
    const users = usersData ? JSON.parse(usersData) : [];
    
    // Check if email already exists
    if (users.some((u: any) => u.email === data.email)) {
      return false;
    }

    const newUser = {
      id: crypto.randomUUID(),
      nomeCompleto: data.nomeCompleto,
      email: data.email,
      password: data.password,
      matricula: data.matricula,
      cpf: data.cpf,
      perfilTipo: data.perfilTipo,
      roles: [data.perfilTipo] as UserRole[],
    };

    users.push(newUser);
    localStorage.setItem('nexus_users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('nexus_user', JSON.stringify(userWithoutPassword));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.roles.includes(role) || false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
