import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Error de validación',
      error: err.message
    } as ApiResponse);
    return;
  }

  // Error de duplicado de Mongoose
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    res.status(400).json({
      success: false,
      message: 'El recurso ya existe',
      error: 'Recurso duplicado'
    } as ApiResponse);
    return;
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Token inválido',
      error: 'No autorizado'
    } as ApiResponse);
    return;
  }

  // Error por defecto
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
  } as ApiResponse);
};
