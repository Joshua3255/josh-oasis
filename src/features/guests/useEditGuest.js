import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createEditGuest as createEditGuestApi } from "../../services/apiGuests";

export function useEditGuest() {
  const queryClient = useQueryClient();

  const { mutate: editGuest, isLoading: isCreating } = useMutation({
    mutationFn: ({ newGuestData, id }) => createEditGuestApi(newGuestData, id),
    onSuccess: () => {
      toast.success("A Guest successfully edited");
      queryClient.invalidateQueries({
        queryKey: ["guests"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isCreating, editGuest };
}
