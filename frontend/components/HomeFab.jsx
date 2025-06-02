import FabButton from "./FabButton";
import { useSelector } from "react-redux";

export default function HomeFab({ style, onPress }) {
  const user = useSelector((state) => state.user);

  if (!user?.email) return null;

  return <FabButton style={style} onPress={onPress} iconName="home" />;
}
