import PaymentTable from "@/components/admin/TransactionStatus";
import { auth } from "@clerk/nextjs/server";

export default async function Transaction() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Not logged in</div>;
  }

  return (
    <div><PaymentTable /></div>
  )
}
