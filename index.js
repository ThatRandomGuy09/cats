const fs = require("fs");
const axios = require("axios");

const baseURL = "https://catfact.ninja/breeds";

function writeToTextFile(data) {
  fs.writeFileSync("catBreedsResponse.txt", JSON.stringify(data, null, 2));
}

function groupBreedsByCountry(breeds) {
  const groupedBreeds = {};

  breeds.forEach((breed) => {
    if (!groupedBreeds[breed.origin]) {
      groupedBreeds[breed.origin] = [];
    }
    groupedBreeds[breed.origin].push({
      breed: breed.breed,
      origin: breed.origin,
      coat: breed.coat,
      pattern: breed.pattern,
    });
  });

  return groupedBreeds;
}

async function getAllBreedsData() {
  try {
    const response = await axios.get(baseURL);
    const totalPages = response.data.last_page;

    let allBreeds = [];

    for (let page = 1; page <= totalPages; page++) {
      const pageResponse = await axios.get(`${baseURL}?page=${page}`);
      allBreeds = allBreeds.concat(pageResponse.data.data);
    }

    return allBreeds;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

async function main() {
  try {
    const initialResponse = await axios.get(baseURL);
    writeToTextFile(initialResponse.data);

    console.log("Number of pages:", initialResponse.data.last_page);

    const allBreedsData = await getAllBreedsData();

    const groupedBreeds = groupBreedsByCountry(allBreedsData);

    console.log(groupedBreeds);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
