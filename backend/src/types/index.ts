import { Request } from 'express';
import { User } from '../entities/User';
import { Concept } from '../entities/Concept';
import { Category } from '../entities/Category';

// Tipos de usuario
export interface IUser extends User {}

// Tipos de concepto
export interface IConcept extends Concept {}

// Tipos de categoría
export interface ICategory extends Category {}

// Tipos de recurso
export interface IRecurso {
  tipo: 'video' | 'documento' | 'imagen' | 'enlace';
  titulo: string;
  url: string;
  descripcion?: string;
}

// Tipos de autenticación
export interface AuthRequest extends Request {
  user?: IUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  confirmPassword: string;
}

// Tipos de respuesta de la API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Tipos de JWT
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Tipos de validación
export interface ValidationError {
  field: string;
  message: string;
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
