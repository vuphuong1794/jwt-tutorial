import axios from "axios";
import { loginFailed, loginStart, loginSuccess, registerFailed, registerStart, registerSuccess } from "./authSlice";
import { deleteUserFailed, deleteUserStart, deleteUserSuccess, getUsersFailed, getUsersStart, getUsersSuccess } from "./userSlice";

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("http://localhost:8000/v1/auth/login", user, {
      withCredentials: true,
    });
    dispatch(loginSuccess(res.data));
    navigate("/");
  } catch (err) {
    dispatch(loginFailed());
  }
};

export const registerUser = async (user, dispatch, navigate)=>{
   dispatch(registerStart())
   try{
      await axios.post("http://localhost:8000/v1/auth/register", user, {withCredentials: true})
      dispatch(registerSuccess())
      navigate("/login")
   }catch(err){
      dispatch(registerFailed())
   }
}

export const getAllUser = async(accessToken, dispatch)=>{
  dispatch(getUsersStart())
  try{
    const res = await axios.get("http://localhost:8000/v1/users", {
      headers: {token: `Bearer ${accessToken}`}
    },{withCredentials: true})
    dispatch(getUsersSuccess(res.data))
  }catch(err){
    dispatch(getUsersFailed())
  }
}

export const deleteUser = async(accessToken, dispatch, id)=>{
  dispatch(deleteUserStart())
  try{
    const res = await axios.delete(`http://localhost:8000/v1/users/${id}`, {
      headers: {token: `Bearer ${accessToken}`}
    }, {withCredentials: true})
    dispatch(deleteUserSuccess(res.data))
  }catch(err){
    //console.log(err.response.data.message)
    dispatch(deleteUserFailed(err.response.data));
  }
}