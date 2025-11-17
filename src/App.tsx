import { BrowserRouter } from "react-router-dom";

import { AbilityContext } from "@/lib/Can";
import { useAppSelector } from "@/store/hooks";
import { Toaster } from "@/components/ui/sonner";
import { AppRoutes } from "@/routes";
import { AuthProvider, SocketIOGuard } from "@/components/common";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  const ability = useAppSelector((state) => state.auth.ability);

  return (
    <AbilityContext.Provider value={ability}>
      <SocketIOGuard>
        <AppRoutes />
        <Toaster />
      </SocketIOGuard>
    </AbilityContext.Provider>
  );
}

export default App;
