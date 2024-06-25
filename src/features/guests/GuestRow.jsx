import { HiPencil } from "react-icons/hi2";
import styled from "styled-components";

import Menus from "../../ui/Menus.jsx";
import Modal from "../../ui/Modal.jsx";
import Table from "../../ui/Table.jsx";
import CreateGuestForm from "./CreateGuestForm.jsx";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Name = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Email = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const NormalColumn = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

function GuestRow({ guest }) {
  const {
    id: guestID,
    fullName,
    email,
    nationalID,
    nationality,
    phone,
  } = guest;

  // function handleDuplicate() {
  //   createCabin({
  //     name: `Copy of ${name}`,
  //     maxCapacity,
  //     regularPrice,
  //     discount,
  //     image,
  //     description,
  //   });
  // }

  return (
    <Table.Row>
      <Name>{fullName}</Name>
      <Email>{email}</Email>
      <NormalColumn>{nationalID}</NormalColumn>
      <NormalColumn>{nationality}</NormalColumn>
      <NormalColumn>{phone}</NormalColumn>

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={guestID} />
            <Menus.List id={guestID}>
              {/* <Menus.Button
                icon={<HiSquare2Stack />}
                onClick={handleDuplicate}
                disabled={isCreating}
              >
                Duplicate
              </Menus.Button> */}

              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit">
              <CreateGuestForm guestToEdit={guest} />
            </Modal.Window>
          </Menus.Menu>
        </Modal>

        {/* <EditCabin cabin={cabin} /> */}
      </div>
    </Table.Row>
  );
}

export default GuestRow;
