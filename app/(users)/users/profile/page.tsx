import TwoFactorSetup from "@/components/users/TwoFactorSetup";
import { auth } from "@clerk/nextjs/server";


export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <TwoFactorSetup userId={userId} />
    </div>
  );
}
