"use client";

import { useFirestoreCRUD } from "@/context/DatabaseHook";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Referral {
  id: string;
  balance: number;
}
interface UserData {
  totalReferralBonus: number;
  referrals: Referral[];
}
export default function ReferralUpdater({
  myRefCode,
  userId,
}: {
  myRefCode: string;
  userId: string;
}) {
  const { collectionData, listenToCollection, updateDocument } =
    useFirestoreCRUD();

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const unsubscribeAllUsers = listenToCollection("classic-media-users");
    return () => unsubscribeAllUsers();
  }, [listenToCollection]);

  useEffect(() => {
    if (collectionData.length > 0) {
      const newReferrals = collectionData
        .filter((doc) => doc && doc.refLink === myRefCode && doc.id !== userId)
        .map((doc) => ({
          id: doc?.id,
          balance: doc?.balance || 0,
          email: doc?.email,
          createdAt: doc?.createdAt,
        }));
      setReferrals(newReferrals);
      const userData = collectionData.find((doc) => doc?.id === userId);
      setCurrentUserData(userData as UserData);
    }
  }, [collectionData, myRefCode, userId]);

  useEffect(() => {
    const updateReferralBonus = async () => {
      if (currentUserData && referrals.length > 0) {
        const currentReferrals: Referral[] = currentUserData.referrals || [];
        const updatedReferrals = [...currentReferrals];
        let totalBonus = currentUserData.totalReferralBonus || 0;
        let needsUpdate = false;

        for (const ref of referrals) {
          const existingReferral = updatedReferrals.find(
            (r) => r.id === ref.id
          );
          if (!existingReferral) {
            // New referral
            updatedReferrals.push(ref);
            if (ref.balance >= 15000) {
              // 15000 NGN threshold
              const bonusUSD = await formatCurrency(ref.balance * 0.1, "USD");
              totalBonus += parseFloat(bonusUSD.replace(/[^0-9.-]+/g, ""));
            }
            needsUpdate = true;
          } else if (existingReferral.balance !== ref.balance) {
            // Existing referral with balance change
            if (ref.balance >= 15000 && existingReferral.balance < 15000) {
              // Newly qualified for bonus
              const bonusUSD = await formatCurrency(ref.balance * 0.1, "USD");
              totalBonus += parseFloat(bonusUSD.replace(/[^0-9.-]+/g, ""));
              needsUpdate = true;
            } else if (
              ref.balance >= 15000 &&
              existingReferral.balance >= 15000
            ) {
              // Already qualified, but balance increased
              const additionalBonusUSD = await formatCurrency(
                (ref.balance - existingReferral.balance) * 0.1,
                "USD"
              );
              totalBonus += parseFloat(
                additionalBonusUSD.replace(/[^0-9.-]+/g, "")
              );
              needsUpdate = true;
            }
            // Update the balance in updatedReferrals
            existingReferral.balance = ref.balance;
          }
        }

        if (needsUpdate) {
          updateDocument("classic-media-users", userId, {
            referrals: updatedReferrals,
            referralCount: updatedReferrals.length,
            totalReferralBonus: totalBonus,
          });
        }
      }
    };

    updateReferralBonus();
  }, [currentUserData, referrals, updateDocument, userId]);
  return null;
}
