import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Product from '../models/Product';
import Category from '../models/Category';
import ProductOption from '../models/ProductOption';
import ProductImage from '../models/ProductImage';
import ProductCategory from '../models/ProductCategory';

const buildFilters = (req: Request) => {
  const { match, categoryIds, price_range, option, fields } = req.query;
  const filters: any = {};

  if (match) {
    filters[Op.or] = [
      { name: { [Op.iLike]: `%${match}%` } },
      { description: { [Op.iLike]: `%${match}%` } },
    ];
  }

  if (categoryIds) {
    filters.categoryIds = {
      [Op.overlap]: (categoryIds as string).split(',').map(Number),
    };
  }

  if (price_range) {
    const [min, max] = (price_range as string).split('-').map(Number);
    filters.price = { [Op.between]: [min, max] };
  }

  if (option) {
    for (const [key, value] of Object.entries(option)) {
      filters[`options.${key}`] = { [Op.overlap]: value };
    }
  }

  return { filters, fields };
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { limit = 12, page = 1 } = req.query;
    const { filters, fields } = buildFilters(req);

    const offset = (Number(page) - 1) * Number(limit);
    const selectedFields = fields ? (fields as string).split(',') : undefined;

    const { count, rows: products } = await Product.findAndCountAll({
      where: filters,
      limit: Number(limit) === -1 ? undefined : Number(limit),
      offset: Number(limit) === -1 ? undefined : offset,
      attributes: selectedFields,
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: ProductImage, attributes: ['id', 'content'] },
        { model: ProductOption, attributes: ['id', 'title', 'values'] },
      ],
    });

    res.status(200).json({
      data: products,
      total: count,
      limit: Number(limit),
      page: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produtos", error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: ProductImage, attributes: ['id', 'content'] },
        { model: ProductOption, attributes: ['id', 'title', 'values'] },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produto", error });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { images, options, categoryIds, ...productData } = req.body;
    console.log(productData);

    const newProduct = await Product.create(productData);

    if (images && images.length) {
      const imagePromises = images.map((image: any) =>
        ProductImage.create({
          path: image.content,
          type: image.type,
          enabled: image.enabled,
          productId: newProduct.id
        })
      );
      
      await Promise.all(imagePromises);
    }

    if (options && options.length) {
      const optionPromises = options.map((option: any) =>
        ProductOption.create({
          ...option,
          productId: newProduct.id,
          values: Array.isArray(option.values) ? option.values.join(',') : option.values
        })
      );
      await Promise.all(optionPromises);
    }

    if (categoryIds && categoryIds.length) {
      const categoryPromises = categoryIds.map((categoryId: number) =>
        ProductCategory.create({ productId: newProduct.id, categoryId })
      );
      await Promise.all(categoryPromises);
    }

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar produto", error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { images, options, ...productData } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    await product.update(productData);

    if (images && images.length) {
      const imagePromises = images.map(async (image: any) => {
        if (image.deleted) {
          return ProductImage.destroy({ where: { id: image.id } });
        } else if (image.id) {
          return ProductImage.update(image, { where: { id: image.id } });
        } else {
          return ProductImage.create({ ...image, productId: product.id });
        }
      });
      await Promise.all(imagePromises);
    }

    if (options && options.length) {
      const optionPromises = options.map(async (option: any) => {
        if (option.deleted) {
          return ProductOption.destroy({ where: { id: option.id } });
        } else if (option.id) {
          return ProductOption.update(option, { where: { id: option.id } });
        } else {
          return ProductOption.create({ ...option, productId: product.id });
        }
      });
      await Promise.all(optionPromises);
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar produto", error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    await product.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar produto", error });
  }
};
