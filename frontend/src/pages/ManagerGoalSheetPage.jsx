import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import api from "../services/api";

function ManagerGoalSheetPage() {
  const { id } = useParams();

  const [goalSheet, setGoalSheet] = useState(null);

  useEffect(() => {
    fetchGoalSheet();
  }, []);

  const fetchGoalSheet = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(`/goal-sheets/manager/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGoalSheet(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApprove = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        `/goal-sheets/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchGoalSheet();
    } catch (error) {
      alert(error.response?.data?.message || "Approval failed");
    }
  };

  const handleReturn = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        `/goal-sheets/${id}/return`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchGoalSheet();
    } catch (error) {
      alert(error.response?.data?.message || "Return failed");
    }
  };

  if (!goalSheet) {
    return <p>Loading...</p>;
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Review GoalSheet #{goalSheet.id}</h1>

        <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full">
          {goalSheet.status}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Employee Goals</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Title</th>

              <th className="text-left py-3">Target</th>

              <th className="text-left py-3">Weightage</th>

              <th className="text-left py-3">UOM</th>
            </tr>
          </thead>

          <tbody>
            {goalSheet.goals.map((goal) => (
              <tr key={goal.id} className="border-b">
                <td className="py-4">{goal.title}</td>

                <td className="py-4">{goal.targetValue}</td>

                <td className="py-4">{goal.weightage}%</td>

                <td className="py-4">{goal.uomType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {goalSheet.status === "SUBMITTED" && (
        <div className="flex gap-4">
          <button
            onClick={handleApprove}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Approve
          </button>

          <button
            onClick={handleReturn}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
          >
            Return
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ManagerGoalSheetPage;
