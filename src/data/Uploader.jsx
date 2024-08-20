import { addHours, isFuture, isPast, isToday } from "date-fns";
import { useState } from "react";

import supabase from "../services/supabase";
import Button from "../ui/Button";
import { subtractDates } from "../utils/helpers";
import { bookings } from "./data-bookings";
import { cabins } from "./data-cabins";
import { guests } from "./data-guests";

// const originalSettings = {
//   minBookingLength: 3,
//   maxBookingLength: 30,
//   maxGuestsPerBooking: 10,
//   breakfastPrice: 15,
// };

async function deleteGuests() {
  const { error } = await supabase.from("guests").delete().gt("id", 0);
  if (error) console.log(error.message);
}

async function deleteCabins() {
  const { error } = await supabase.from("cabins").delete().gt("id", 0);
  if (error) console.log(error.message);
}

async function deleteBookings() {
  const { error } = await supabase.from("bookings").delete().gt("id", 0);
  if (error) console.log(error.message);
}

async function deleteExtraFees() {
  const { error } = await supabase.from("extraFees").delete().gt("id", 0);
  if (error) console.log(error.message);
}

async function createGuests() {
  const { error } = await supabase.from("guests").insert(guests);
  if (error) console.log(error.message);
}

async function createCabins() {
  const { error } = await supabase.from("cabins").insert(cabins);
  if (error) console.log(error.message);
}

async function createBookings() {
  // Bookings need a guestId and a cabinId. We can't tell Supabase IDs for each object, it will calculate them on its own. So it might be different for different people, especially after multiple uploads. Therefore, we need to first get all guestIds and cabinIds, and then replace the original IDs in the booking data with the actual ones from the DB
  const { data: guestsIds } = await supabase
    .from("guests")
    .select("id")
    .order("id");
  const allGuestIds = guestsIds.map((guest) => guest.id);
  const { data: cabinsIds } = await supabase
    .from("cabins")
    .select("id")
    .order("id");
  const allCabinIds = cabinsIds.map((cabin) => cabin.id);

  const finalBookings = bookings.map((booking) => {
    // Here relying on the order of cabins, as they don't have and ID yet
    const cabin = cabins.at(booking.cabinId - 1);
    const numNights = subtractDates(booking.endDate, booking.startDate);
    const cabinPricePerDay = cabin.regularPrice - cabin.discount;
    const cabinPrice = numNights * cabinPricePerDay;
    const extrasPrice = booking.hasBreakfast
      ? numNights * 15 * booking.numGuests
      : 0; // hardcoded breakfast price
    const totalPrice = cabinPrice + extrasPrice;

    let status, checkInTime, checkOutTime;
    if (
      isPast(new Date(booking.endDate)) &&
      !isToday(new Date(booking.endDate))
    ) {
      status = "checked-out";
      checkInTime = addHours(new Date(booking.startDate), 12);
      checkOutTime = addHours(new Date(booking.endDate), 10);
    }

    if (
      isFuture(new Date(booking.startDate)) ||
      isToday(new Date(booking.startDate))
    )
      status = "unconfirmed";
    if (
      (isFuture(new Date(booking.endDate)) ||
        isToday(new Date(booking.endDate))) &&
      isPast(new Date(booking.startDate)) &&
      !isToday(new Date(booking.startDate))
    ) {
      status = "checked-in";
      checkInTime = addHours(new Date(booking.startDate), 10);
    }

    return {
      ...booking,
      numNights,
      cabinPrice,
      cabinPricePerDay,
      extrasPrice,
      totalPrice,
      guestId: allGuestIds.at(booking.guestId - 1),
      cabinId: allCabinIds.at(booking.cabinId - 1),
      status,
      checkInTime,
      checkOutTime,
    };
  });

  console.log(finalBookings);

  const { data: insertedBookings, error } = await supabase
    .from("bookings")
    .insert(finalBookings)
    .select();
  if (error) console.log(error.message);

  // retereive Restaurants list
  const { data: restaurants, error: restaurantsError } = await supabase
    .from("restaurants")
    .select();
  if (restaurantsError) console.log(restaurantsError.message);

  console.log("++++++", insertedBookings);

  let extraFees = [];

  const checkOutBookings = insertedBookings.filter(
    (booking) => booking.status === "checked-out"
  );

  checkOutBookings.forEach((booking) => {
    let newItem = {
      numGuests: booking.numGuests,
      bookingId: booking.id,
      chargedPrice: booking.numGuests * 25,
      restaurantId: restaurants[0].id,
      created_at: addHours(new Date(booking.startDate), 15),
    };
    extraFees.push(newItem);

    if (booking.numNights > 1) {
      newItem = {
        numGuests: booking.numGuests,
        bookingId: booking.id,
        chargedPrice: booking.numGuests * 18,
        restaurantId: restaurants[1].id,
        created_at: addHours(new Date(booking.endDate), -3),
      };
      extraFees.push(newItem);
    }
  });

  console.log(extraFees);

  // totalPrice, totalExtraFees

  const { data: insertedExtraFees, error: extraError } = await supabase
    .from("extraFees")
    .insert(extraFees)
    .select();
  if (extraError) console.log("ttt", extraError);

  console.log(insertedExtraFees);

  let extraFeesApply = [];
  checkOutBookings.forEach((booking) => {
    const totalExtraFees = booking.numGuests * 18 + booking.numGuests * 25;
    const newItem = {
      id: booking.id,
      totalPrice: booking.totalPrice + totalExtraFees,
      totalExtraFees,
    };
    extraFeesApply.push(newItem);
  });

  console.log("extraFeesApply", extraFeesApply);

  extraFeesApply.forEach(async (update) => {
    const { id, totalPrice, totalExtraFees } = update;
    const { data, error } = await supabase
      .from("bookings")
      .update({ totalPrice, totalExtraFees })
      .eq("id", id);

    if (error) {
      console.log(`Error updating record with ID ${id}`, error);
    }
  });
}

function Uploader() {
  const [isLoading, setIsLoading] = useState(false);

  async function uploadAll() {
    setIsLoading(true);
    // Bookings need to be deleted FIRST
    await deleteBookings();
    await deleteGuests();
    await deleteCabins();

    // Bookings need to be created LAST
    await createGuests();
    await createCabins();
    await createBookings();

    setIsLoading(false);
  }

  async function uploadBookings() {
    setIsLoading(true);
    await deleteExtraFees();
    await deleteBookings();
    await createBookings();
    setIsLoading(false);
  }

  return (
    <div
      style={{
        marginTop: "auto",
        backgroundColor: "#e0e7ff",
        padding: "8px",
        borderRadius: "5px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <h3>SAMPLE DATA</h3>

      {/* <Button onClick={uploadAll} disabled={isLoading}>
        Upload ALL
      </Button> */}

      <Button onClick={uploadBookings} disabled={isLoading}>
        Regenerate bookings ONLY
      </Button>
    </div>
  );
}

export default Uploader;
