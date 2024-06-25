import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { getGuests } from "../../services/apiGuests";
import Empty from "../../ui/Empty";
import Menus from "../../ui/Menus";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import GuestRow from "./GuestRow";
// import GuestRow from "./GuestRow.jsx";

function GuestTable() {
  //we can use useCabins custom hook
  const { isLoading, data: guests } = useQuery({
    queryKey: ["guests"],
    queryFn: getGuests,
  });
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  if (!guests.length) return <Empty resourceName="guests" />;

  const filterValue = searchParams.get("discount") || "all";

  let filteredguests;
  // if (filterValue === "all") filteredguests = guests;
  // if (filterValue === "no-discount")
  //   filteredguests = guests.filter((cabin) => cabin.discount === 0);
  // if (filterValue === "with-discount")
  //   filteredguests = guests.filter((cabin) => cabin.discount > 0);
  filteredguests = guests;

  // 2) Sort
  const sortBy = searchParams.get("sortBy") || "name-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  const sortedGuests = filteredguests.sort(
    (a, b) => (a[field] - b[field]) * modifier
  );
  return (
    <Menus>
      <Table columns="1.8fr 2.3fr 1fr 1fr 1fr 0.5fr">
        <Table.Header>
          <div>Full Name</div>
          <div>Email</div>
          <div>National ID</div>
          <div>Nationality</div>
          <div>Phone</div>
        </Table.Header>
        <Table.Body
          data={sortedGuests}
          render={(guest) => <GuestRow key={guest.id} guest={guest} />}
        />
      </Table>
    </Menus>
  );
}

export default GuestTable;
