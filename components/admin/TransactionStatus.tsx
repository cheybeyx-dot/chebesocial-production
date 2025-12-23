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

export default function PaymentTable() {
  const {
    listenToCollectionWithoutQuery,
    collectionData,
    addCollection,
    updateDocument,
    updateBalance,
    listenToDocument,
  } = useFirestoreCRUD();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tableRef = useRef<HTMLTableElement>(null);
  const { user } = useUser();
  const userId = user?.id || "";

  useEffect(() => {
    const unsubscribeFunding = userId
      ? listenToCollectionWithoutQuery("classic-admin-pending-services")
      : () => {};
    const unsubscribeDocument = userId
      ? listenToDocument("classic-media-users", userId)
      : () => {};

    return () => {
      unsubscribeFunding();
      unsubscribeDocument();
    };
  }, [listenToCollectionWithoutQuery, listenToDocument, userId]);
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
      `${payment.reference} ${payment.transaction} ${payment.createdBy.firstName} ${payment.createdBy.email}`
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

  const handleApprove = async (payment: Payment) => {
    // TODO: Implement the API call to approve the payment
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const checkBalance = await fetch("/users/api/social-balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: process.env.SOCIAL_API_KEY,
          action: "balance",
        }),
      });
      const resBalance = await checkBalance.json();
      if (resBalance.balance < payment.price) {
        toast("Error", {
          description: "Insufficient fund from your API",
          className: "destructive",
        });
        return;
      }
      const response = await fetch("/admin/api/social-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "add",
          service: payment.service,
          link: payment.adlink,
          quantity: payment.quantity,
        }),
      });
      const res = await response.json();
      if (!res.order) {
        throw new Error(res.error || "Failed to create order");
      }

      const orderData = {
        orderId: res.order,
        approved: true,
        createdBy: user,
        userId: user,
        service: payment.service,
        adlink: payment.adlink,
        quantity: payment.quantity,
        price: payment.price,
        status: "success",
      };
      await addCollection("classic-admin-payment", orderData);
      // Update user balance
      await updateBalance({
        userId: user?.id || "",
        amount: payment.price,
        type: "debit",
        description: `Payment for order ${res.order._id}`,
        category: "balance_payment",
        collectBalanceName: "classic-media-users",
      });
      toast("Success", {
        description: "Order created successfully.",
        className: "bg-green-500 text-white",
      });
      await updateDocument("classic-admin-pending-services", payment.id, {
        approved: true,
      });
      setPayments(
        payments.map((payment) =>
          payment.id === payment.id ? { ...payment, approved: true } : payment
        )
      );
    } catch (error) {
      if (error instanceof Error) {
        toast("Error", {
          description: error.message,
          className: "bg-red-500 text-white",
        });
      }
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
            <TableHead>S/N</TableHead>
            <TableHead>Trans ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Ad Link</TableHead>
            <TableHead>User Email</TableHead>
            <TableHead>Order Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedPayments.map((payment, i) => (
            <TableRow key={payment.id}>
              <TableCell>{(currentPage - 1) * itemsPerPage + i + 1}</TableCell>
              <TableCell>{payment.orderId ?? "Funding"}</TableCell>
              <TableCell>{payment.price}</TableCell>
              <TableCell>{payment.status}</TableCell>
              <TableCell>{payment.createdAt}</TableCell>
              <TableCell>{payment.adlink}</TableCell>
              <TableCell>{payment.email}</TableCell>
              <TableCell>
                {payment.approved === true ? (
                  <div>
                    <span className="text-green-500">Completed</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-red-500">
                      <Button
                        className="w-full"
                        onClick={() => handleApprove(payment)}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : "Re-submit"}
                      </Button>
                    </span>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
