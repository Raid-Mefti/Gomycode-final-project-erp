import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await employee.findOne({ username: username });
    if (!user) throw new Error(`User ${email} not found`);
    if (!(await bcrypt.compare(password, user.password)))
      throw new Error(`invalid credentials`);
    // generate token for login
    // npx auth secret to generate token secret
    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.AUTH_SECRET,
      {
        expiresIn: 3600 * 8,
      }
    );
    res.json({ user: user.toSimpleUser(), token: token });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e.message });
  }
}
