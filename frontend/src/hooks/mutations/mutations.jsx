import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { create, drop, update } from "../../api/service";

//TODO... you need understand new feature about optimistic update with inifinite query scroll

// Helper: apply updater to either single-page shape ({ tasks }) or infinite ({ pages: [{ tasks }, ...] })
const applyUpdater = (data, updater) => {
  if (!data) return data;
  if (data.pages) {
    return {
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        tasks: updater(page.tasks),
      })),
    };
  }
  if (data.tasks) {
    return { ...data, tasks: updater(data.tasks) };
  }
  // fallback: if data is an array of tasks
  if (Array.isArray(data)) {
    return updater(data);
  }
  return data;
};

export const useMutationCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createTask"],
    mutationFn: create,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ["task"] });

      const previous = queryClient.getQueriesData(["task"]);

      previous.forEach(([queryKey, data]) => {
        if (!data) return;
        queryClient.setQueryData(queryKey, (old) =>
          applyUpdater(old, (tasks) => [
            ...tasks,
            { id: Date.now(), ...newTask },
          ])
        );
      });

      return { previous };
    },
    onSuccess: (data) => {
      console.log("Creation successful! " + data.message);
    },
    onError: (error, newTask, context) => {
      if (context?.previous) {
        context.previous.forEach(([queryKey, snapshot]) => {
          queryClient.setQueryData(queryKey, snapshot);
        });
      }
      console.log(
        "Creation failed! " + error.message + " Reverting changes..."
      );
      toast.error("Creation failed! " + error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
  });
};

export const useMutationUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateTask"],
    mutationFn: update,
    onMutate: async (updateTask) => {
      await queryClient.cancelQueries({ queryKey: ["task"] });

      const previous = queryClient.getQueriesData(["task"]);

      previous.forEach(([queryKey, data]) => {
        if (!data) return;
        queryClient.setQueryData(queryKey, (old) =>
          applyUpdater(old, (tasks) =>
            tasks.map((task) =>
              task.id === updateTask.id ? { ...task, ...updateTask } : task
            )
          )
        );
      });

      return { previous };
    },
    onSuccess: (data) => {
      console.log("Update successful! " + data.message);
    },
    onError: (error, updateTask, context) => {
      if (context?.previous) {
        context.previous.forEach(([queryKey, snapshot]) => {
          queryClient.setQueryData(queryKey, snapshot);
        });
      }
      console.log(
        "Update failed! " +
          error.message +
          " Reverting changes..." +
          updateTask.id
      );

      toast.error("Update failed! " + error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
  });
};

export const useMutationDrop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["dropTask"],
    mutationFn: drop,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["task"] });

      const previous = queryClient.getQueriesData(["task"]);

      previous.forEach(([queryKey, data]) => {
        if (!data) return;
        queryClient.setQueryData(queryKey, (old) =>
          applyUpdater(old, (tasks) => tasks.filter((task) => task.id !== id))
        );
      });

      return { previous };
    },
    onSuccess: (data) => {
      console.log("Drop successful! " + data.message);
    },
    onError: (error, id, context) => {
      if (context?.previous) {
        context.previous.forEach(([queryKey, snapshot]) => {
          queryClient.setQueryData(queryKey, snapshot);
        });
      }
      console.log(
        "Drop failed! " + error.message + " Reverting changes..." + id
      );
      toast.error("Drop failed! " + error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
  });
};
