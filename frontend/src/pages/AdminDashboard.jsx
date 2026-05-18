import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import { getAdminDashboard } from "../services/adminService";

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getAdminDashboard();

      setDashboardData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!dashboardData) {
    return <p>Loading...</p>;
  }

  const { stats, goalSheets, auditLogs } = dashboardData;

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/reports/export/audit",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download = "goal-report.csv";

      document.body.appendChild(a);

      a.click();

      a.remove();
    } catch (error) {
      console.log(error);

      alert("CSV export failed");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 mb-2">Employees</h2>

          <p className="text-4xl font-bold">{stats.totalEmployees}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 mb-2">GoalSheets</h2>

          <p className="text-4xl font-bold">{stats.totalGoalSheets}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 mb-2">Approved</h2>

          <p className="text-4xl font-bold text-green-600">
            {stats.approvedGoalSheets}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 mb-2">Pending</h2>

          <p className="text-4xl font-bold text-yellow-500">
            {stats.pendingGoalSheets}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Organization GoalSheets</h2>

          <button
            onClick={handleExportCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Export CSV
          </button>
        </div>

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
              <tr key={sheet.id} className="border-b">
                <td className="py-4">{sheet.employee.name}</td>

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

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-6">Recent Audit Logs</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">User</th>

              <th className="text-left py-3">Action</th>

              <th className="text-left py-3">Entity</th>

              <th className="text-left py-3">Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} className="border-b">
                <td className="py-4">{log.user.name}</td>

                <td className="py-4">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {log.action}
                  </span>
                </td>

                <td className="py-4">{log.entityType}</td>

                <td className="py-4">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
