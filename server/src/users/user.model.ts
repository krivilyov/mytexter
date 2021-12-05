import { Column, Model, Table, DataType } from 'sequelize-typescript';

interface UserCreationAttributes {
  email: string;
  password: string;
  role: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({
    type: DataType.ENUM('customer', 'teacher', 'admin'),
    defaultValue: 'customer',
  })
  role: string;
}
