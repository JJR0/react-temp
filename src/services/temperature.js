import axios from 'axios'
const baseUrl = '/api/temperature'

const getTemp = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getTempDate = (date) => {
  const request = axios.get(`${baseUrl}/${date}`)
  return request.then(response => response.data)
}

const getTempNow = () => {
  const request = axios.get(baseUrl+'/now')
  return request.then(response => response.data)
}

export default { getTemp, getTempDate, getTempNow }