import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createEditRestaurant } from "../../services/apiRestaurants";

export function useEditRestaurant() {
  const queryClient = useQueryClient();

  const { mutate: editRestaurant, isLoading: isEditing } = useMutation({
    mutationFn: ({ newRestaurantData, id }) =>
      createEditRestaurant(newRestaurantData, id),
    onSuccess: () => {
      toast.success("Restaurant successfully edited");
      queryClient.invalidateQueries({
        queryKey: ["restaurants"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { editRestaurant, isEditing };
}
