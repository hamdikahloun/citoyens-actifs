import FabButton from "./FabButton";
import { useSelector } from "react-redux";

// bouton pour ajouter un signalement (bouton '+') **************************************
export default function AddFeedbackFab({ style, onPress }) {
  const user = useSelector((state) => state.user);  
  
  if (!user?.email) return null;
  //if (user.role !== "user") return null;

  return <FabButton style={style} onPress={onPress} iconName="plus"/>;
}
