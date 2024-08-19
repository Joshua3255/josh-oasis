import Button from "../../ui/Button";
import CreateRestaurantForm from "./CreateRestaurantForm";
import Modal from "../../ui/Modal";

function AddRestaurant() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="Restaurant-form">
          <Button>Add new Restaurant</Button>
        </Modal.Open>
        <Modal.Window name="Restaurant-form">
          <CreateRestaurantForm />
        </Modal.Window>

        {/* <Modal.Open opens="table">
        <Button>Show table</Button>
      </Modal.Open>
      <Modal.Window name="table">
        <RestaurantTable />
      </Modal.Window> */}
      </Modal>
    </div>
  );
}

// function AddRestaurant() {
//   const [isOpenModal, setIsOpenModal] = useState(false);

//   return (
//     <div>
//       <Button onClick={() => setIsOpenModal((show) => !show)}>
//         Add new Restaurant
//       </Button>
//       {isOpenModal && (
//         <Modal onClose={() => setIsOpenModal(false)}>
//           <CreateRestaurantForm onCloseModal={() => setIsOpenModal(false)} />
//         </Modal>
//       )}
//     </div>
//   );
// }

export default AddRestaurant;
