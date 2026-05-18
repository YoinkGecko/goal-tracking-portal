import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import api from "../services/api";

function ManagerGoalSheetPage() {
  const { id } = useParams();
  const [commentData, setCommentData] = useState({});

  const [goalSheet, setGoalSheet] = useState(null);

  useEffect(() => {
    fetchGoalSheet();
  }, []);

  const handleAddComment = async (updateId) => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        `/quarterly-updates/${updateId}/comment`,
        {
          comment: commentData[updateId],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchGoalSheet();
    } catch (error) {
      alert(error.response?.data?.message || "Comment failed");
    }
  };

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
              <>
                <tr key={goal.id} className="border-b">
                  <td className="py-4">{goal.title}</td>

                  <td className="py-4">{goal.targetValue}</td>

                  <td className="py-4">{goal.weightage}%</td>

                  <td className="py-4">{goal.uomType}</td>
                </tr>

                <tr>
                  <td colSpan="4" className="bg-gray-50 p-4">
                    <div className="space-y-4">
                      {goal.quarterlyUpdates?.length > 0 ? (
                        goal.quarterlyUpdates.map((update) => (
                          <div
                            key={update.id}
                            className="border rounded-lg p-4 bg-white"
                          >
                            <div className="flex gap-6 mb-4">
                              <p>
                                <strong>Quarter:</strong> {update.quarter}
                              </p>

                              <p>
                                <strong>Actual:</strong> {update.actualValue}
                              </p>

                              <p>
                                <strong>Progress:</strong>{" "}
                                {update.progressScore}%
                              </p>

                              <p>
                                <strong>Status:</strong> {update.status}
                              </p>
                            </div>

                            {update.managerComment && (
                              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-900">
                                  <strong>Existing Comment:</strong>{" "}
                                  {update.managerComment}
                                </p>
                              </div>
                            )}

                            <textarea
                              placeholder="Add manager comment..."
                              value={commentData[update.id] || ""}
                              onChange={(e) =>
                                setCommentData({
                                  ...commentData,

                                  [update.id]: e.target.value,
                                })
                              }
                              className="w-full border rounded-lg p-3 mb-3"
                              rows="3"
                            />

                            <button
                              onClick={() => handleAddComment(update.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            >
                              Save Comment
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400">
                          No quarterly updates yet
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              </>
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
