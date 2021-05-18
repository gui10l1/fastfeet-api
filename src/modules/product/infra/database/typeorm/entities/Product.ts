import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export default class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('decimal', { precision: 5, scale: 2 })
  price: number;

  @Column('text')
  description: string;

  @Column('int')
  quantity_in_stock: number;

  @Column('varchar', { array: true })
  photos: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
