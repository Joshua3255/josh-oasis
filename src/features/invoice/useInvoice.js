import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { useParams } from "react-router-dom";

import { getInvoice } from "../../services/apiBookings";

export function useInvoice() {
  const { bookingId } = useParams();

  const {
    isLoading,
    data: invoiceData,
    error,
  } = useQuery({
    queryKey: ["invoice", bookingId],
    queryFn: () => getInvoice(bookingId),
    retry: false,
  });

  return { isLoading, invoiceData, error };
}
