import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import {
  getGoalSheetById,
  createGoal,
  submitGoalSheet,
} from "../services/goalService";

function GoalSheetDetailsPage() {
  const { id } = useParams();

  const [goalSheet, setGoalSheet] = useState(null);

  const [formData, setFormData] = useState({
    thrustArea: "",
    title: "",
    description: "",
    uomType: "MIN",
    targetValue: "",
    weightage: "",
  });

  useEffect(() => {
    fetchGoalSheet();
  }, []);

  const fetchGoalSheet = async () => {
    try {
      const data = await getGoalSheetById(id);

      setGoalSheet(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();

    try {
      await createGoal(formData);

      fetchGoalSheet();

      setFormData({
        thrustArea: "",
        title: "",
        description: "",
        uomType: "MIN",
        targetValue: "",
        weightage: "",
      });
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const handleSubmitGoalSheet = async () => {
    try {
      await submitGoalSheet(id);

      fetchGoalSheet();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  if (!goalSheet) {
    return <p>Loading...</p>;
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">GoalSheet #{goalSheet.id}</h1>

        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
          {goalSheet.status}
        </span>
      </div>

      {goalSheet.status === "DRAFT" && (
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-2xl font-semibold mb-4">Add Goal</h2>

          <form onSubmit={handleCreateGoal} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="thrustArea"
              value={formData.thrustArea}
              onChange={handleChange}
              placeholder="Thrust Area"
              className="border px-4 py-2 rounded-lg"
            />

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Goal Title"
              className="border px-4 py-2 rounded-lg"
            />

            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="border px-4 py-2 rounded-lg"
            />

            <select
              name="uomType"
              value={formData.uomType}
              onChange={handleChange}
              className="border px-4 py-2 rounded-lg"
            >
              <option value="MIN">MIN</option>

              <option value="MAX">MAX</option>

              <option value="ZERO">ZERO</option>
            </select>

            <input
              type="number"
              name="targetValue"
              value={formData.targetValue}
              onChange={handleChange}
              placeholder="Target Value"
              className="border px-4 py-2 rounded-lg"
            />

            <input
              type="number"
              name="weightage"
              value={formData.weightage}
              onChange={handleChange}
              placeholder="Weightage"
              className="border px-4 py-2 rounded-lg"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-lg col-span-2"
            >
              Add Goal
            </button>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">Goals</h2>

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

      {goalSheet.status === "DRAFT" && (
        <button
          onClick={handleSubmitGoalSheet}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
        >
          Submit GoalSheet
        </button>
      )}
    </DashboardLayout>
  );
}

export default GoalSheetDetailsPage;
