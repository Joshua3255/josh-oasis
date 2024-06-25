import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createEditGuest as createEditGuestApi } from "../../services/apiGuests";

export function useCreateGuest() {
  const queryClient = useQueryClient();

  const { mutate: createGuest, isLoading: isCreating } = useMutation({
    mutationFn: createEditGuestApi,
    onSuccess: () => {
      toast.success("A Guest successfully created");
      queryClient.invalidateQueries({
        queryKey: ["guests"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isCreating, createGuest };
}
