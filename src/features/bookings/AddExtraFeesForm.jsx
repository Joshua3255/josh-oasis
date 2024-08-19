import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

import { getRestaurants } from "../../services/apiRestaurants";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import Textarea from "../../ui/Textarea";
import { useAddExtraFee } from "./useAddExtraFees";

// import { useCreateRestaurant } from "./useCreateRestaurant";
// import { useEditRestaurant } from "./useEditRestaurant";

function AddExtraFeesForm({ bookingId, onCloseModal }) {
  // const { id: editId, ...editValues } = restaurantToEdit;

  // const { isCreating, createRestaurant } = useCreateRestaurant();
  // const { editRestaurant, isEditing } = useEditRestaurant();

  // const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, control, formState } =
    useForm({
      defaultValues: {},
    });

  const { addExtraFee, isAdding } = useAddExtraFee();

  const { isLoading, data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
  });

  if (isLoading) return <Spinner />;

  const restaurantList = restaurants.map((resturant) => {
    return { value: resturant.id, label: resturant.name };
  });

  const isWorking = false;

  const { errors } = formState;

  const numGuestOptions = Array.from({ length: 20 }, (v, i) => ({
    value: i + 1,
    label: `${i + 1}`,
  }));

  // const isWorking = isCreating || isEditing;

  function onSubmit(data) {
    addExtraFee(
      { newExtraFee: data },
      {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      }
    );
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="booking Id" error={errors?.bookingId?.message}>
        <Input
          type="text"
          id="bookingId"
          defaultValue={bookingId}
          disabled={isWorking}
          readOnly
          {...register("bookingId", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Restaurant" error={errors?.restaurantId?.message}>
        <Controller
          name="restaurantId"
          control={control}
          render={({ field }) => (
            <Select
              options={restaurantList}
              onChange={(val) => {
                //handleGuestChange(val.value);
                field.onChange(val.value);
              }}
            />
          )}
          rules={{ required: "This field is required" }}
        />
      </FormRow>

      <FormRow label="Number of Guests" error={errors?.numGuests?.message}>
        <Controller
          name="numGuests"
          control={control}
          render={({ field }) => (
            <Select
              options={numGuestOptions}
              onChange={(val) => {
                //handleGuestChange(val.value);
                field.onChange(val.value);
              }}
              // placeholder="Select number of Guests"
              // defaultValue={guestsDropdownlist?.filter(
              //   (guest) => guest.value === booking.guests?.id
              // )}
            />
          )}
          rules={{ required: "This field is required" }}
        />
      </FormRow>

      <FormRow label="Charged Price ($)" error={errors?.chargedPrice?.message}>
        <Input
          type="number"
          id="chargedPrice"
          disabled={isWorking}
          {...register("chargedPrice", {
            required: "This field is required",
            min: {
              value: 1,
              message: "The minimum price is $1.",
            },
          })}
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
        <Button disabled={isWorking}>Charge Extra Fees</Button>
      </FormRow>
    </Form>
  );
}

export default AddExtraFeesForm;
