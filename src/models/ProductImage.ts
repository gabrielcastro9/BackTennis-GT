import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class ProductImage extends Model {
  public id!: number;
  public path!: string;
  public type!: string;
  public content!: string;
  public productId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProductImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "product_images",
    timestamps: true,
  }
);

export default ProductImage;
