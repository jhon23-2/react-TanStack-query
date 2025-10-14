import { Toaster } from "react-hot-toast";
import "./App.css";
import { AppRouters } from "./routers/AppRouters";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AppRouters />
    </>
  );
}

export default App;
