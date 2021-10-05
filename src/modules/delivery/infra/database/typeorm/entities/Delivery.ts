import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Product from '@modules/product/infra/database/typeorm/entities/Product';

@Entity('deliveries')
export default class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  deliveryman_id: string;

  @Column('uuid')
  recipient_id: string;

  @Column('uuid')
  product_id: string;

  @Column('varchar', { length: 255 })
  address: string;

  @Column('varchar', { length: 255 })
  postal_code: string;

  @Column('varchar', { length: 255 })
  neighborhood: string;

  @Column('varchar', { length: 255 })
  city: string;

  @Column('varchar', { length: 255 })
  state: string;

  @Column('timestamp with time zone')
  canceled_at: Date;

  @Column('varchar', { length: 255 })
  signature_id: string;

  @Column('timestamp with time zone')
  start_date: Date;

  @Column('timestamp with time zone')
  end_date: Date;

  @Column('int')
  product_quantity: number;

  @ManyToOne(() => Product, product => product.deliveries)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
