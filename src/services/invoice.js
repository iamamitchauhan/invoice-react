import axios from "axios"
import { HOST_URL } from "../shared/constants"

class Invoice {
  url = "invoice";

  constructor(url = "invoice") {
    this.url = url
  }

  fetchInvoice = async (payload) => {
    try {
      const { data, status } = await axios.post(`${HOST_URL}/${this.url}`, payload);

      if (status === 200) {
        return data
      }

    } catch (error) {
      console.error('fetchInvoice error =>', error);
      throw error
    }
  }
}

export default Invoice 