"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "./action-permissions";

export type Role = "owner" | "admin" | "member";

/**
 * Add a member to an organization
 * @param organizationId - The organization ID
 * @param userId - The user ID to add as member
 * @param role - The role to assign (owner, admin, member)
 */
export const addMember = async (
  organizationId: string,
  userId: string,
  role: Role,
) => {
  try {
    await auth.api.addMember({
      body: {
        userId,
        organizationId,
        role,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add member.");
  }
};

/**
 * Remove a member from an organization
 * @param memberId - The member ID to remove
 */
export const removeMember = async (memberId: string) => {
    const admin = await isAdmin();

    if (!admin) {
        return {
            success: false,
            error: "You are not authorized to remove members."
        }
    }



  try {
    await prisma.member.delete({
      where: {
        id: memberId,
      },
    });

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to remove member.",
    };
  }
};

/**
 * Get all members of an organization
 * @param organizationId - The organization ID
 */
export const getOrganizationMembers = async (organizationId: string) => {
  try {
    const members = await prisma.member.findMany({
      where: {
        organizationId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return {
      success: true,
      members,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      members: [],
      error: "Failed to fetch members.",
    };
  }
};

/**
 * Update member role
 * @param memberId - The member ID
 * @param role - The new role to assign
 */
export const updateMemberRole = async (memberId: string, role: Role) => {
  try {
    const updatedMember = await prisma.member.update({
      where: {
        id: memberId,
      },
      data: {
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return {
      success: true,
      member: updatedMember,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      member: null,
      error: "Failed to update member role.",
    };
  }
};
