import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useMutationCreate } from "../hooks/mutations/mutations";

export const Form = () => {
  const { mutate, isPending } = useMutationCreate();
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  useEffect(() => {
    if (!isAuth) {
      navigate("/");
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  You must be logged in to create a task.
                </p>
              </div>
            </div>
          </div>
        </div>
      ));
    }
  }, [isAuth, navigate]);

  const handlerSubmit = (e) => {
    e.preventDefault();

    const formData = {
      title: e.target.title.value || "No title",
      description: e.target.description.value || "No description",
      status: "todo",
      priority: e.target.priority.value || "low",
      dueDate: e.target.dueDate.value || new Date().toISOString().split("T")[0],
    };

    mutate(formData);
    navigate("/");
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col">
      <h1 className="font-bold text-2xl my-2">Create Task</h1>
      <form
        onSubmit={handlerSubmit}
        className="flex flex-col gap-4 p-4 max-w-md mx-auto w-3xl h-auto border rounded-2xl py-15 px-20"
      >
        <input type="text" name="title" placeholder="Title" />
        <textarea name="description" placeholder="Description"></textarea>
        <select name="priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input type="date" name="dueDate" />
        <button
          className="border rounded-2xl cursor-pointer bg-green-500 font-bold hover:bg-green-600 text-white p-2"
          type="submit"
        >
          {isPending ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
};
