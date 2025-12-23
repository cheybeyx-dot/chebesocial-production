import { Card } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <>
      <Card className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 shadow-lg">
        <div className="mb-6 text-center md:text-left">
          <h3 className="text-2xl font-bold mb-4 mt-4 ml-4 text-center md:text-left text-blue-700 dark:text-blue-300">
            Welcome to admin panel
          </h3>
        </div>
      </Card>
    </>
  );
}
