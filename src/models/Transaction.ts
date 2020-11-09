import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: 'income' | 'outcome';

  @Column()
  value: number;

  @Column()
  category_id: string;

  // Qual função ela tem que retornar quando essa variavel eh chamada? por isso escrevemos ()=> User
  @ManyToOne(() => Transaction) // apartir dos agendamentos, o que ele eh em relacao a o usuario?
  @JoinColumn({ name: 'category_id' }) // aqui to falando qual coluna que vai identificar essa coluna da tabela Transactions
  category: Transaction; // por isso muitos para um, muitos agendamentos para um usuario
  // Se vc estiver se perguntando o pq repetir provider_id e provider logo abaixo eh pq dps alem da gente ter o id
  // desse usuario a gente vai poder acessar as outras informações dele que antes seria só um id

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
