import axios from 'axios'
import configs from '../../configs/configs'

const apiInstance = axios.create({
  baseURL: configs.serverConfig?.APIDomain ?? '',
  headers: {
    'content-type': 'application/json',
    'Ocp-Apim-Subscription-Key':
      configs.serverConfig?.ApimSubscriptionKey ?? '',
  },
})
const coreInstance = axios.create({
  baseURL: configs.serverConfig?.CoreService ?? '',
  headers: {
    'content-type': 'application/json',
  },
})
const getAPIData = async (method, url, postData, header) => {
  const response = await apiInstance({
    method,
    url,
    data: postData,
  })
  return response
}
const getCoreData = async (method, url, postData, header) => {
  const response = await coreInstance({
    method,
    url,
    data: postData,
    headers: header,
  })

  return response
}

export { getCoreData }
export default getAPIData
