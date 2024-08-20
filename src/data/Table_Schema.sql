CREATE TABLE public.bookings (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    "startDate" timestamp without time zone,
    "endDate" timestamp without time zone,
    "numNights" smallint,
    "numGuests" smallint,
    "cabinPrice" real,
    "extrasPrice" real,
    "totalPrice" real,
    status text,
    "hasBreakfast" boolean,
    "isPaid" boolean,
    observations text,
    "cabinId" bigint,
    "guestId" bigint,
    "cabinPricePerDay" real,
    "checkInTime" timestamp without time zone,
    "checkOutTime" timestamp without time zone,
    "totalExtraFees" double precision DEFAULT '0'::double precision,
    "isExtraFeesPaid" boolean DEFAULT true
);


CREATE TABLE public.cabins (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text,
    "maxCapacity" smallint,
    "regularPrice" smallint,
    discount smallint,
    description text,
    image text
);

CREATE TABLE public.contacts (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    "fullName" text,
    email text,
    subject text,
    message text
);



CREATE TABLE public."extraFees" (
    id bigint NOT NULL,
    "restaurantId" bigint,
    "numGuests" smallint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    "chargedPrice" real,
    "bookingId" bigint
);



CREATE TABLE public.guests (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    "fullName" text,
    email text,
    "nationalID" text,
    nationality text,
    "countryFlag" text,
    phone text,
    password text,
    image text
);

CREATE TABLE public.restaurants (
    id bigint NOT NULL,
    name text,
    theme text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    "isClosed" boolean DEFAULT false,
    image text
);


CREATE TABLE public.settings (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    "minBookingLength" smallint,
    "maxBookingLength" smallint,
    "maxGuestsPerBooking" smallint,
    "breakfastPrice" real
);
