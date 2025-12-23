
"use client";
import { Card } from "../ui/card";
import { ApiService } from "../users/OrderFormSection";
interface AdminCardProp {
  selectedServiceCategoryDb: string | null;
  apiService: ApiService | null;
}
const AdminDemoCard = ({
  selectedServiceCategoryDb,
  apiService,
}: AdminCardProp) => {
  return (
    <Card className="p-4 shadow-lg">
      <div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Start Time</label>
            <div className="p-2 rounded-md text-sm">
              {selectedServiceCategoryDb?.length}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Speed</label>
            <div className="p-2 rounded-md text-sm">{apiService?.description}</div>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm">Description</label>
          <div className="p-2 rounded-md text-sm">
          
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AdminDemoCard;
