"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const serviceData = [
  {
    charge: "60.00",
    startCount: "0",
    quantity: "10",
    service: "Instagram Followers | 99 Day Refill",
    status: "Completed",
    remainder: "0",
  },
  {
    charge: "100.00",
    startCount: "5",
    quantity: "50",
    service: "TikTok Followers | No Refill",
    status: "Completed",
    remainder: "0",
  },
  {
    charge: "540.00",
    startCount: "0",
    quantity: "200",
    service: "Instagram Followers | 99 Day Refill",
    status: "Completed",
    remainder: "0",
  },
];

export default function ServiceReceipt() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServiceData = useMemo(() => {
    return serviceData.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#1B2B3B]">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#7EC4CF] mb-6">RSS</h1>
          <div className="flex gap-2">
            <Input
              type="search"
              placeholder="Search"
              className="flex-1 bg-white border-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Service Table */}
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader className="bg-[#7EC4CF]">
              <TableRow className="hover:bg-[#7EC4CF]">
                <TableHead className="text-white font-semibold">
                  Charge
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Start count
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Quantity
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Service
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Status
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Remainder
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServiceData.map((item, index) => (
                <TableRow
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell>{item.charge}</TableCell>
                  <TableCell>{item.startCount}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.service}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.remainder}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
