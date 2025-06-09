
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import HelpTutorial from "../components/HelpTutorial";
import NavigationMenu from "../components/NavigationMenu";

const Help = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex">
      <NavigationMenu />
      <div className="flex-1 lg:ml-0">
        <HelpTutorial />
      </div>
    </div>
  );
};

export default Help;
