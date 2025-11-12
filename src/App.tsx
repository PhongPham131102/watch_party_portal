import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AbilityContext } from "@/lib/Can";
import { useAppSelector } from "@/store/hooks";

function App() {
  const ability = useAppSelector((state) => state.auth.ability);

  return (
    <AbilityContext.Provider value={ability}>
      <RouterProvider router={router} />
    </AbilityContext.Provider>
  );
}

export default App;
