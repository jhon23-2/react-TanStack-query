import { useQuery } from "@tanstack/react-query";
import { getAllTodo, getTodosByUserId } from "../api/fireService";
import { useAuth } from "../context/context";

// this get all todos into database
export const useGetAllFirebase = () => {
  return useQuery({
    queryKey: ["todos"],
    queryFn: getAllTodo,
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
    cacheTime: 1000 * 60 * 5, // 5 minutes
  });
};

export function useGetAllFirebaseByUserId() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["todos", user?.uid],
    queryFn: () => getTodosByUserId(user.uid),
    enabled: !!user?.uid,
    retry: false,
  });
}
