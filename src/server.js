"http://localhost:4000/data";
import axios from 'axios'


  export const fetchData = async () => {
    const response = await axios.get("http://localhost:4000/data");
    return response.data;
  };


 
export const addData = async (addData) => {
  const response = await axios.post("http://localhost:4000/data", addData);
  return response.data;
};

