import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import { useCreateRestaurant } from "./useCreateRestaurant";
import { useEditRestaurant } from "./useEditRestaurant";

function CreateRestaurantForm({ restaurantToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = restaurantToEdit;

  const { isCreating, createRestaurant } = useCreateRestaurant();
  const { editRestaurant, isEditing } = useEditRestaurant();

  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const { errors } = formState;
  const isWorking = isCreating || isEditing;

  function onSubmit(data) {
    const image = typeof data.image === "string" ? data.image : data.image[0];
    if (isEditSession)
      editRestaurant(
        { newRestaurantData: { ...data, image }, id: editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      createRestaurant(
        { ...data, image: image },
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

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Restaurant name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Theme description" error={errors?.theme?.message}>
        <Textarea
          type="text"
          id="theme"
          disabled={isWorking}
          defaultValue=""
          {...register("theme", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Restaurant photo">
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: isEditSession ? false : "This field is required",
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
        <Button disabled={isWorking}>
          {isEditSession ? "Edit Restaurant" : "Create new Restaurant"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateRestaurantForm;
