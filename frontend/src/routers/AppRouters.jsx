import { Route, Routes } from "react-router-dom";
import { Form } from "../components/Form";
import { Home } from "../components/Home";
import { Login } from "../components/login";

export const AppRouters = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Form />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <div className="text-amber-300 font-bold text-2xl">
              {" "}
              Page not Found
            </div>
          }
        />
      </Routes>
    </div>
  );
};
