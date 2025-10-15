import { useAuth } from "../contexts/AuthContext";
import {
  useMutationDrop,
  useMutationUpdate,
} from "../hooks/mutations/mutations";

export const Card = ({ task }) => {
  const { id, title, description, status, priority, dueDate } = task;
  const { mutate: mutateUpdate } = useMutationUpdate();
  const { mutate: mutateDrop } = useMutationDrop();
  const { isAuth } = useAuth();

  const handlerDrop = (id) => {
    if (window.confirm("Are you sure to drop this task?")) {
      mutateDrop(id);
    }
  };

  const handlerUpdate = (updateTask) => {
    mutateUpdate(updateTask);
  };

  return (
    <div
      key={id}
      className="border p-4 m-2 rounded shadow flex flex-col justify-between items-start"
    >
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-justify">{description}</p>

      <div className="flex justify-between">
        <label htmlFor="check">Check: </label>
        <input
          className="ml-4 cursor-pointer"
          id="check"
          type="checkbox"
          checked={status === "done" ? true : false}
          disabled={!isAuth}
          onChange={(e) => {
            const updateTask = {
              id,
              title,
              description,
              status: e.target.checked ? "done" : "todo",
              priority,
              dueDate,
            };
            handlerUpdate(updateTask);
          }}
        />
      </div>
      <p>Priority: {priority}</p>
      <div className="flex justify-between w-full">
        <p>Due Date: {new Date(dueDate).toLocaleDateString()}</p>
        <button
          disabled={!isAuth}
          onClick={() => handlerDrop(id)}
          className={`${
            isAuth
              ? "font-bold text-red-500 rounded-2xl border px-2 py-1 hover:bg-red-500 hover:text-white transition cursor-pointer"
              : "font-bold text-gray-300 rounded-2xl border px-2 py-1 cursor-not-allowed"
          } `}
        >
          Drop
        </button>
      </div>
    </div>
  );
};
