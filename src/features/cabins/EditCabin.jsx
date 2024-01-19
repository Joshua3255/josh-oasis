import Button from "../../ui/Button";
import CreateCabinForm from "./CreateCabinForm";
import Modal from "../../ui/Modal";
import CabinTable from "./CabinTable";
import { HiPencil } from "react-icons/hi2";

function EditCabin({ cabin }) {
  // <button onClick={() => setshowForm((show) => !show)}>
  //           <HiPencil />
  //         </button>
  return (
    <Modal>
      <Modal.Open opens="cabin-form">
        <button>
          <HiPencil />
        </button>
      </Modal.Open>
      <Modal.Window name="cabin-form">
        <CreateCabinForm cabinToEdit={cabin} />
      </Modal.Window>
    </Modal>
  );
}

export default EditCabin;
