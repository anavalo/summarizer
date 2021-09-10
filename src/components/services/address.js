import axios from "axios";

export const postAddress = async (address) => {
    const res = axios.post("/api/address", {
        address: `${address}`
    })
    return await res
}