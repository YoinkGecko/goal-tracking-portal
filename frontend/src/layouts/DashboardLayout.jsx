function DashboardLayout({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="w-[250px] bg-blue-700 text-white p-6">
        <h1 className="text-2xl font-bold mb-10">Goal Portal</h1>

        <div className="space-y-4">
          <p className="cursor-pointer">Dashboard</p>

          <p className="cursor-pointer">Goals</p>

          <p className="cursor-pointer">Quarterly Updates</p>
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-white shadow px-8 py-4 flex justify-between">
          <h2 className="text-xl font-semibold">Welcome, {user.name}</h2>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
