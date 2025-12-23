"use client";

import React, { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFirestoreCRUD } from "@/context/DatabaseHook";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "../ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { LoadingSpinner } from "./DbLoadingSpinner";
import { SelectItem } from "../ui/select";
import TwoFactorVerification from "./TwoFactorVerification";

interface WithdrawBonusesProps {
  isOpen: boolean;
  onClose: () => void;
  userClerk: string;
  currentBonus: number;
  emailAddress: string | null;
}

const withdrawalFormSchema = z.object({
  accountNumber: z
    .string()
    .regex(/^\d{10}$/, "Account number must be 10 digits"),
  accountName: z.string().min(3, "Account name must be at least 3 characters"),
  bankName: z.string().min(2, "Bank name must be at least 2 characters"),
  withdrawAmount: z.coerce
    .number()
    .min(1000, "Minimum withdrawal amount is NGN 1000")
    .max(1000000, "Maximum withdrawal amount is NGN 1,000,000"),
  accountType: z.string(),
  africaCountry: z.string(),
});

type WithdrawalFormData = z.infer<typeof withdrawalFormSchema>;
const accountTypes = [
  { type: "savings", label: "Savings" },
  { type: "current", label: "Current" },
];
const majorAfricanCountry = [
  { country: "Nigeria", label: "Nigeria", currency: "NGN" },
  { country: "Ghana", label: "Ghana", currency: "GHS" },
  { country: "Benin", label: "Benin", currency: "XOF" },
  { country: "Chad", label: "Chad", currency: "XAF" },
  { country: "Togo", label: "Togo", currency: "XOF" },
  { country: "Mali", label: "Mali", currency: "XOF" },
];
export default function WithdrawBonuses({
  isOpen,
  onClose,
  userClerk,
  currentBonus,
}: WithdrawBonusesProps) {
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const { updateDocument } = useFirestoreCRUD();

  const form = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalFormSchema),
    defaultValues: {
      accountNumber: "",
      accountName: "",
      bankName: "",
      withdrawAmount: 0,
      accountType: "",
      africaCountry: "",
    },
  });
  const handleModalClose = useCallback(() => {
    form.reset();
    setShowTwoFactor(false);
    onClose();
  }, [form, onClose]);

  const handleWithdrawalSubmit = useCallback(
    async (data: WithdrawalFormData) => {
      if (processingWithdrawal) return;
      if (data.withdrawAmount > currentBonus) {
        toast("Error",{
          description: "Withdrawal amount cannot exceed your current bonus.",
          className: "bg-red-500 text-white",
        });
        return;
      }

      // Instead of processing the withdrawal immediately, show the 2FA verification
      setShowTwoFactor(true);
    },
    [currentBonus, processingWithdrawal]
  );

  const handleTwoFactorSuccess = useCallback(async () => {
    setProcessingWithdrawal(true);
    try {
      const data = form.getValues();
      await updateDocument("classic-media-users", userClerk, {
        withdrawalRequests: [
          {
            ...data,
            status: "pending",
            timestamp: new Date().toISOString(),
          },
        ],
        totalReferralBonus: currentBonus - data.withdrawAmount,
      });

      toast("Success",{
        description: "Your withdrawal request has been submitted successfully.",
        className: "bg-green-500 text-white",
      });
      handleModalClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("API Error:", error.message);
      } else {
        toast("Error",{
          description:
            "There was an error submitting your withdrawal request. Please try again.",
          className: "bg-red-500 text-white",
        });
      }
    } finally {
      setProcessingWithdrawal(false);
      setShowTwoFactor(false);
    }
  }, [form, updateDocument, userClerk, currentBonus, handleModalClose]);

  if (!isOpen) return null;

  if (showTwoFactor) {
    return (
      <div className="bg-opacity-50 flex items-center justify-center z-50 scroll-smooth">
        <Card className="p-6 rounded-lg w-96 max-w-[90%]">
          <TwoFactorVerification
            onSuccess={handleTwoFactorSuccess}
            onCancel={() => setShowTwoFactor(false)}
          />
        </Card>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="relative w-full max-w-md my-6 mx-auto p-4">
        <Card className="w-full rounded-lg shadow-xl">
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto p-6">
            <div className="mb-4 text-sm text-center italic">
              Note: This withdrawal page is exclusively for users from African
              countries. Please provide commercial bank account details only.
            </div>

            <h3 className="text-xl font-bold mb-4">
              Withdraw Your Bonus{" "}
              <span className="text-red-500 text-sm block mt-1">
                Minimum withdrawal is $5
              </span>
            </h3>

            <p className="mb-4">Current Bonus: NGN {currentBonus.toFixed(2)}</p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleWithdrawalSubmit)}
                className="space-y-4"
              >
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="africaCountry"
                  label="Country"
                  placeholder="Select country"
                >
                  {majorAfricanCountry.map((country, i) => (
                    <SelectItem key={i} value={country.country}>
                      {`${country.label} (${country.currency})`}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="accountNumber"
                  label="Account Number"
                  type="text"
                  placeholder="Enter 10-digit account number"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="accountName"
                  label="Account Name"
                  type="text"
                  placeholder="Enter account name"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="bankName"
                  label="Bank Name"
                  type="text"
                  placeholder="Enter bank name"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="withdrawAmount"
                  label="Withdrawal Amount (NGN)"
                  type="number"
                  placeholder="Enter amount to withdraw"
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="accountType"
                  label="Account Type"
                  placeholder="Select account type"
                >
                  {accountTypes.map((type, i) => (
                    <SelectItem key={i} value={type.type}>
                      {type.label}
                    </SelectItem>
                  ))}
                </CustomFormField>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleModalClose}
                    className="w-full sm:w-1/2"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:w-1/2"
                    disabled={
                      processingWithdrawal ||
                      !form.formState.isValid ||
                      currentBonus <= 0
                    }
                  >
                    {processingWithdrawal ? (
                      <LoadingSpinner size={20} />
                    ) : (
                      "Withdraw"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}
