import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import { getGoalSheets } from "../services/goalService";
import { createGoalSheet } from "../services/goalService";

function EmployeeDashboard() {
  const [goalSheets, setGoalSheets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGoalSheets();
  }, []);

  const fetchGoalSheets = async () => {
    try {
      const data = await getGoalSheets();

      setGoalSheets(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateGoalSheet = async () => {
    try {
      await createGoalSheet();

      fetchGoalSheets();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Employee Dashboard</h1>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 mb-2">Total GoalSheets</h2>

          <p className="text-3xl font-bold">{goalSheets.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">GoalSheets</h2>

        <div className="flex justify-end mb-6">
          <button
            onClick={handleCreateGoalSheet}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Create GoalSheet
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">ID</th>

              <th className="text-left py-3">Status</th>

              <th className="text-left py-3">Goals</th>

              <th className="text-left py-3">Created</th>
            </tr>
          </thead>

          <tbody>
            {goalSheets.map((sheet) => (
              <tr
                key={sheet.id}
                className="border-b cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/employee/goals/${sheet.id}`)}
              >
                <td className="py-4">#{sheet.id}</td>

                <td className="py-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {sheet.status}
                  </span>
                </td>

                <td className="py-4">{sheet.goals.length}</td>

                <td className="py-4">
                  {new Date(sheet.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default EmployeeDashboard;
