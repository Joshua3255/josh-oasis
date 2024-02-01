import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useEditBooking() {
  const queryClient = useQueryClient();

  const { mutate: editBooking, isLoading: isEditing } = useMutation({
    mutationFn: ({ newBookingData, id }) =>
      createEditBooking(newBookingData, id),
    onSuccess: () => {
      toast.success("Booking successfully edited");
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { editBooking, isEditing };
}
