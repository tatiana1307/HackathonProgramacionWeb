import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../entities/User';
import { ApiResponse, AuthRequest } from '../types';

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const expiresIn = process.env.JWT_EXPIRE || '7d';
  
  return jwt.sign(
    { userId },
    secret,
    { expiresIn: expiresIn }
  );
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, telefono, password } = req.body;

    // Verificar si el usuario ya existe
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'El usuario ya existe con este email',
      } as ApiResponse);
      return;
    }

    // Crear nuevo usuario
    const newUser = userRepository.create({
      nombre,
      email,
      telefono,
      password,
      role: UserRole.ESTUDIANTE,
    });

    await userRepository.save(newUser);

    // Generar token
    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: newUser.toJSON(),
        token,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    } as ApiResponse);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      } as ApiResponse);
      return;
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      } as ApiResponse);
      return;
    }

    // Verificar si el usuario está activo
    if (!user.activo) {
      res.status(401).json({
        success: false,
        message: 'Usuario desactivado',
      } as ApiResponse);
      return;
    }

    // Generar token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        user: user.toJSON(),
        token,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    } as ApiResponse);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  // En una implementación JWT stateless, el logout se maneja en el frontend
  // Aquí podríamos implementar una blacklist de tokens si es necesario
  res.json({
    success: true,
    message: 'Sesión cerrada exitosamente',
  } as ApiResponse);
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado',
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      message: 'Perfil obtenido exitosamente',
      data: req.user.toJSON(),
    } as ApiResponse);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    } as ApiResponse);
  }
};
