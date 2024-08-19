import AddRestaurant from "../features/restaurants/AddRestaurant";
import RestaurantsTable from "../features/restaurants/RestaurantsTable";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Restaurants() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All restaurants</Heading>
        <AddRestaurant />
      </Row>
      <Row>
        <RestaurantsTable />
      </Row>
    </>
  );
}

export default Restaurants;
