"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { CreditCard, Users, ShoppingCart, Gift, Table } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "./DbLoadingSpinner";
import { useFirestoreCRUD } from "@/context/DatabaseHook";
import { where } from "firebase/firestore";
import CurrencyConverterUsd from "../payments/CurrencyConverter";

export default function UserStats({ user }: { user: string; refLink: string }) {
  const [isReferralTableOpen, setIsReferralTableOpen] = useState(false);
  const {
    loading: dbLoading,
    error,
    collectionDataWithQ,
    documentData,
    documentData1,
    listenToDocument,
    listenToDocument1,
    listenToCollection,
  } = useFirestoreCRUD();
  useEffect(() => {
    const unsubscribeDocument = listenToDocument("classic-media-users", user);
    const unsubscribeReferral = listenToDocument1(
      "classic-media-referral",
      user
    );
    const unsubscribeFunding = user
      ? listenToCollection("classic-admin-funding", [
          where("userId", "==", user),
          where("status", "==", "completed"),
        ])
      : () => {};

    return () => {
      unsubscribeFunding();
      unsubscribeDocument();
      unsubscribeReferral();
    };
  }, [listenToCollection, listenToDocument, listenToDocument1, user]);
  if (dbLoading) {
    return <LoadingSpinner size={48} />;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }
  return (
    <Card className="mb-6">
      <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatItem
          icon={<ShoppingCart className="h-6 w-6 text-blue-500" />}
          label="Total Orders"
          value={collectionDataWithQ.length.toString()}
        />
        <StatItem
          icon={<CreditCard className="h-6 w-6 text-green-500" />}
          label="Your Balance"
          value={
            <CurrencyConverterUsd
              amountInNaira={documentData?.balance ?? "0"}
            />
          }
        />
        <StatItem
          icon={<Gift className="h-6 w-6 text-purple-500" />}
          label="Ref. Bonus"
          value={
            <CurrencyConverterUsd
              amountInNaira={
                documentData?.totalReferralBonus ?? "0"
              }
            />
          }
        />
        <StatItem
          icon={<Users className="h-6 w-6 text-orange-500" />}
          label="No of Refs"
          value={
            <>
              {documentData1?.referredUserLink?.length ?? "0"}
              <Dialog
                open={isReferralTableOpen}
                onOpenChange={setIsReferralTableOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2">
                    <Table className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Referral Table</DialogTitle>
                  </DialogHeader>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Email
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Bonus
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {documentData1?.referredUserLink?.map(
                          (referral: Referral, index: number) => (
                            <tr
                              key={index}
                              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            >
                              <td className="px-6 py-4">{referral?.email}</td>
                              <td className="px-6 py-4">
                                {new Date(
                                  referral?.createdAt
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                NGN{referral.firstName}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          }
        />
      </CardContent>
    </Card>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

interface Referral {
  email: string;
  createdAt: string;
  firstName: string;
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="p-3 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium">
          {label}
        </p>
        <div className="font-bold flex items-center">{value}</div>
      </div>
    </div>
  );
}
