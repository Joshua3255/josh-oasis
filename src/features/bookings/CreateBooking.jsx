import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateBookingForm from "./CreateBookingForm";

function CreateBooking() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="booking-form">
          <Button>Create new booking</Button>
        </Modal.Open>
        <Modal.Window name="booking-form" size="large">
          <CreateBookingForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default CreateBooking;
