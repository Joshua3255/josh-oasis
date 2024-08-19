import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import toast from "react-hot-toast";

import { checkOutApi } from "../../services/apiBookings";

export function useCheckout() {
  const queryClient = useQueryClient();

  const { mutate: checkout, isLoading: isCheckingout } = useMutation({
    mutationFn: ({ bookingId, confirmExtraFeesPaid }) =>
      checkOutApi(bookingId, confirmExtraFeesPaid, {
        status: "checked-out",
        checkOutTime: format(Date.now(), "yyyy-MM-dd HH:mm:ss.SSS"),
      }),
    onSuccess: (data) => {
      //console.log("data", data);
      toast.success(`Booking #${data.id} successfully checked out`);
      queryClient.invalidateQueries({ active: true });
    },

    onError: (err) => {
      // toast.error("There was an error while checking out");
      // after adding extra fees, I show this detail message to let our staff know if there are some charge need to be paaid by geusts.
      toast.error(err.message);
    },
  });

  return { checkout, isCheckingout };
}
