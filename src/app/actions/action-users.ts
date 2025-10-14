"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
