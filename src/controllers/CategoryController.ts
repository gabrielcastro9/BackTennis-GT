import { Request, Response } from "express";
import Category from "../models/Category";

export const getCategories = async (req: Request, res: Response) => {
  try {
    let { limit = 12, page = 1, fields, use_in_menu } = req.query;

    limit = parseInt(limit as string);
    page = parseInt(page as string);
    const offset = (page - 1) * limit;

    const queryOptions: any = {};

    if (limit !== -1) {
      queryOptions.limit = limit;
      queryOptions.offset = offset;
    }

    if (fields) {
      queryOptions.attributes = (fields as string).split(",");
    }

    if (use_in_menu) {
      queryOptions.where = { use_in_menu: use_in_menu === 'true' };
    }

    const categories = await Category.findAndCountAll(queryOptions);

    res.json({
      data: categories.rows,
      total: categories.count,
      limit,
      page,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({
      id: category.id,
      name: category.name,
      slug: category.slug,
      useInMenu: category.useInMenu,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, use_in_menu } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: "Name and slug are required" });
    }

    const newCategory = await Category.create({ name, slug, useInMenu: use_in_menu });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, use_in_menu } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: "Name and slug are required" });
    }

    const [updated] = await Category.update(
      { name, slug, useInMenu: use_in_menu },
      { where: { id: req.params.id } }
    );

    if (!updated) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(204).send();  
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const deleted = await Category.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
