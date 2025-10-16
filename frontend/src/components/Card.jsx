import { useAuth } from "../context/context";
import {
  useFirebaseDeleteMutation,
  useFirebaseUpdateMutation,
} from "../mutations/fireMutation";

export const Card = ({ todo }) => {
  const { id, title, description, status, priority, dueDate } = todo;
  const { isAuth } = useAuth();
  const { mutate: mutateUpdate } = useFirebaseUpdateMutation();
  const { mutate: mutateDrop } = useFirebaseDeleteMutation();

  const handlerDrop = (id) => {
    if (window.confirm("Are you sure to drop this todo?")) {
      mutateDrop(id);
    }
  };

  const handlerUpdate = (todoId, updates) => {
    mutateUpdate({ todoId, updates });
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
          disabled={!isAuth}
          type="checkbox"
          checked={status === "done" ? true : false}
          onChange={(e) => {
            const updates = {
              id,
              title,
              description,
              status: e.target.checked ? "done" : "todo",
              priority,
              dueDate,
            };
            handlerUpdate(id, updates);
          }}
        />
      </div>
      <p>Priority: {priority}</p>
      <div className="flex justify-between w-full">
        <p>Due Date: {new Date(dueDate).toLocaleDateString()}</p>
        <button
          disabled={!isAuth}
          onClick={() => handlerDrop(id)}
          className={
            !isAuth
              ? "font-bold text-gray-500 rounded-2xl border px-2 py-1 cursor-not-allowed"
              : "font-bold text-red-500 rounded-2xl border px-2 py-1 hover:bg-red-500 hover:text-white transition cursor-pointer"
          }
        >
          Drop
        </button>
      </div>
    </div>
  );
};
