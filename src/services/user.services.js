import axios from 'axios';
import AuthHeader from './auth-header';
const API_URL ='http://localhost:8080/api/test';

class UserService {
    getUserBoard(){
            return axios.get(API_URL,{
                headers:AuthHeader
            })
    }
}
