import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to chat page since that's the main page
    navigate("/chat");
  }, [navigate]);

  return null;
};

export default Index;
