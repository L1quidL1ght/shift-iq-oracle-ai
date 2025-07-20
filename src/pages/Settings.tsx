
import { Navigation } from "@/components/Navigation";
import AdminDashboard from "@/components/AdminDashboard";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AdminDashboard />
      </div>
    </div>
  );
};

export default Settings;
