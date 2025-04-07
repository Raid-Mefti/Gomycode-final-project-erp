import { Request, Response } from "express";
import { User } from "../models/User";
import { Employee } from "../models/employee";
import bcrypt from "bcrypt";
import { z } from "zod";
import nodemailer from "nodemailer";

const createUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  role: z.enum([
    "admin",
    "rh",
    "marketing",
    "finance",
    "commercial",
    "logistic",
  ]),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  age: z.number().min(18),
  gender: z.enum(["male", "female", "other"]),
  service: z.enum(["RH", "marketing", "finance", "commercial", "logistic"]),
  //role: z.string().min(2)
});

export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      username,
      email,
      role,
      firstName,
      lastName,
      age,
      gender,
      service,
      role: employeeRole,
    } = createUserSchema.parse(req.body);

    // Generate random password
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    // Create employee
    const employee = new Employee({
      firstName,
      lastName,
      age,
      gender,
      service,
      role: employeeRole,
      user: user._id,
    });

    await employee.save();

    // Send email with credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your ERP System Credentials",
      html: `
        <h1>Welcome to our ERP System</h1>
        <p>Your account has been created by the administrator.</p>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Please change your password after first login.</p>
      `,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    const employees = await Employee.find().populate(
      "user",
      "username email role"
    );

    const result = employees.map((emp) => ({
      ...emp.toObject(),
      user: users.find((u) => u._id.equals(emp.user)),
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};
