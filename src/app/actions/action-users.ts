"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const getCurrentUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const currentUser = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
  });

  if (!currentUser) {
    redirect("/sign-in");
  }

  return {
    ...session,
    currentUser,
  };
};

export const getUsers = async (organizationId: string) => {
  try {
    const members = await prisma.member.findMany({
      where: {
        organizationId: organizationId,
      },
    });

    const users = await prisma.user.findMany({
      where: {
        id: {
          notIn: members.map((member) => member.userId),
        },
      },
    });

    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
};
