import axios from "axios"
import { ICategory } from "../store/category"
import { IResource } from "../store/resources"
export interface Api {
  categories(): Promise<ICategory>
  resources(): Promise<IResource>
}
export class Hub implements Api {
  async resources() {
    try {
      return axios.get(`http://localhost:3000/resources.json`)
    } catch (err) {
      return err.response
    }
  }

  async categories() {
    try {
      return axios.get(`http://localhost:3000/categories.json`)
    } catch (err) {
      return err.response
    }
  }
}
