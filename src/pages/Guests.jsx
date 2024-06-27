import AddCabin from "../features/cabins/AddCabin";
import CabinTable from "../features/cabins/CabinTable";
import CabinTableOperations from "../features/cabins/CabinTableOperations";
import AddGuest from "../features/guests/AddGuest";
import GuestTable from "../features/guests/GuestTable";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Cabins() {
  // useEffect(function () {
  //   getCabins().then((data) => console.log(data));
  // }, []);

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Guests</Heading>
        {/* <CabinTableOperations /> */}
      </Row>
      <Row>
        <GuestTable />
        {/* //TODO create AddGuest */}
        <AddGuest />
      </Row>
    </>
  );
}

export default Cabins;
