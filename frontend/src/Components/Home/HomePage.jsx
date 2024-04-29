import { useEffect } from "react";
import "./home.css";
import { deleteUser, getAllUser } from "../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.user.users?.allUsers);
  const msg = useSelector((state) => state.user?.msg);
  
  
  const dispatch = useDispatch();

  const handleDelete = (id)=>{
    deleteUser(user?.accessToken, dispatch, id)
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user?.accessToken) {
      getAllUser(user?.accessToken, dispatch);
    }
  }, []);

  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div className="home-role">{`Your role is: ${user?.admin ? `Admin` : `User` }`}</div>
      <div className="home-userlist">
        {userList?.map((user) => {
          return (
            <div className="user-container">
              <div className="home-user">{user.username}</div>
              <div className="delete-user" onClick={()=>handleDelete(user._id)}> {" "}
                Delete{" "} </div>
            </div>
          );
        })}
      </div>
      <div className="errorMsg">{msg}</div>
    </main>
  );
};

export default HomePage;
