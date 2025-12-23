import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useFirestoreCRUD } from "@/context/DatabaseHook";

const ReferralSystem = ({
  user,
  refLink,
}: {
  user: string;
  refLink: string;
}) => {
  
  const [referralLink, setReferralLink] = useState("");
  const [isCopying, setIsCopying] = useState(false);
  const pathname = usePathname();
  const { addDocument } = useFirestoreCRUD();
  useEffect(() => {
    const fullPath = `${window.location.origin}${pathname}?refLink=${
      refLink || ""
    }`;
    setReferralLink(fullPath);
  }, [pathname, refLink]);
  const handleCopyReferralLink = async () => {
    if (!user) {
      toast("Error",{
        description: "You must be logged in to copy your referral link.",
        className: "bg-red-500 text-white",
      });
      return;
    }

    setIsCopying(true);

    try {
      await navigator.clipboard.writeText(referralLink);
      await addDocument("classic-media-referral", user, {
        referralLink: refLink,
        userId: user,
      });
      toast("Success",{
        description: "Referral link copied to clipboard!",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Failed to copy or save referral link:", error);
      toast("Error",{
        description: "Failed to copy referral link. Please try again.",
        className: "bg-red-500 text-white",
      });
    } finally {
      setIsCopying(false);
    }
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Button
          onClick={handleCopyReferralLink}
          className={`px-3 py-1 rounded-md ${
            isCopying ? "text-white" : "hover:bg-gray-700"
          }`}
        >
          {isCopying ? "Copied!" : "Copy your referral link"}
        </Button>
      </div>
    </div>
  );
};

export default ReferralSystem;
