import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('deliveries')
export default class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  deliveryman_id: string;

  @Column('uuid')
  recipient_id: string;

  @Column('varchar', { length: 255 })
  product: string;

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
