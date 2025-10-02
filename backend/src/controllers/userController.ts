import { Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { AuthRequest } from '../types';

export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const userRepository = AppDataSource.getRepository(User);
    const queryBuilder = userRepository
      .createQueryBuilder('user')
      .where('user.activo = :activo', { activo: true });

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    queryBuilder.orderBy('user.createdAt', 'DESC');
    queryBuilder.skip(skip).take(Number(limit));

    const [users, total] = await queryBuilder.getManyAndCount();

    // Excluir passwords de la respuesta
    const usersWithoutPasswords = users.map(user => user.toJSON());

    res.json({
      success: true,
      message: 'Usuarios obtenidos exitosamente',
      data: usersWithoutPasswords,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id, activo: true },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
      return;
    }

    // Verificar permisos (solo el propio usuario o admin puede ver)
    if (req.user?.id !== id && req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver este usuario',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Usuario obtenido exitosamente',
      data: user.toJSON(),
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, telefono, role } = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado',
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id, activo: true },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
      return;
    }

    // Verificar permisos (solo el propio usuario o admin puede editar)
    if (req.user.id !== id && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'No tienes permisos para editar este usuario',
      });
      return;
    }

    // Solo admin puede cambiar roles
    if (role && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden cambiar roles',
      });
      return;
    }

    // Actualizar campos
    user.nombre = nombre || user.nombre;
    user.telefono = telefono || user.telefono;
    if (role && req.user.role === 'admin') {
      user.role = role;
    }

    const updatedUser = await userRepository.save(user);

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: updatedUser.toJSON(),
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado',
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id, activo: true },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
      return;
    }

    // Verificar permisos (solo admin puede eliminar)
    if (req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden eliminar usuarios',
      });
      return;
    }

    // No permitir auto-eliminación
    if (req.user.id === id) {
      res.status(400).json({
        success: false,
        message: 'No puedes eliminar tu propia cuenta',
      });
      return;
    }

    // Soft delete (marcar como inactivo)
    user.activo = false;
    await userRepository.save(user);

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};
