"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  ArrowBigLeft,
  ArrowBigRight,
  Printer,
  DownloadIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import { useFirestoreCRUD } from "@/context/DatabaseHook";
import { useUser } from "@clerk/nextjs";
import { where } from "firebase/firestore";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Payment {
  id: string;
  approved: boolean;
  createdAt:
    | string
    | {
        seconds: number;
        nanoseconds: number;
      };
  createdBy: UserDetails;
  message: string;
  adlink: string;
  redirecturl: string;
  reference: string;
  status: string;
  timestamp: string;
  transaction: string;
  selectedCategory: string;
  subcategory: string;
  quantity: string;
  email: string;
  orderId: string;
  service: string;
  price: number;
}
interface PaymentStatus {
  status: string;
}

export default function ReceiptTable({
  orderIds,
}: {
  paymentStatus: PaymentStatus;
  orderIds: number;
}) {
  const {
    listenToCollection,
    collectionData,
    listenToDocument,
    updateDocument,
    updateBalance,
  } = useFirestoreCRUD();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const tableRef = useRef<HTMLTableElement>(null);
  const { user } = useUser();
  const userId = user?.id || "";

  useEffect(() => {
    const unsubscribeFunding = userId
      ? listenToCollection("classic-admin-payment", [
          where("type", "!=", "api"),
          where("userId", "==", userId),
        ])
      : () => {};

    return () => {
      unsubscribeFunding();
    };
  }, [listenToCollection, listenToDocument, userId]);
  useEffect(() => {
    setPayments(
      collectionData.filter((data): data is Payment => data !== null)
    );
  }, [collectionData]);
  const itemsPerPage = 10;

  const formatTimestamp = (timestamp: Payment["createdAt"]) => {
    if (typeof timestamp === "string") {
      return new Date(timestamp).toLocaleString();
    } else if (
      typeof timestamp === "object" &&
      "seconds" in timestamp &&
      "nanoseconds" in timestamp
    ) {
      const date = new Date(
        timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
      );
      return date.toLocaleString();
    }
    return "Invalid Date";
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) =>
      `${payment.id} ${payment.transaction} ${payment.price} ${payment.adlink}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [payments, searchTerm]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = useMemo(() => {
    return filteredPayments
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .map((payment) => ({
        ...payment,
        createdAt: formatTimestamp(payment.createdAt),
      }));
  }, [filteredPayments, currentPage]);

  const handleCancelOrder = async (id: string, price: number) => {
    try {
      setIsProcessing(true);

      // 1. Update the order status to cancelled
      await updateDocument("classic-admin-payment", id, {
        status: "cancelled",
      });

      if (userId) {
        // 2. Use the updateBalance function to credit the user's account
        const result = await updateBalance({
          userId: userId,
          amount: price,
          type: "credit", // Use "credit" since we're adding money back
          description: `Refund for cancelled order #${id}`,
          category: "refund",
          collectBalanceName: "classic-media-users",
        });

        toast("Order Cancelled", {
          description: `Order #${id} has been cancelled and ${price} has been refunded to your balance. New balance: ${result.newBalance}`,
          className: "text-white bg-green-500",
        });
      }

      // Reset the cancelling order ID
      setCancellingOrderId(null);
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast("Error", {
        description: "Failed to cancel order. Please try again.",
        className: "bg-red-500 text-white",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow && tableRef.current) {
      printWindow.document.write(
        "<html><head><title>Payment Transactions</title>"
      );
      printWindow.document.write("<style>");
      printWindow.document.write(`
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      `);
      printWindow.document.write("</style></head><body>");
      printWindow.document.write("<h1>Payment Transactions</h1>");
      printWindow.document.write(tableRef.current.outerHTML);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    if (tableRef.current) {
      doc.text("Payment Transactions", 14, 15);
      doc.autoTable({ html: tableRef.current, startY: 20 });
    }
    doc.save("payment_transactions.pdf");
  };

  // Helper function to determine if an order can be cancelled
  const canCancelOrder = (payment: Payment) => {
    // Check if the order is not completed, successful, or already cancelled
    return (
      payment.status !== "success" &&
      payment.status !== "cancelled" &&
      payment.status !== "processing"
    );
  };

  // Helper function to get the status display text
  const getStatusDisplayText = (payment: Payment) => {
    if (payment.status === "cancelled") {
      return "Cancelled";
    } else if (payment.status === "success") {
      return "Completed";
    } else if (payment.status === "processing") {
      return "Processing";
    } else {
      return "Pending";
    }
  };

  // Helper function to get status class
  const getStatusClass = (payment: Payment) => {
    if (payment.status === "cancelled") {
      return "bg-gray-100 text-gray-800";
    } else if (payment.status === "success") {
      return "bg-green-100 text-green-800";
    } else if (payment.status === "processing") {
      return "bg-blue-100 text-blue-800";
    } else {
      return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="flex-1 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="flex space-x-2 mb-4 sm:mb-0">
          <Input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDownloadPDF}>
            <DownloadIcon className="h-4 w-4 mr-2" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ArrowBigLeft className="h-4 w-4" />
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ArrowBigRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Table ref={tableRef}>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">S/N</TableHead>
            <TableHead className="font-semibold">ID</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Link</TableHead>
            <TableHead className="font-semibold">Charge</TableHead>
            <TableHead className="font-semibold">Quantity</TableHead>
            <TableHead className="font-semibold">Service</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedPayments.map((payment, i) => (
            <TableRow key={payment.id}>
              <TableCell>{(currentPage - 1) * itemsPerPage + i + 1}</TableCell>
              <TableCell>{payment.orderId || orderIds}</TableCell>
              <TableCell>{payment.createdAt ?? ""}</TableCell>
              <TableCell>
                <Link
                  href={payment.adlink ?? "#"}
                  className="text-[#40C4CF] hover:underline"
                >
                  {payment.adlink}
                </Link>
              </TableCell>
              <TableCell>{payment.price ?? ""}</TableCell>
              <TableCell>{payment.quantity ?? ""}</TableCell>
              <TableCell>{payment.service ?? ""}</TableCell>
              <TableCell>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusClass(
                    payment
                  )}`}
                >
                  {getStatusDisplayText(payment)}
                </span>
              </TableCell>
              <TableCell>
                {canCancelOrder(payment) && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setCancellingOrderId(payment.id)}
                        disabled={isProcessing}
                      >
                        {isProcessing && payment.id === cancellingOrderId
                          ? "Processing..."
                          : "Cancel & Refund"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Cancel Order and Process Refund
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel order #
                          {payment.orderId}? This will process a refund of{" "}
                          {payment.price} and cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => setCancellingOrderId(null)}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleCancelOrder(payment.id, payment.price)
                          }
                          disabled={isProcessing}
                        >
                          {isProcessing
                            ? "Processing..."
                            : "Confirm Cancellation"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                {payment.status === "cancelled" && (
                  <span className="text-gray-500 text-sm">
                    Already cancelled
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
