import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Concept } from '../entities/Concept';
import { Category } from '../entities/Category';
import { User } from '../entities/User';
import { AuthRequest } from '../types';
import { Like, ILike } from 'typeorm';

export const getConcepts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, categoria, nivel, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const conceptRepository = AppDataSource.getRepository(Concept);
    const queryBuilder = conceptRepository
      .createQueryBuilder('concept')
      .leftJoinAndSelect('concept.autor', 'autor')
      .leftJoinAndSelect('concept.categoria', 'categoria')
      .where('concept.activo = :activo', { activo: true });

    // Filtros
    if (categoria) {
      queryBuilder.andWhere('categoria.nombre = :categoria', { categoria });
    }

    if (nivel) {
      queryBuilder.andWhere('concept.nivel = :nivel', { nivel });
    }

    if (search) {
      queryBuilder.andWhere(
        '(concept.titulo ILIKE :search OR concept.descripcion ILIKE :search OR concept.contenido ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Ordenar por fecha de creación
    queryBuilder.orderBy('concept.createdAt', 'DESC');

    // Paginación
    queryBuilder.skip(skip).take(Number(limit));

    const [concepts, total] = await queryBuilder.getManyAndCount();

    res.json({
      success: true,
      message: 'Conceptos obtenidos exitosamente',
      data: concepts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error al obtener conceptos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

export const getConceptById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const conceptRepository = AppDataSource.getRepository(Concept);
    const concept = await conceptRepository.findOne({
      where: { id, activo: true },
      relations: ['autor', 'categoria'],
    });

    if (!concept) {
      res.status(404).json({
        success: false,
        message: 'Concepto no encontrado',
      });
      return;
    }

    // Incrementar visualizaciones
    concept.visualizaciones += 1;
    await conceptRepository.save(concept);

    res.json({
      success: true,
      message: 'Concepto obtenido exitosamente',
      data: concept,
    });
  } catch (error) {
    console.error('Error al obtener concepto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

export const createConcept = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { titulo, descripcion, contenido, categoriaId, nivel, tags, recursos } = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado',
      });
      return;
    }

    const conceptRepository = AppDataSource.getRepository(Concept);
    const categoryRepository = AppDataSource.getRepository(Category);

    // Verificar que la categoría existe
    const categoria = await categoryRepository.findOne({ where: { id: categoriaId } });
    if (!categoria) {
      res.status(400).json({
        success: false,
        message: 'Categoría no encontrada',
      });
      return;
    }

    const newConcept = conceptRepository.create({
      titulo,
      descripcion,
      contenido,
      categoriaId,
      autorId: req.user.id,
      nivel: nivel || 'básico',
      tags: tags || [],
      recursos: recursos || [],
    });

    const savedConcept = await conceptRepository.save(newConcept);

    // Obtener el concepto completo con relaciones
    const fullConcept = await conceptRepository.findOne({
      where: { id: savedConcept.id },
      relations: ['autor', 'categoria'],
    });

    res.status(201).json({
      success: true,
      message: 'Concepto creado exitosamente',
      data: fullConcept,
    });
  } catch (error) {
    console.error('Error al crear concepto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

export const updateConcept = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, contenido, categoriaId, nivel, tags, recursos } = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado',
      });
      return;
    }

    const conceptRepository = AppDataSource.getRepository(Concept);
    const concept = await conceptRepository.findOne({
      where: { id },
      relations: ['autor'],
    });

    if (!concept) {
      res.status(404).json({
        success: false,
        message: 'Concepto no encontrado',
      });
      return;
    }

    // Verificar permisos (solo el autor o admin puede editar)
    if (concept.autorId !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'No tienes permisos para editar este concepto',
      });
      return;
    }

    // Actualizar campos
    concept.titulo = titulo || concept.titulo;
    concept.descripcion = descripcion || concept.descripcion;
    concept.contenido = contenido || concept.contenido;
    concept.categoriaId = categoriaId || concept.categoriaId;
    concept.nivel = nivel || concept.nivel;
    concept.tags = tags || concept.tags;
    concept.recursos = recursos || concept.recursos;

    const updatedConcept = await conceptRepository.save(concept);

    // Obtener el concepto completo con relaciones
    const fullConcept = await conceptRepository.findOne({
      where: { id: updatedConcept.id },
      relations: ['autor', 'categoria'],
    });

    res.json({
      success: true,
      message: 'Concepto actualizado exitosamente',
      data: fullConcept,
    });
  } catch (error) {
    console.error('Error al actualizar concepto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

export const deleteConcept = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado',
      });
      return;
    }

    const conceptRepository = AppDataSource.getRepository(Concept);
    const concept = await conceptRepository.findOne({
      where: { id },
      relations: ['autor'],
    });

    if (!concept) {
      res.status(404).json({
        success: false,
        message: 'Concepto no encontrado',
      });
      return;
    }

    // Verificar permisos (solo el autor o admin puede eliminar)
    if (concept.autorId !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este concepto',
      });
      return;
    }

    // Soft delete (marcar como inactivo)
    concept.activo = false;
    await conceptRepository.save(concept);

    res.json({
      success: true,
      message: 'Concepto eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar concepto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

export const searchConcepts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, categoria, nivel, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const conceptRepository = AppDataSource.getRepository(Concept);
    const queryBuilder = conceptRepository
      .createQueryBuilder('concept')
      .leftJoinAndSelect('concept.autor', 'autor')
      .leftJoinAndSelect('concept.categoria', 'categoria')
      .where('concept.activo = :activo', { activo: true });

    if (q) {
      queryBuilder.andWhere(
        '(concept.titulo ILIKE :search OR concept.descripcion ILIKE :search OR concept.contenido ILIKE :search OR concept.tags::text ILIKE :search)',
        { search: `%${q}%` }
      );
    }

    if (categoria) {
      queryBuilder.andWhere('categoria.nombre = :categoria', { categoria });
    }

    if (nivel) {
      queryBuilder.andWhere('concept.nivel = :nivel', { nivel });
    }

    queryBuilder.orderBy('concept.createdAt', 'DESC');
    queryBuilder.skip(skip).take(Number(limit));

    const [concepts, total] = await queryBuilder.getManyAndCount();

    res.json({
      success: true,
      message: 'Búsqueda completada',
      data: concepts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

export const getConceptsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const conceptRepository = AppDataSource.getRepository(Concept);
    const [concepts, total] = await conceptRepository.findAndCount({
      where: {
        activo: true,
        categoria: { nombre: category },
      },
      relations: ['autor', 'categoria'],
      order: { createdAt: 'DESC' },
      skip,
      take: Number(limit),
    });

    res.json({
      success: true,
      message: `Conceptos de ${category} obtenidos exitosamente`,
      data: concepts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error al obtener conceptos por categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};
