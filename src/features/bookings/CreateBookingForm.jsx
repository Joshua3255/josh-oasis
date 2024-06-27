import "react-datepicker/dist/react-datepicker.css";

import { DevTool } from "@hookform/devtools";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import styled from "styled-components";

import Button from "../../ui/Button";
import Checkbox from "../../ui/Checkbox";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Heading from "../../ui/Heading";
import Input from "../../ui/Input";
import Modal from "../../ui/Modal";
import ModalOverwarpped from "../../ui/ModalOverwarpped";
import Row from "../../ui/Row";
import Tag from "../../ui/Tag";
import Textarea from "../../ui/Textarea";
import { BOOKINGSTATUS_TO_TAGNAME } from "../../utils/constants";
import { formatCurrency } from "../../utils/helpers";
import { useCabins } from "../cabins/useCabins";
import { useGuests } from "../guests/useGuests";
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

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

let renderCount = 0;

function CreateBookingForm({ bookingToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = bookingToEdit;

  const { isCreating, createBooking } = useCreateBooking();
  const { isEditing, editBooking } = useEditBooking();
  const { isLoading: isLoadingCabins, cabins = [], error } = useCabins();
  const { isLoading: isLoadingSettings, settings } = useSettings();
  const { isLoading: isLoadingGuests, guests } = useGuests();

  const isEditSession = Boolean(editId);

  const booking = isEditSession
    ? {
        ...editValues,
        startDate: parseISO(editValues.startDate),
        endDate: parseISO(editValues.endDate),
        // startDate: parse(editValues.startDate, "yyyy-MM-dd", new Date()),
        // endDate: parse(editValues.endDate, "yyyy-MM-dd", new Date()),
      }
    : {
        hasBreakfast: false,
        cabinId: "",
        cabinPricePerDay: "",
        cabinPrice: "",
        startDate: "",
        endDate: "",
        extrasPrice: "",
        guestId: "",
        numGuests: 0,
        numNights: 0,
        observations: "",
      };

  // const test = {
  //   ...editValues,
  //   startDate: "111",
  //   endDate: "222",
  //   numGuests: 30,
  //   endDate: parseISO(editValues.endDate),
  // };

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
    defaultValues: booking,
  });

  const cabinsDropdownlist = cabins?.map((cabin) => {
    return { value: cabin, label: cabin.name };
  });

  const guestsDropdownlist = guests?.map((guest) => {
    return { value: guest.id, label: `${guest.fullName} (${guest.email})` };
  });

  const {
    breakfastPrice,
    maxBookingLength,
    minBookingLength,
    maxGuestsPerBooking,
  } = settings ?? {};

  // const [numNights, numGuests] = watch(["numNights", "numGuests"]);
  // console.log("a1", numNights, numGuests);

  // console.log("renderCount", ++renderCount);
  useEffect(() => {
    // const subscription = watch((data) => {
    //         console.log("watchdata", data);
    // });

    // return () => {
    //   subscription.unsubscribe();
    // };

    const [numNights, numGuests, cabinPricePerDay, hasBreakfast] = watch([
      "numNights",
      "numGuests",
      "cabinPricePerDay",
      "hasBreakfast",
    ]);

    const extrasPrice = hasBreakfast
      ? numGuests * breakfastPrice * numNights
      : 0;
    const cabinPrice = numNights * cabinPricePerDay;
    const totalPrice = cabinPrice + extrasPrice;
    setValue("cabinPrice", cabinPrice);
    setValue("extrasPrice", extrasPrice);
    setValue("totalPrice", totalPrice);
  }, [
    watch(["numNights", "numGuests", "cabinPricePerDay", "hasBreakfast"]),
    watch,
    breakfastPrice,
    setValue,
  ]);

  const { errors } = formState;
  const isWorking = isCreating || isEditing;

  function onSubmit(data) {
    delete data.cabins;
    delete data.guests;
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
        { ...data, status: "unconfirmed", isPaid: false },
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
    const { id, regularPrice, discount } = selectedOption.value;
    setValue("cabinPricePerDay", regularPrice - discount);

    //dispatch({ type: "setCabin", payload: selectedOption });
  }

  function handleGuestChange(guestId) {
    // const { id, regularPrice, discount } = selectedOption.value;
    // setValue("cabinPricePerDay", regularPrice - discount);
    // console.log(selectedOption);
    //dispatch({ type: "setCabin", payload: selectedOption });
  }

  function setNumNights(endDate, startDate) {
    const numOfDays =
      endDate && startDate ? differenceInCalendarDays(endDate, startDate) : 0;

    setValue("startDate", startDate, {
      shouldValidate: startDate ? true : false,
    });
    setValue("endDate", endDate, { shouldValidate: endDate ? true : false });

    setValue("numNights", numOfDays);
  }

  console.log("booking", booking);

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">
            {isEditSession ? `Edit booking #${editId}` : "Create booking"}
          </Heading>
          <Tag type={BOOKINGSTATUS_TO_TAGNAME[booking.status]}>
            {booking.status?.replace("-", " ")}
          </Tag>
        </HeadingGroup>
      </Row>
      <Row>&nbsp;</Row>

      <Form
        onSubmit={handleSubmit(onSubmit, onError)}
        type={onCloseModal ? "modal" : "regular"}
      >
        <FormRow label="Cabin" error={errors?.cabinId?.message}>
          <Controller
            name="cabinId"
            control={control}
            render={({ field }) => (
              <Select
                options={cabinsDropdownlist}
                onChange={(val) => {
                  handleCabinChange(val);
                  field.onChange(val.value.id);
                }}
                defaultValue={cabinsDropdownlist.filter(
                  (cabin) => cabin.value.id === booking.cabinId
                )}

                // defaultValue={selectedCabin}
              />
            )}
            rules={{ required: "This field is required" }}
          />
        </FormRow>

        <FormRow label="Guest" error={errors?.guestId?.message}>
          <Controller
            name="guestId"
            control={control}
            render={({ field }) => (
              <Select
                options={guestsDropdownlist}
                onChange={(val) => {
                  //handleGuestChange(val.value);
                  field.onChange(val.value);
                }}
                defaultValue={guestsDropdownlist?.filter(
                  (guest) => guest.value === booking.guests?.id
                )}
              />
            )}
            rules={{ required: "This field is required" }}
          />
        </FormRow>

        <FormRow
          label="Booking Date"
          error={errors?.startDate?.message || errors?.endDate?.message}
        >
          <DatePicker
            id="bookingDate"
            placeholderText="Select booking date"
            onChange={(dates) => {
              const [start, end] = dates;

              setNumNights(end, start);
              //field.onChange(date);
            }}
            selected={watch("startDate")}
            wrapperClassName="datePickerForCreateBooking"
            startDate={watch("startDate")}
            endDate={watch("endDate")}
            autoComplete="off"
            selectsRange
          />

          <Input
            type="hidden"
            id="startDate"
            disabled={isWorking}
            {...register("startDate", {
              required: "Booking date field is required",
            })}
          />

          <Input
            type="hidden"
            id="endDate"
            disabled={isWorking}
            {...register("endDate", {
              required: "Booking date field is required",
            })}
          />
        </FormRow>

        {/* <FormRow label="Start Date" error={errors?.startDate?.message}>
        <Controller
          id="startDate"
          control={control}
          name="startDate"
          render={({ field }) => (
            <DatePicker
              id="startDate"
              placeholderText="Select start date"
              onChange={(date) => {
                setNumNights(getValues("endDate"), date);
                field.onChange(date);
              }}
              selected={field.value}
              wrapperClassName="datePickerForCreateBooking"
              startDate={field.value}
              endDate={watch("endDate")}
              autoComplete="off"
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
                setNumNights(date, getValues("startDate"));
                field.onChange(date);
              }}
              selected={field.value}
              wrapperClassName="datePickerForCreateBooking"
              startDate={watch("startDate")}
              endDate={field.value}
              minDate={watch("startDate")}
              autoComplete="off"
            />
          )}
        />
      </FormRow> */}

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
            disabled={true}
            {...register("numNights", {
              min: {
                value: minBookingLength,
                message: `The minimum number of nights is ${minBookingLength}.`,
              },
              max: {
                value: maxBookingLength,
                message: `The maximum number of nights is ${maxBookingLength}.`,
              },
              // onChange: (e) =>
              //   dispatch({ type: "setNumNights", payload: e.target.value }),
            })}
          />
        </FormRow>

        <FormRow label="Number of Guests" error={errors?.numGuests?.message}>
          <Input
            type="text"
            id="numGuests"
            disabled={isWorking}
            {...register("numGuests", {
              required: "This field is required",
              min: {
                value: 1,
                message: "The minimum number of guests is 1.",
              },
              max: {
                value: settings?.maxGuestsPerBooking,
                message: `The maximum number of guests is ${settings?.maxGuestsPerBooking}.`,
              },
            })}
          />
        </FormRow>

        <FormRow
          label="Cabin Price Per Day"
          error={errors?.cabinPricePerDay?.message}
        >
          {/* const cabinPricePerDay = cabinId && regularPrice - discount; */}
          <Input
            type="text"
            id="cabinPricePerDay"
            disabled={isWorking}
            {...register("cabinPricePerDay", {
              required: "This field is required",
            })}
          />

          <Input
            type="hidden"
            id="cabinPrice"
            disabled={true}
            {...register("cabinPrice")}
          />
        </FormRow>

        <Box>
          <Controller
            control={control}
            name="hasBreakfast"
            defaultValue={false}
            render={({ field: { onChange, value } }) => (
              <Checkbox
                checked={value}
                onChange={(e) => {
                  onChange(e);
                }}
                id="hsaBreakfast"
              >
                Want to add breakfast for{" "}
                {formatCurrency(
                  breakfastPrice * watch("numGuests") * watch("numNights")
                )}
                ?
              </Checkbox>
            )}
          />
        </Box>

        <FormRow label="Extras Price" error={errors?.extrasPrice?.message}>
          <Input
            type="text"
            id="extrasPrice"
            disabled={true}
            {...register("extrasPrice")}
          />
        </FormRow>

        <FormRow label="Total Price" error={errors?.totalPrice?.message}>
          <Input
            type="text"
            id="totalPrice"
            disabled={true}
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
          {isEditSession && (
            <ModalOverwarpped>
              <ModalOverwarpped.Open opens="delete2">
                <Button variation="danger">Delete booking</Button>
              </ModalOverwarpped.Open>
              <ModalOverwarpped.Window name="delete2">
                <ConfirmDelete
                  resourceName="booking"
                  // disabled={isDeleting}
                  onConfirm={() => {
                    console.log("deleteCOnfirm");
                    // deleteBooking(bookingId, { onSettled: () => navigate(-1) });
                  }}
                />
              </ModalOverwarpped.Window>
            </ModalOverwarpped>
          )}

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
          <DevTool control={control} />
        </FormRow>
      </Form>
    </>
  );
}

export default CreateBookingForm;
