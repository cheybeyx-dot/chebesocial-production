"use client";

import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { DollarSignIcon, Wallet } from "lucide-react";
import AddFunds from "./AddFund";
import WithdrawBonuses from "./WithdrawBonus";
import { CategoryContext } from "@/context/CategoryProvider";
import { mockDataFromFirebase } from "@/lib/action/mockData.action";
import ReferralSystem from "./ReferralSystem";
import { mockOrganicDataFromFirebase } from "@/lib/action/organicMockData.action";
import { toast } from "sonner";

interface QuickActionsProps {
  user: string;
  emailAddress: string | null;
  refLink: string;
}

export default function QuickActions({
  user,
  emailAddress,
  refLink,
}: QuickActionsProps) {
  const {
    setShowFundingModal,
    setShowWithdrawModal,
    showFundingModal,
    showWithdrawModal,
  } = useContext(CategoryContext);

  const uploadMockData = async () => {
    if (process.env.NODE_ENV !== "development") {
      toast("Error",{
        description: `Not permitted`,
        className: "bg-red-500 text-white",
      });
      return;
    }
    try {
      await mockDataFromFirebase();
      await mockOrganicDataFromFirebase();
      toast("Successfull",{
        description: "Successfully uploaded",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast("Error",{
          description: `Not uploaded ${error.message}`,
          className: "bg-red-500 text-white",
        });
      } else {
        console.log("An unknown error occurred");
      }
    }
  };

  return (
    <>
      <div className="text-sm text-center mb-4 p-2">
        <span className="text-sm">
          Copy and share your personal referral link below. For every purchase
          made through your link, you&apos;ll earn $0.30
        </span>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center justify-between">
        {/* First Row (Add Funds and Upload) */}
        <div className="flex flex-row items-center gap-4">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setShowFundingModal(true)}
          >
            <DollarSignIcon className="w-6 h-6" />
            <Button className="w-full bg-green-500">Add Funds</Button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <Button onClick={uploadMockData}>Upload</Button>
          )}

          <AddFunds
            isOpen={showFundingModal}
            onClose={() => setShowFundingModal(false)}
            userClerk={user}
            emailAddress={emailAddress}
          />
        </div>

        {/* Second Row (Referral System and Withdraw) */}
        <div className="flex flex-row items-center gap-4">
          <ReferralSystem user={user} refLink={refLink} />

          <Button
            variant="outline"
            onClick={() => setShowWithdrawModal(true)}
            className="whitespace-nowrap"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
        </div>

        <WithdrawBonuses
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          userClerk={user}
          emailAddress={emailAddress}
          currentBonus={0}
        />
      </div>
    </>
  );
}
