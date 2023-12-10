import AdminNavbar from "./AdminNavbar";

export const metadata = {
  title: "E-Shop Admin",
  description: "E-Shop Admin Dashboard",
};

interface Props {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: Props) => {
  return (
    <div>
      <AdminNavbar />
      {children}
    </div>
  );
};

export default AdminLayout;
