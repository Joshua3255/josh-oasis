import "react-datepicker/dist/react-datepicker.css";

import { DevTool } from "@hookform/devtools";
import { differenceInCalendarDays } from "date-fns";
import { useReducer, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import styled from "styled-components";

import Button from "../../ui/Button";
import Checkbox from "../../ui/Checkbox";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import { formatCurrency } from "../../utils/helpers";
import { useCabins } from "../cabins/useCabins";
import { useSettings } from "../settings/useSettings";
import { useCreateBooking } from "./useCreateBooking";
import { useEditBooking } from "./useEditBooking";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

const initialState = {
  selectedCabin: "",
  cabinPrice: 0,
  startDate: "",
  endDate: "",
  numNights: 0,
  numGuests: null,
  hasBreakfast: false,
  guestId: null,
};

function reducer(state, action) {
  // console.log("action", action);

  // const numDays = (state.startDate && state.endDate)
  switch (action.type) {
    case "setCabin":
      const cabinPrice =
        action.payload.value.regularPrice - action.payload.value.discount;
      return { ...state, selectedCabin: action.payload, cabinPrice };
    case "changeCabinPrice":
      return { ...state, cabinPrice: action.payload };
    case "setGuestId":
      return { ...state, guestId: action.payload };
    case "setStartDate":
      return { ...state, startDate: action.payload };
    case "setEndDate":
      return { ...state, endDate: action.payload };
    case "setNumGuests":
      //console.log("action",action);
      return { ...state, numGuests: action.payload };
    case "setNumNights":
      //console.log("action",action);
      return { ...state, numNights: action.payload };
    case "setHasBreakfast":
      return { ...state, hasBreakfast: !state.hasBreakfast };
    default:
      throw new Error("Action Unknown");
  }
}

function CreateBookingForm({ bookingToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = bookingToEdit;

  const { isCreating, createBooking } = useCreateBooking();
  const { isEditing, editBooking } = useEditBooking();
  const { isLoading: isLoadingCabins, cabins = [], error } = useCabins();
  const { isLoading: isLoadingSettings, settings } = useSettings();

  const isEditSession = Boolean(editId);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState,
    control,
    watch,
  } = useForm({
    defaultValues: isEditSession
      ? editValues
      : {
          numNights: 0,
          numGuests: "",
        },
  });

  const cabinsDropdownlist = cabins?.map((cabin) => {
    return { value: cabin, label: cabin.name };
  });

  //console.log("selectedCabin", selectedCabin);

  const [
    {
      selectedCabin,
      cabinPrice,
      startDate,
      endDate,
      numGuests,
      hasBreakfast,
      guestId,
      // numNights,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const {
    breakfastPrice,
    maxBookingLength,
    minBookingLength,
    maxGuestsPerBooking,
  } = settings ?? {};

  // const [numNights, numGuests] = watch(["numNights", "numGuests"]);
  // console.log("a1", numNights, numGuests);

  const { id: cabinId, regularPrice, discount } = selectedCabin.value ?? {};

  const numNights = 2;
  const optionalBreakfastPrice = breakfastPrice * numGuests * numNights;
  const extrasPrice = hasBreakfast ? optionalBreakfastPrice : 0;
  const totalPrice = cabinId && numNights * cabinPrice + extrasPrice;
  // console.log("recalculated", optionalBreakfastPrice, extrasPrice, totalPrice);

  const { errors } = formState;
  const isWorking = isCreating || isEditing;

  function onSubmit(data) {
    console.log("data", data);
    return;
    if (isEditSession)
      editBooking(
        { newBookingData: { ...data }, id: editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      createBooking(
        { ...data },
        {
          onSuccess: (data) => {
            // console.log("bb", data);
            reset();
            onCloseModal?.();
          },
        }
      );
  }

  function onError(errors) {
    console.log(errors);
  }

  function handleCabinChange(selectedOption) {
    dispatch({ type: "setCabin", payload: selectedOption });
  }

  function setNumNights(toDate, fromDate) {
    const numOfDays =
      toDate && fromDate ? differenceInCalendarDays(toDate, fromDate) : 0;
    // console.log("numOfDays", numOfDays);
    dispatch({ type: "setNumNights", payload: numOfDays });
    //setValue("numNights", numOfDays);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Cabin Id" error={errors?.cabinId?.message}>
        <Controller
          name="cabinId"
          control={control}
          render={({ field }) => (
            <Select
              options={cabinsDropdownlist}
              onChange={(val) => {
                handleCabinChange(val);
                field.onChange(val.value);
              }}
              defaultValue={selectedCabin}
            />
          )}
          rules={{ required: "This field is required" }}
        />
      </FormRow>
      {/* 
      <FormRow label="Cabin Id" error={errors?.cabinId?.message}>
        <Input
          type="text"
          id="cabinId"
          disabled={isWorking}
          {...register("cabinId", {
            required: "This field is required",
          })}
        />
      </FormRow> */}

      <FormRow label="Guest Id" error={errors?.guestId?.message}>
        <Input
          type="text"
          id="guestId"
          disabled={isWorking}
          {...register("guestId", {
            required: "This field is required",
            onChange: (e) =>
              dispatch({ type: "setGuestId", payload: e.target.value }),
          })}
        />
      </FormRow>

      <FormRow label="Start Date" error={errors?.startDate?.message}>
        <Controller
          id="startDate"
          control={control}
          name="startDate"
          render={({ field }) => (
            <DatePicker
              id="startDate"
              placeholderText="Select start date"
              onChange={(date) => {
                dispatch({ type: "setStartDate", payload: date });
                setNumNights(getValues("endDate"), date);
                field.onChange(date);
              }}
              selected={startDate}
            />
          )}
        />
      </FormRow>

      <FormRow label="End Date" error={errors?.endDate?.message}>
        <Controller
          id="endDate"
          control={control}
          name="endDate"
          render={({ field }) => (
            <DatePicker
              id="endDate"
              placeholderText="Select end date"
              onChange={(date) => {
                dispatch({ type: "setEndDate", payload: date });
                setNumNights(date, getValues("startDate"));
                field.onChange(date);
              }}
              selected={endDate}
            />
          )}
        />
      </FormRow>

      {/* <FormRow label="End Date" error={errors?.endDate?.message}>
        <DatePicker
          id="endDate"
          selected={endDate}
          onChange={(date) => dispatch({ type: "setEndDate", payload: date })}
          onKeyDown={(e) => {
            e.preventDefault();
          }}
        />
      </FormRow> */}

      <FormRow label="Number of Nights" error={errors?.numNights?.message}>
        <Input
          type="text"
          id="numNights"
          // disabled={true}
          value={numNights}
          {...register("numNights", {
            // min: {
            //   value: minBookingLength,
            //   message: `The minimum number of nights must be ${minBookingLength}.`,
            // },
            // max: {
            //   value: maxBookingLength,
            //   message: `The maximum number of nights must be ${maxBookingLength}.`,
            // },
            // onChange: (e) =>
            //   dispatch({ type: "setNumNights", payload: e.target.value }),
          })}
        />
      </FormRow>

      <FormRow label="Number of Guests" error={errors?.numGuests?.message}>
        <Input
          type="text"
          id="numGuests"
          Value={numGuests}
          disabled={isWorking}
          {...register("numGuests", {
            required: "This field is required",
            min: {
              value: 1,
              message: "The minimum number of guests must be 1.",
            },
            max: {
              value: settings?.maxGuestsPerBooking,
              message: `The maximum number of guests must be ${settings?.maxGuestsPerBooking}.`,
            },
            onChange: (e) =>
              dispatch({ type: "setNumGuests", payload: e.target.value }),
          })}
        />
      </FormRow>

      <FormRow label="Cabin Price" error={errors?.cabinPrice?.message}>
        {/* const cabinPrice = cabinId && regularPrice - discount; */}
        <Input
          type="text"
          id="cabinPrice"
          value={cabinPrice}
          disabled={isWorking}
          {...register("cabinPrice", {
            required: "This field is required",
            onChange: (e) =>
              dispatch({ type: "changeCabinPrice", payload: e.target.value }),
          })}
        />
      </FormRow>

      <Box>
        <Checkbox
          checked={hasBreakfast}
          onChange={() => dispatch({ type: "setHasBreakfast" })}
          id="breakfast"
        >
          Want to add breakfast for {formatCurrency(optionalBreakfastPrice)}?
        </Checkbox>
      </Box>

      <FormRow label="Extras Price" error={errors?.extrasPrice?.message}>
        <Input
          type="text"
          id="extrasPrice"
          value={extrasPrice}
          disabled={true}
          {...register("extrasPrice")}
        />
      </FormRow>

      <FormRow label="Total Price" error={errors?.totalPrice?.message}>
        <Input
          type="text"
          id="totalPrice"
          disabled={true}
          defaultValue={totalPrice}
          {...register("totalPrice")}
        />
      </FormRow>

      <FormRow label="Observations" error={errors?.observations?.message}>
        <Textarea
          type="number"
          id="observations"
          disabled={isWorking}
          defaultValue=""
          {...register("observations")}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit booking" : "Create new booking"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
