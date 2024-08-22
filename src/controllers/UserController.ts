import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "firstname", "surname", "email"],
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstname, surname, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const newUser = await User.create({ firstname, surname, email, password: await bcrypt.hash(password, 10) });
    
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });
    
    res.status(201).json({
      id: newUser.id,
      firstname: newUser.firstname,
      surname: newUser.surname,
      email: newUser.email,
      token
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login", error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { firstname, surname, email } = req.body;
    const [updated] = await User.update(
      { firstname, surname, email },
      { where: { id: req.params.id } }
    );
    if (updated) {
      return res.status(204).send(); 
    }
    return res.status(404).json({ error: "User not found" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (deleted) {
      return res.status(204).send(); 
    }
    return res.status(404).json({ error: "User not found" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
