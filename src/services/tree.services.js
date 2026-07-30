 
import api from "@/api/axios";
export const treeSubFolder = async (node) => {
  try {
    const r = await api.get(`drive/tree/node/${node.drive_file_id}/`)
    return r.data
  } catch (error) {
    console.error("error obteniendo arbol", error)
    throw error
  }
}


export const treeArea = async (area_id) => {
  try {
    const r = await api.get(`drive/tree/${area_id}/`)
    return r.data
  } catch (error) {
    console.error("error obteniendo arbol", error)
    throw error
  }
}