import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createTodo, deleteTodo, updateTodo } from "../api/fireService";
import { useAuth } from "../context/context";

export const useFirebaseCreateMutation = () => {
  const queryClient = useQueryClient();

  const { user } = useAuth();
  const userId = user?.uid;

  return useMutation({
    mutationKey: ["createFireMutation"],
    mutationFn: createTodo,

    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todos", userId] });

      const previousTodos = queryClient.getQueryData(["todos", userId]);

      queryClient.setQueryData(["todos", userId], (old) => {
        if (!old) return [{ ...newTodo, id: "temp-" + Date.now() }];
        return [...old, { ...newTodo, id: "temp-" + Date.now() }];
      });

      return { previousTodos };
    },

    onError: (error, newTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos", userId], context.previousTodos);
      }
      toast.error("Error to create Todo ");
      console.error("Create error:", error);
    },

    onSuccess: (data) => {
      toast.success("Todo created successfully with ID: " + data, {
        duration: 3000,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", userId] });
    },
  });
};

export const useFirebaseUpdateMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.uid;

  return useMutation({
    mutationKey: ["updateFireMutation"],
    mutationFn: updateTodo,

    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ["todos", userId] });

      const previousTodos = queryClient.getQueryData(["todos", userId]);

      queryClient.setQueryData(["todos", userId], (old) => {
        if (!old) return old;

        return old.map((todo) =>
          todo.id === updates.todoId ? { ...todo, ...updates.updates } : todo
        );
      });

      return { previousTodos };
    },

    onError: (error, updates, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos", userId], context.previousTodos);
      }
      console.error("Update error:", error);
    },

    onSuccess: () => {
      console.log("Todo updated successfully!");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", userId] });
    },
  });
};

export const useFirebaseDeleteMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.uid;

  return useMutation({
    mutationKey: ["deleteFireMutation"],
    mutationFn: deleteTodo,

    onMutate: async (todoId) => {
      await queryClient.cancelQueries({ queryKey: ["todos", userId] });

      const previousTodos = queryClient.getQueryData(["todos", userId]);

      queryClient.setQueryData(["todos", userId], (old) => {
        if (!old) return old;

        return old.filter((todo) => todo.id !== todoId);
      });

      return { previousTodos };
    },

    onError: (error, todoId, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos", userId], context.previousTodos);
      }
      toast.error("Something was wrong");
      console.error("Delete error:", error);
    },

    onSuccess: () => {
      toast.success("Todo deleted successfully!");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", userId] });
    },
  });
};
