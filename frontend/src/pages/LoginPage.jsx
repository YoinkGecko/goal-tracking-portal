function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-[400px]">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Goal Tracking Portal
        </h1>

        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>

            <input
              type="email"
              className="w-full border rounded-lg px-4 py-2 outline-none"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>

            <input
              type="password"
              className="w-full border rounded-lg px-4 py-2 outline-none"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
