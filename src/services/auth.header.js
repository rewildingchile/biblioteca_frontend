export default function AuthHeader(){

    let user = JSON.parse(localStorage.getItem('user'));
    if (user && user.passwordToken){
        //return { Authoritation:'Bearer'+user.passwordToken}
         return {'x-access-token': user.passwordToken}
    }else{
        return {}
    }


}