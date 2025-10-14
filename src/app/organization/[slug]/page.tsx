import { getOrganizationBySlug } from "@/app/actions/action-organizations";
import { getUsers } from "@/app/actions/action-users";

import AllUsers from "../components/all-users";
import MembersTable from "../components/members-table";

type Params = Promise<{ slug: string }>;
const OrganizationPage = async ({ params }: { params: Params }) => {
  const { slug } = await params;

  const organization = await getOrganizationBySlug(slug);
  const users = await getUsers(organization?.id || "");

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 py-10">
      <h1 className="text-2xl font-bold">{organization?.name}</h1>
      <MembersTable members={organization?.members || []} />
      <AllUsers users={users} organizationId={organization?.id || ""} />
    </div>
  );
};

export default OrganizationPage;
