import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteRestaurant as deleteRestaurantApi } from "../../services/apiRestaurants";

export function useDeleteRestaurant() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteRestaurant } = useMutation({
    // mutationFn: (id) => deleteRestaurant(id),
    mutationFn: deleteRestaurantApi,
    onSuccess: () => {
      toast.success("Restaurant successfully deleted");
      queryClient.invalidateQueries({
        queryKey: ["restaurants"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteRestaurant };
}
