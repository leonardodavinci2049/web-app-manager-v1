"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./action-users";

export async function getOrganizations() {
  const { currentUser } = await getCurrentUser();

  // Find all members where the user is a member
  const members = await prisma.member.findMany({
    where: {
      userId: currentUser.id,
    },
  });

  // Get all organizations from those memberships
  const organizations = await prisma.organization.findMany({
    where: {
      id: {
        in: members.map((member) => member.organizationId),
      },
    },
  });

  return organizations;
}

export async function getActiveOrganization(userId: string) {
  const memberUser = await prisma.member.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!memberUser) {
    return null;
  }

  const activeOrganization = await prisma.organization.findFirst({
    where: {
      id: memberUser.organizationId,
    },
  });

  return activeOrganization;
}

export async function getOrganizationBySlug(slug: string) {
  try {
    const organizationBySlug = await prisma.organization.findFirst({
      where: {
        slug: slug,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    return organizationBySlug;
  } catch (error) {
    console.error(error);
    return null;
  }
}
