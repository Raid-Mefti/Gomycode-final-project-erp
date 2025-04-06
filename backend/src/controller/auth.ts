import { EmployeeModel } from "../models/employee";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function loginEmployee(req, res) {
  const { email, password } = req.body;
  try {
    const employee = await EmployeeModel.findOne({ email: email });
    if (!employee) throw new Error(`employee ${email} not found`);
    if (!(await bcrypt.compare(password, employee.password)))
      throw new Error(`invalid credentials`);
    // generate token for login
    // npx auth secret to generate token secret
    const token = jwt.sign(
      { _id: employee._id.toString() },
      process.env.AUTH_SECRET,
      {
        expiresIn: 3600 * 8,
      },
    );
    res.json({ user: user.toSimpleUser(), token: token });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e.message });
  }
}

export async function registerUser(req, res) {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    const user = await userModel.create({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      role,
    });
    /*  const user = new userModel({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      });
      // actions 
      await user.save(); */
    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.AUTH_SECRET,
      { expiresIn: 3600 * 24 },
    );
    res.json({ user: user.toSimpleUser(), token: token });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export function checkUser(req, res) {
  res.json({ data: req.user.toSimpleUser() });
}

export async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) throw new Error(`User ${email} not found`);
    if (!(await bcrypt.compare(password, user.password)))
      throw new Error(`invalid credentials`);
    // generate token for login
    // npx auth secret to generate token secret
    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.AUTH_SECRET,
      {
        expiresIn: 3600 * 24,
      },
    );
    res.json({ user: user.toSimpleUser(), token: token });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e.message });
  }
}

export async function registerUser(req, res) {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    const user = await userModel.create({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      role,
    });
    /*  const user = new userModel({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      });
      // actions 
      await user.save(); */
    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.AUTH_SECRET,
      { expiresIn: 3600 * 24 },
    );
    res.json({ user: user.toSimpleUser(), token: token });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export function checkUser(req, res) {
  res.json({ data: req.user.toSimpleUser() });
}
