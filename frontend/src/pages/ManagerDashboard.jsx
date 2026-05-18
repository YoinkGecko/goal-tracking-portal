import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import { useNavigate } from "react-router-dom";

import { getManagerGoalSheets } from "../services/goalService";

function ManagerDashboard() {
  const navigate = useNavigate();

  const [goalSheets, setGoalSheets] = useState([]);

  useEffect(() => {
    fetchGoalSheets();
  }, []);

  const fetchGoalSheets = async () => {
    try {
      const data = await getManagerGoalSheets();

      setGoalSheets(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Team GoalSheets</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Employee</th>

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
                onClick={() => navigate(`/manager/goals/${sheet.id}`)}
              >
                <td className="py-4">{sheet.employee.name}</td>

                <td className="py-4">
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
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

export default ManagerDashboard;
