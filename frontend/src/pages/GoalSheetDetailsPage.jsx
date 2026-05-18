import { useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

function GoalSheetDetailsPage() {
  const { id } = useParams();

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">GoalSheet #{id}</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Goals</h2>

        <p>Goal details page coming next...</p>
      </div>
    </DashboardLayout>
  );
}

export default GoalSheetDetailsPage;
