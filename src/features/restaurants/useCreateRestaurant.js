import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createEditRestaurant } from "../../services/apiRestaurants";

export function useCreateRestaurant() {
  const queryClient = useQueryClient();

  const { mutate: createRestaurant, isLoading: isCreating } = useMutation({
    mutationFn: createEditRestaurant,
    onSuccess: () => {
      toast.success("New Restaurant successfully created");
      queryClient.invalidateQueries({
        queryKey: ["restaurants"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { createRestaurant, isCreating };
}
