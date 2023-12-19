import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";

export const serverUser = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user as User;
  return user;
};
