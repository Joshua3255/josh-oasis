import supabase, { supabaseUrl } from "./supabase";

export async function getRestaurants() {
  let { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("isClosed", false);

  if (error) {
    console.log(error);
    throw new Error("Restaurants could not be loaded");
  }

  return data;
}

export async function deleteRestaurant(id) {
  const { data, error } = await supabase
    .from("restaurants")
    // .delete()
    // .eq("id", id);
    .update({ isClosed: true })
    .eq("id", id);
  // .select();
  // .single();

  //.delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Restaurant could not be deleted");
  }

  return data;
}

export async function createEditRestaurant(newRestaurant, id) {
  //https://hynwatxcksdzrrwbkitu.supabase.co/storage/v1/object/public/Restaurant-images/Restaurant-002.jpg
  //https://hynwatxcksdzrrwbkitu.supabase.co/storage/v1/object/public/restaurant-images/LaDolceVita.jpg?t=2024-08-15T20%3A06%3A26.351Z

  const hasImagePath = typeof newRestaurant.image === "string";

  //const hasImagePath = newRestaurant.image.startsWith(supabaseUrl);
  const imageName = `${Math.random()}-${newRestaurant.image.name}`.replaceAll(
    "/",
    ""
  );
  const imagePath = hasImagePath
    ? newRestaurant.image
    : `${supabaseUrl}/storage/v1/object/public/restaurant-images/${imageName}`;

  //1. Create Restaurant
  let query = supabase.from("restaurants");

  //A) Create
  if (!id) query = query.insert([{ ...newRestaurant, image: imagePath }]);

  //B) Edit
  if (id)
    query = query
      .update({ ...newRestaurant, image: imagePath })
      .eq("id", id)
      .select();

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Restaurant could not be created");
  }
  //2. Upload image
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("restaurant-images")
    .upload(imageName, newRestaurant.image);

  //3. Delete Restaurant if there was an error uploading image
  if (storageError) {
    await supabase.from("restaurants").delete().eq("id", data.id);
    console.log(storageError);
    throw new Error(
      "Restaurant image could not be uploaded and the Restaurant was not created."
    );
  }

  return data;
}
