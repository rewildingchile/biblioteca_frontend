import axios from 'axios';
// const API_URL = 'http://localhost:8080/api/auth/'
const API_URL = 'json/loginoxytek.json'
class AuthService{
   async login(user){
        /*return axios.post(API_URL,{
            login:user.login,
            password: user.password
        })*/
        return axios.get(API_URL,{
            login:user.login,
            password: user.password
        })
        .then (response=>{
            if(response.data.payload.passwordToken)
            {
                localStorage.setItem('user',
                JSON.stringify(response.data.payload));
                 
            }
            return response.data;
        })
    }
    logout(){
        localStorage.removeItem('user');
    }
     
}
export default new AuthService();