import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Product from "./Product";

class ProductOption extends Model {
  public id!: number;
  public productId!: number;
  public title!: string;
  public shape!: string;
  public radius!: number;
  public type!: string;
  public values!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProductOption.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shape: {
      type: DataTypes.ENUM('square', 'circle'),
      allowNull: true,
      defaultValue: 'square',
    },
    radius: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    type: {
      type: DataTypes.ENUM('text', 'color'),
      allowNull: true,
      defaultValue: 'text',
    },
    values: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: "product_options",
    timestamps: true,
  }
);

ProductOption.belongsTo(Product, { foreignKey: "productId" });

export default ProductOption;
