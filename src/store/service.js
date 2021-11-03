import axios from "axios";

export const fetchBooks = async (search) => {
  const response = (
    await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${search}`)
  ).data;
  return response;
};
