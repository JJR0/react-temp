import axios from 'axios'
const baseUrl = '/api/temperature'

const getTemp = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export default { getTemp }