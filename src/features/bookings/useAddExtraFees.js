import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { addExtraFee as addExtraFeeApi } from "../../services/apiBookings";

export function useAddExtraFee() {
  const queryClient = useQueryClient();

  const { mutate: addExtraFee, isLoading: isAdding } = useMutation({
    mutationFn: ({ newExtraFee }) => addExtraFeeApi(newExtraFee),
    onSuccess: () => {
      toast.success("Extra fees successfully added");
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { addExtraFee, isAdding };
}
