import { ShieldCheck, Zap, BadgeCheck } from "lucide-react";

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10">
      <div className="flex items-center gap-3">
        <ShieldCheck className="text-green-600" />
        <span>Secure Payments</span>
      </div>

      <div className="flex items-center gap-3">
        <Zap className="text-yellow-500" />
        <span>Fast Delivery</span>
      </div>

      <div className="flex items-center gap-3">
        <BadgeCheck className="text-blue-600" />
        <span>Trusted Services</span>
      </div>
    </div>
  );
}
