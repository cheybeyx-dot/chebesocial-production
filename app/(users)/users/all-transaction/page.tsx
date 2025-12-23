import AllReceiptTable from "@/components/payments/AllReceiptTable";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import { currentUser } from "@clerk/nextjs/server";
interface PaymentStatus {
  status: string;
}
const AllTransaction = async () => {
  let data: PaymentStatus = {
    status: "",
  };
  let orderIds: number = 0;
  try {
    const user = await currentUser();
    if (!user) {
      return null;
    }
    const orderId = adminDb.collection("classic-admin-payment");
    const orderTransctionId = await orderId
      .where("userId", "==", user.id)
      .get();
    orderIds = orderTransctionId.docs[0].data().orderId;
    const response = await fetch("https://reallysimplesocial.com/api/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: process.env.SOCIAL_API_KEY,
        action: "status",
        order: orderIds,
      }),
    });
    data = await response.json();
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
  return (
    <div>
      <AllReceiptTable paymentStatus={data} orderIds={orderIds} />
    </div>
  );
};

export default AllTransaction;
