import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { loginSchema } from "../types/userTypes";
import { verifyPassword } from "../utils/hash";

export function login(app: FastifyInstance) {
  app.post("/login", async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    const isPassword = await verifyPassword(password, user.password);

    if (!isPassword) {
      return res.status(400).send({ message: "Password incorrect" });
    }

    const token = await app.jwt.sign({ id: user.id, email: user.email });

    return res.status(200).send(token);
  });
}
