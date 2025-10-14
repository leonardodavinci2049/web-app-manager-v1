"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import type { User } from "../../../../generated/prisma";

interface AllUsersProps {
  users: User[];
  organizationId: string;
}

const AllUsers = ({ users, organizationId }: AllUsersProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInviteMember = async (user: User) => {
    try {
      setIsLoading(true);
      const { error } = await authClient.organization.inviteMember({
        email: user.email,
        role: "member",
        organizationId: organizationId,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setIsLoading(false);
      toast.success("Invitation sent to member");
      router.refresh();
    } catch (error) {
      toast.error("Failed to invite member to organization");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        {users.map((user) => (
          <div key={user.id}>
            <Button
              onClick={() => handleInviteMember(user)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                `Invite ${user.name} to organization`
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
