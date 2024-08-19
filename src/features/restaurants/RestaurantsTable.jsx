import { useQuery } from "@tanstack/react-query";

import { getRestaurants } from "../../services/apiRestaurants";
import Empty from "../../ui/Empty";
import Menus from "../../ui/Menus";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import RestaurantRow from "./RestaurantRow";

function RestaurantsTable() {
  //we can use useCabins custom hook
  const { isLoading, data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
  });

  if (isLoading) return <Spinner />;

  if (!restaurants.length) return <Empty resourceName="Restaurants" />;

  return (
    <Menus>
      <Table columns="0.8fr 1fr 2fr 0.5fr 0.3fr">
        <Table.Header>
          <div></div>
          <div>Restaurant</div>
          <div>Theme</div>
          <div>Status</div>
        </Table.Header>
        <Table.Body
          data={restaurants}
          render={(restaurant) => (
            <RestaurantRow restaurant={restaurant} key={restaurant.id} />
          )}
        />
      </Table>
    </Menus>
  );
}

export default RestaurantsTable;
