import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Product from "./Product";
import Category from "./Category";

class ProductCategory extends Model {
  public productId!: number;
  public categoryId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProductCategory.init(
  {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "product_categories",
    timestamps: true,
  }
);

Product.belongsToMany(Category, { through: ProductCategory, foreignKey: 'productId' });
Category.belongsToMany(Product, { through: ProductCategory, foreignKey: 'categoryId' });

export default ProductCategory;
