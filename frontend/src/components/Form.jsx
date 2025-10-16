import { serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuth } from "../context/context";
import { useFirebaseCreateMutation } from "../mutations/fireMutation";
// import { useMutationCreate } from "../hooks/mutations/mutations";

export const Form = () => {
  // const { mutate, isPending } = useMutationCreate();
  const navigate = useNavigate();
  const { mutate, isPending } = useFirebaseCreateMutation();
  const { isAuth } = useAuth();

  const handlerSubmit = (e) => {
    e.preventDefault();
    if (!isAuth) return;

    const formData = {
      title: e.target.title.value || "No title",
      description: e.target.description.value || "No description",
      status: "todo",
      priority: e.target.priority.value || "low",
      dueDate: e.target.dueDate.value || new Date().toISOString().split("T")[0],
      author: {
        id: auth.currentUser?.uid,
        name: auth.currentUser?.displayName,
        email: auth.currentUser?.email,
      },
      createAt: serverTimestamp(),
      updateAt: serverTimestamp(),
    };

    mutate(formData, {
      onSuccess: () => {
        toast.success("Todo cretaed succesfully");
      },
      onError: () => {
        toast.error("something was wrong");
      },
    });
    navigate("/");
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col">
      <h1 className="font-bold text-2xl my-2">Create Todo</h1>
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
          {isPending ? "Creating..." : "Create Todo"}
        </button>
      </form>
    </div>
  );
};
