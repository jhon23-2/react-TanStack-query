import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { create, drop, update } from "../../api/service";

export const useMutationCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createTask"],
    mutationFn: create,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ["task"] });

      const previousData = queryClient.getQueryData(["task"]);

      queryClient.setQueryData(["task"], (old) => {
        if (!old) return old;
        return {
          ...old,
          tasks: [...old.tasks, { id: Date.now(), ...newTask }],
        };
      });

      return { previousData };
    },
    onSuccess: (data) => {
      console.log("Creation successful! " + data.message);
    },
    onError: (error, newTask, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["task"], context.previousData);
      }
      console.log(
        "Creation failed! " + error.message + " Reverting changes..."
      );
      toast.error(error.message, { duration: 3500 });
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

      const previousData = queryClient.getQueryData(["task"]);

      queryClient.setQueryData(["task"], (old) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.map((task) =>
            task.id === updateTask.id ? { ...task, ...updateTask } : task
          ),
        };
      });

      return { previousData };
    },
    onSuccess: (data) => {
      console.log("Update successful! " + data.message);
    },
    onError: (error, updateTask, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["task"], context.previousData);
      }
      console.log(
        "Update failed! " +
          error.message +
          " Reverting changes..." +
          updateTask.id
      );
      toast.error(error.message, { duration: 3500 });
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

      const previousData = queryClient.getQueryData(["task"]);

      queryClient.setQueryData(["task"], (old) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.filter((task) => task.id !== id),
        };
      });

      return { previousData };
    },
    onSuccess: (data) => {
      console.log("Drop successful! " + data.message);
    },
    onError: (error, id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["task"], context.previousData);
      }
      console.log(
        "Drop failed! " + error.message + " Reverting changes..." + id
      );
      toast.error(error.message, { duration: 3500 });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
  });
};
