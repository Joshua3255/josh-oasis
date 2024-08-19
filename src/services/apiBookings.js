import { PAGE_SIZE } from "../utils/constants";
import { getToday } from "../utils/helpers";
import supabase from "./supabase";

export async function getBookings({ filter, sortBy, page }) {
  let query = supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests,status, totalPrice, cabins(name), guests(fullName, email)",
      { count: "exact" }
    );

  if (filter) query = query[filter.method || "eq"](filter.field, filter.value);

  //Sort
  //if (sortBy !== null) query.order(sortBy.field, sortBy.value);
  //console.log("sortBy", sortBy);
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.log(error);
    throw new Error("Bookings could not be loader");
  }

  return { data, count };
}
export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*), extraFees(*, restaurants(name))")
    .eq("id", id)
    .single();

  if (error) {
    console.error("tt", error);
    throw new Error("Booking not found");
  }

  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
//data: ISOString
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    // .select('*')
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function checkOutApi(id, confirmExtraFeesPaid, obj) {
  if (!confirmExtraFeesPaid) {
    const { data, error } = await supabase
      .from("bookings")
      .select("isExtraFeesPaid")
      .eq("id", id)
      .single();

    if (!data.isExtraFeesPaid) {
      throw new Error(
        "There are some extra charged fees. Please pay it on the booking detail page before checking out."
      );
    }
  }

  obj.isExtraFeesPaid = true;

  return await updateBooking(id, obj);
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}

export async function createEditBooking(newBooking, id) {
  let query = supabase.from("bookings");

  if (!id) query = query.insert([{ ...newBooking }]);

  if (id)
    query = query
      .update({ ...newBooking })
      .eq("id", id)
      .select();

  const { data, error } = await query.select().single();

  if (error) {
    console.log(error);
    throw new Error("Booking could not be created or updated");
  }

  return data;
}

export async function addExtraFee(newExtraFee) {
  // 1) insert to ExtarFees table
  const { data, error } = await supabase
    .from("extraFees")
    .insert({ ...newExtraFee });

  if (error) {
    console.log(error);
    throw new Error("Extra fee could not be added");
  }

  // 2) update booking table extra
  const { data: currentData } = await supabase
    .from("bookings")
    .select("totalExtraFees, totalPrice")
    .eq("id", newExtraFee.bookingId)
    .single();

  const { data: data2, error: error2 } = await supabase
    .from("bookings")
    .update({
      totalExtraFees:
        currentData.totalExtraFees + Number(newExtraFee.chargedPrice),
      totalPrice: currentData.totalPrice + Number(newExtraFee.chargedPrice),
      isExtraFeesPaid: false,
    })
    // .rpc("increment", { e })
    .eq("id", newExtraFee.bookingId)
    .select();

  if (error2) {
    console.log(error2);
    throw new Error("Extra fee could not be added");
  }

  return data2;
}
