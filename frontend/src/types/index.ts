// Tipos de usuario
export interface User {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  role: 'estudiante' | 'profesor' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// Tipos de concepto
export interface Concept {
  _id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  contenido: string;
  autor: string;
  tags: string[];
  nivel: 'básico' | 'intermedio' | 'avanzado';
  recursos: Recurso[];
  createdAt: string;
  updatedAt: string;
}

// Tipos de recurso
export interface Recurso {
  tipo: 'video' | 'documento' | 'imagen' | 'enlace';
  titulo: string;
  url: string;
  descripcion?: string;
}

// Tipos de autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

// Tipos de respuesta de la API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Tipos de contexto de autenticación
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

// Tipos de formulario
export interface FormState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Tipos de validación de contraseña
export interface PasswordStrength {
  score: number;
  feedback: string;
  color: 'danger' | 'warning' | 'info' | 'success';
}

// Tipos de navegación
export interface NavItem {
  label: string;
  path: string;
  icon: string;
  requiresAuth?: boolean;
  roles?: string[];
}

// Tipos de paginación
export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Tipos de búsqueda
export interface SearchFilters {
  query?: string;
  categoria?: string;
  nivel?: string;
  tags?: string[];
}

// Tipos de categorías
export interface Category {
  _id: string;
  nombre: string;
  descripcion: string;
  color: string;
  icon: string;
}
