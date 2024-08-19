import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import styled from "styled-components";

import ConfirmDelete from "../../ui/ConfirmDelete.jsx";
import Menus from "../../ui/Menus.jsx";
import Modal from "../../ui/Modal.jsx";
import Table from "../../ui/Table.jsx";
import { formatCurrency } from "../../utils/helpers.js";
import CreateRestaurantForm from "./CreateRestaurantForm";
import { useCreateRestaurant } from "./useCreateRestaurant.js";
import { useDeleteRestaurant } from "./useDeleteRestaurant.js";

// const TableRow = styled.div`
//   display: grid;
//   grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
//   column-gap: 2.4rem;
//   align-items: center;
//   padding: 1.4rem 2.4rem;

//   &:not(:last-child) {
//     border-bottom: 1px solid var(--color-grey-100);
//   }
// `;

const Img = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  /* transform: scale(1.5) translateX(-7px); */
`;

const Restaurant = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

function RestaurantRow({ restaurant }) {
  const { isDeleting, deleteRestaurant } = useDeleteRestaurant();
  const { isCreating, createRestaurant } = useCreateRestaurant();

  const { id: restaurantId, name, theme, image, isClosed } = restaurant;

  return (
    <Table.Row>
      <Img src={image} />
      <Restaurant>{name}</Restaurant>
      <div>{theme}</div>
      <div>{isClosed ? <span>Closed</span> : <span>Open</span>}</div>

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={restaurantId} />
            <Menus.List id={restaurantId}>
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />} disabled={isCreating}>
                  Edit
                </Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />} disabled={isCreating}>
                  Delete
                </Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit">
              <CreateRestaurantForm restaurantToEdit={restaurant} />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="restaurants"
                disabled={isDeleting}
                onConfirm={() => deleteRestaurant(restaurantId)}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>

        {/* <EditRestaurant cabin={cabin} /> */}
      </div>
    </Table.Row>
  );
}

export default RestaurantRow;
