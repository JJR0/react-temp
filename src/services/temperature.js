import axios from 'axios'
const baseUrl = '/api/temperature'

let token = null

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

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const changeSettings = async (newValue) => {
  const response = await axios.post(baseUrl, newValue)
  console.log(response.data)
  return response.data
}

export default { getTemp, getTempDate, getTempNow, changeSettings, setToken }