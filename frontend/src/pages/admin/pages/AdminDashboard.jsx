const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Welcome Admin
      </h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          Total Users
        </div>

        <div className="bg-white p-4 rounded shadow">
          Total Orders
        </div>

        <div className="bg-white p-4 rounded shadow">
          Revenue
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;