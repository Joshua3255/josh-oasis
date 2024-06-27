import supabase from "./supabase";

export async function getGuests() {
  let { data, error } = await supabase.from("guests").select("*");

  if (error) {
    console.log("Cabins could not be loader");
    throw new Error("Cabins could not be loader");
  }

  return data;
}

export async function createEditGuest(newGuest, id) {
  [newGuest.nationality, newGuest.countryFlag] =
    newGuest.nationalityWithFlagImage.split("%");
  delete newGuest.nationalityWithFlagImage;
  // newGuest.nationality = newGuest.nationalityWithFlagImage.split("%").at(0);
  // newGuest.countryFlag = newGuest.nationalityWithFlagImage.split("%").at(1);

  let query = supabase.from("guests");

  if (!id) query = query.insert([{ ...newGuest }]);

  if (id)
    query = query
      .update([{ ...newGuest }])
      .eq("id", id)
      .select();

  const { data, error } = await query.select().single();

  if (error) {
    console.log(error);
    throw new Error("Guest could not be created or updated");
  }

  return data;
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag"
    );
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

// export async function deleteCabin(id) {
//   const { data, error } = await supabase.from("cabins").delete().eq("id", id);

//   if (error) {
//     console.error(error);
//     throw new Error("Cabin could not be deleted");
//   }

//   return data;
// }

// export async function createEditCabin(newCabin, id) {
//   console.log("a1", newCabin, id);
//   //https://hynwatxcksdzrrwbkitu.supabase.co/storage/v1/object/public/cabin-images/cabin-002.jpg

//   const hasImagePath = typeof newCabin.image === "string";

//   //const hasImagePath = newCabin.image.startsWith(supabaseUrl);
//   const imageName = `${Math.random()}-${newCabin.image.name}`.replace("/", "");
//   const imagePath = hasImagePath
//     ? newCabin.image
//     : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

//   //1. Create cabin
//   let query = supabase.from("cabins");

//   //A) Create
//   if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

//   //B) Edit
//   if (id)
//     query = query
//       .update({ ...newCabin, image: imagePath })
//       .eq("id", id)
//       .select();

//   const { data, error } = await query.select().single();

//   if (error) {
//     console.error(error);
//     throw new Error("Cabin could not be created");
//   }
//   //2. Upload image
//   if (hasImagePath) return data;

//   const { error: storageError } = await supabase.storage
//     .from("cabin-images")
//     .upload(imageName, newCabin.image);

//   //3. Delete cabin if there was an error uploading image
//   if (storageError) {
//     await supabase.from("cabins").delete().eq("id", data.id);
//     console.log(storageError);
//     throw new Error(
//       "Cabin image could not be uploaded and the cabin was not created."
//     );
//   }

//   return data;
// }
