import axios from "axios";

const baseUrl = "http://localhost:3001/api/persons";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  console.log(response);
  return response.data;
};

const create = async (newPerson) => {
  const response = await axios.post(baseUrl, newPerson);
  console.log(response);
  return response.data;
};

const update = async (id, updatedPerson) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedPerson);
  console.log(response);
  return response.data;
};

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  console.log(response);
  return response.data;
};

export default { getAll, create, update, remove };
