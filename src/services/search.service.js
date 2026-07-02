 
import api from "@/api/axios";
 
export const searchDocuments = async (query, page = 1, perPage = 10) => {
  try {
    const response = await api.get(`api/v1/search/`, {
      params: {
        q: query,
        page: page,
        per_page: perPage
      }
    })
    return response.data
  } catch (error) {
    console.error('Error en la búsqueda:', error)
    throw error
  }
}

export const searchDocumentsWithFilters = async (query, filters = {}) => {
  try {
    const response = await axios.post(`api/v1/search/`, {
      query: query,
      filters: filters
    })
    return response.data
  } catch (error) {
    console.error('Error en la búsqueda:', error)
    throw error
  }
}            