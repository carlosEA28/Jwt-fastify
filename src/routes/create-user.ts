import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { createUserSchema } from "../types/userTypes";
import { hashPassword } from "../utils/hash";

export function createUser(app: FastifyInstance) {
  app.post("/user", async (req, res) => {
    const { name, email, password } = createUserSchema.parse(req.body);

    const userExist = await prisma.user.findUnique({
      where: { email },
    });

    if (userExist) {
      return res.status(400).send({ message: "user already exists" });
    }

    const hashUserPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashUserPassword,
      },
    });

    return res.status(201).send(user);
  });
}
