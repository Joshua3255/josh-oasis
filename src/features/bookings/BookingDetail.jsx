import { useState } from "react";
import { HiArrowUpOnSquare } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useMoveBack } from "../../hooks/useMoveBack";
import Button from "../../ui/Button";
import ButtonGroup from "../../ui/ButtonGroup";
import ButtonText from "../../ui/ButtonText";
import Checkbox from "../../ui/Checkbox";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Empty from "../../ui/Empty";
import Heading from "../../ui/Heading";
import Modal from "../../ui/Modal";
import Row from "../../ui/Row";
import Spinner from "../../ui/Spinner";
import Tag from "../../ui/Tag";
import { BOOKINGSTATUS_TO_TAGNAME } from "../../utils/constants";
import { formatCurrency } from "../../utils/helpers";
import { useCheckout } from "../check-in-out/useCheckout";
import AddExtraFeesForm from "./AddExtraFeesForm";
import BookingDataBox from "./BookingDataBox";
import CreateBookingForm from "./CreateBookingForm";
import { useBooking } from "./useBooking";
import { useDeleteBooking } from "./useDeleteBooking";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function BookingDetail() {
  const { booking, isLoading } = useBooking();
  const { checkout, isCheckingout } = useCheckout();
  const { deleteBooking, isDeleting } = useDeleteBooking();
  const moveBack = useMoveBack();
  const navigate = useNavigate();

  const [confirmExtraFeesPaid, setConfirmExtraFeesPaid] = useState(false);

  if (isLoading) return <Spinner />;
  if (!booking) return <Empty resourceName="booking" />;

  const { status, id: bookingId } = booking;

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{bookingId}</Heading>
          <Tag type={BOOKINGSTATUS_TO_TAGNAME[status]}>
            {status.replace("-", " ")}
          </Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {!booking.isExtraFeesPaid > 0 && (
        <Box>
          <Checkbox
            checked={confirmExtraFeesPaid}
            disabled={confirmExtraFeesPaid}
            onChange={() => setConfirmExtraFeesPaid((confirm) => !confirm)}
            id="confirm"
          >
            I confirm that {booking.guests.fullName} has paid the additional
            charges ({formatCurrency(booking.totalExtraFees)}){" "}
            {/* {!addBreakfast
              ? formatCurrency(totalPrice)
              : `${formatCurrency(
                  optionalBreakfastPrice + totalPrice
                )} (${formatCurrency(totalPrice)} + ${formatCurrency(
                  optionalBreakfastPrice
                )}) `} */}
          </Checkbox>
        </Box>
      )}

      <ButtonGroup>
        {status === "unconfirmed" && (
          <Button
            variation="secondary"
            onClick={() => navigate(`/checkin/${bookingId}`)}
          >
            Check in
          </Button>
        )}

        {status === "checked-in" && (
          <>
            <Button
              icon={<HiArrowUpOnSquare />}
              onClick={() => checkout({ bookingId, confirmExtraFeesPaid })}
              disabled={
                isCheckingout || booking.isExtraFeesPaid == confirmExtraFeesPaid
              }
            >
              Check out
            </Button>
          </>
        )}

        {status === "checked-out" && (
          <>
            <Button
              icon={<HiArrowUpOnSquare />}
              onClick={() => {
                window.open(
                  `/invoice/${bookingId}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              See Invoice
            </Button>
            <Button
              icon={<HiArrowUpOnSquare />}
              onClick={() => {
                window.open(
                  `/invoice/${bookingId}`,
                  "_self",
                  "noopener,noreferrer"
                );
              }}
            >
              See Invoice self
            </Button>
          </>
        )}
        <Modal>
          {status === "unconfirmed" && (
            <>
              <Modal.Open opens="booking-form">
                <Button>Edit booking</Button>
              </Modal.Open>
              <Modal.Window name="booking-form" size="large">
                <CreateBookingForm bookingToEdit={booking} />
              </Modal.Window>
            </>
          )}

          {status !== "checked-out" && (
            <>
              <Modal.Open opens="addExtraFees">
                <Button variation="secondary">Add Extra fees</Button>
              </Modal.Open>
              <Modal.Open opens="delete">
                <Button variation="danger">Delete booking</Button>
              </Modal.Open>
              <Modal.Window name="delete">
                <ConfirmDelete
                  resourceName="booking"
                  disabled={isDeleting}
                  onConfirm={() => {
                    deleteBooking(bookingId, { onSettled: () => navigate(-1) });
                  }}
                />
              </Modal.Window>
              <Modal.Window name="addExtraFees">
                <AddExtraFeesForm bookingId={bookingId}></AddExtraFeesForm>
              </Modal.Window>
            </>
          )}
        </Modal>

        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
