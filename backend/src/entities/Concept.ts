import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './User';
import { Category } from './Category';

export enum ConceptLevel {
  BASICO = 'básico',
  INTERMEDIO = 'intermedio',
  AVANZADO = 'avanzado',
}

export enum ResourceType {
  VIDEO = 'video',
  DOCUMENTO = 'documento',
  IMAGEN = 'imagen',
  ENLACE = 'enlace',
}

@Entity('concepts')
@Index(['titulo', 'categoria'])
@Index(['nivel', 'categoria'])
export class Concept {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  titulo: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'text' })
  contenido: string;

  @Column({
    type: 'enum',
    enum: ConceptLevel,
    default: ConceptLevel.BASICO,
  })
  nivel: ConceptLevel;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Column({ type: 'jsonb', default: [] })
  recursos: {
    tipo: ResourceType;
    titulo: string;
    url: string;
    descripcion?: string;
  }[];

  @Column({ type: 'int', default: 0 })
  visualizaciones: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.conceptos, { eager: true })
  @JoinColumn({ name: 'autorId' })
  autor: User;

  @Column({ type: 'uuid' })
  autorId: string;

  @ManyToOne(() => Category, (category) => category.conceptos, { eager: true })
  @JoinColumn({ name: 'categoriaId' })
  categoria: Category;

  @Column({ type: 'uuid' })
  categoriaId: string;
}
