"use client";
import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFirestoreCRUD } from "@/context/DatabaseHook";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { Form } from "../ui/form";
import { toast } from "sonner";
import { SmallButtonLoadingSpinner } from "../SmallButtonLoading";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { updateExchangeRates } from "@/lib/nowPayment/exchangeRate";

interface AddFundsProps {
  isOpen: boolean;
  onClose: () => void;
  userClerk: string;
  emailAddress: string | null;
}

// Define the form schema jgjghg
const fundingFormSchema = z.object({
  fundAmount: z.coerce
    .number()
    .min(1500, "Minimum amount is 1,500")
    .max(1000000, "Maximum amount is 1,000,000"),
  paymentMethod: z.enum(["crypto", "korapay"]),
});

type FundingFormData = z.infer<typeof fundingFormSchema>;

interface CryptoPaymentInfo {
  paymentUrl: string;
  paymentId: string;
  payAddress: string;
  payAmount: number;
  payCurrency: string;
  estimatedAmount: number;
  actualAmount: number;
  networkFee: number;
}

interface KoraPaymentInfo {
  paymentUrl: string;
  reference: string;
  amountNGN: number;
  amountUSD: number;
}

export default function AddFunds({
  isOpen,
  onClose,
  userClerk,
  emailAddress,
}: AddFundsProps) {
  const [processingFunding, setProcessingFunding] = useState(false);
  const [fundingReturnedId, setFundingReturnedId] = useState("");
  const { addCollection, updateDocument, addDocument } = useFirestoreCRUD();
  const [cryptoPaymentInfo, setCryptoPaymentInfo] =
    useState<CryptoPaymentInfo | null>(null);
  const [koraPaymentInfo, setKoraPaymentInfo] =
    useState<KoraPaymentInfo | null>(null);

  const form = useForm<FundingFormData>({
    resolver: zodResolver(fundingFormSchema),
    defaultValues: {
      fundAmount: 0,
      paymentMethod: "crypto",
    },
  });

  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    updateExchangeRates();
  }, []);

  const handleModalClose = useCallback(() => {
    form.reset();
    setFundingReturnedId("");
    setCryptoPaymentInfo(null);
    setKoraPaymentInfo(null);
    setIsPolling(false);
    onClose();
  }, [form, onClose, setIsPolling]);

  const checkPaymentStatus = useCallback(
    async (reference: string) => {
      try {
        const response = await fetch(
          `/users/api/check-korapay-status?reference=${reference}`
        );
        const data = await response.json();
        if (data.status === "completed") {
          toast("Payment Successful",{
            description:
              "Your payment has been confirmed and funds added to your account.",
            className: "bg-green-500 text-white",
          });
          handleModalClose();
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    },
    [handleModalClose]
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isPolling && koraPaymentInfo?.reference) {
      intervalId = setInterval(() => {
        checkPaymentStatus(koraPaymentInfo.reference);
      }, 10000); // Check every 5 seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPolling, koraPaymentInfo, checkPaymentStatus]);

  const handleFundingSubmit = useCallback(
    async (data: FundingFormData) => {
      if (processingFunding) return;

      setProcessingFunding(true);
      await addDocument("classic-media-users", userClerk, {
        userId: userClerk,
      });
      try {
        const res = await addCollection("classic-admin-funding", {
          amount: data.fundAmount,
          approved: false,
          createdBy: userClerk,
          userId: userClerk,
          timestamp: new Date().toISOString(),
          status: "pending",
          paymentMethod: data.paymentMethod,
        });
        if (res) {
          setFundingReturnedId(res);
        }
        console.log("Funding document created:", res);

        
        if (data.paymentMethod === "crypto") {
          const response = await fetch("/users/api/create-crypto-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: data.fundAmount,
              userId: userClerk,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to create crypto payment");
          }

          const paymentInfo: CryptoPaymentInfo = await response.json();
          setCryptoPaymentInfo(paymentInfo);

          // Update the funding document with the payment ID
          await updateDocument("classic-admin-funding", res, {
            reference: paymentInfo.paymentId,
            fundingReturnedId,
          });
        } else if (data.paymentMethod === "korapay") {
          const response = await fetch("/users/api/create-korapay-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: data.fundAmount,
              userId: userClerk,
              email: emailAddress,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to create KoraPay payment");
          }

          const paymentInfo: KoraPaymentInfo = await response.json();
          setKoraPaymentInfo(paymentInfo);

          // Update the funding document with the payment reference
          await updateDocument("classic-admin-funding", res, {
            reference: paymentInfo.reference,
            fundingReturnedId,
          });

          // Start polling for payment status
          setIsPolling(true);
        }

        toast("Payment Initiated",{
          description:
            "Your payment has been initiated. Please complete the transfer to finalize your deposit.",
          className: "bg-blue-500 text-white",
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log("API Error:", error.message);
        } else {
          toast("Error",{
            description:
              "There was an error submitting your funding request. Please try again.",
            className: "bg-red-500 text-white",
          });
        }
      } finally {
        setProcessingFunding(false);
      }
    },
    [
      processingFunding,
      addDocument,
      userClerk,
      addCollection,
      updateDocument,
      emailAddress,
      fundingReturnedId,
    ]
  );

  // Function to format the crypto amount
  const formatCryptoAmount = (amount: number) => {
    return amount.toFixed(3);
  };

  const { USD_NGN } = { USD_NGN: 1 };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <Card className="p-6 rounded-lg w-96 max-w-[90%]">
        <h3 className="text-xl font-bold mb-4">Add Funds to Your Account</h3>
        <span>Minimum deposit is $1</span>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFundingSubmit)}
            className="space-y-4"
          >
            <div className="mb-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="fundAmount"
                label="Amount (USD)"
                type="number"
                placeholder="Enter amount"
                className="mb-4"
              />
              <p className="text-sm text-gray-500">
                Equivalent: ₦{(form.watch("fundAmount") * USD_NGN).toFixed(2)}{" "}
                NGN
              </p>
            </div>

            <div className="mb-4">
              <Label>Payment Method</Label>
              <RadioGroup
                defaultValue="crypto"
                onValueChange={(value) =>
                  form.setValue("paymentMethod", value as "crypto" | "korapay")
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="crypto" id="crypto" />
                  <Label htmlFor="crypto">Crypto (USDT)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="korapay" id="korapay" />
                  <Label htmlFor="korapay">KoraPay (NGN)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleModalClose}
                className="w-1/2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-1/2"
                disabled={processingFunding || !form.formState.isValid}
              >
                {processingFunding ? (
                  <SmallButtonLoadingSpinner size={20} />
                ) : (
                  "Proceed"
                )}
              </Button>
            </div>
          </form>
        </Form>
        {cryptoPaymentInfo && (
          <div className="mt-4">
            <p>
              Please send exactly{" "}
              {formatCryptoAmount(cryptoPaymentInfo.payAmount)} USDT (TRC20) to
              this address:
            </p>
            <p className="font-mono text-sm break-all">
              {cryptoPaymentInfo.payAddress}
            </p>
            <p className="mt-2">
              Estimated amount:{" "}
              {formatCryptoAmount(cryptoPaymentInfo.estimatedAmount)} USDT
            </p>
            {cryptoPaymentInfo.networkFee > 0 && (
              <p>
                Network fee: {formatCryptoAmount(cryptoPaymentInfo.networkFee)}{" "}
                USDT
              </p>
            )}
            <p className="font-bold">
              Total to send: {formatCryptoAmount(cryptoPaymentInfo.payAmount)}{" "}
              USDT
            </p>
            <Button
              onClick={() =>
                window.open(cryptoPaymentInfo.paymentUrl, "_blank")
              }
              className="w-full mt-2"
            >
              View Payment Details
            </Button>
          </div>
        )}
        {koraPaymentInfo && (
          <div className="mt-4">
            <p>Please pay ₦{koraPaymentInfo.amountNGN.toFixed(2)} NGN</p>
            <p>{/* (Equivalent to ${koraPaymentInfo.amountUSD.toFixed(2)} USD) */}</p>
            <Button
              onClick={() => window.open(koraPaymentInfo.paymentUrl, "_blank")}
              className="w-full mt-2"
            >
              Pay with KoraPay
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
