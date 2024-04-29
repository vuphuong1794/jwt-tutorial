import { useEffect } from "react";
import "./home.css";
import { getAllUser } from "../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();
  const userList = useSelector((state) => state.user.users?.allUsers);
  //DUMMY DATA
  const userData = [
    {
      username: "anhduy1202",
    },
    {
      username: "kelly1234",
    },
    {
      username: "danny5678",
    },
    {
      username: "kenny1122",
    },
    {
      username: "jack1234",
    },
    {
      username: "loi12022",
    },
    {
      username: "nhinhi2009",
    },
    {
      username: "kellynguyen1122",
    },
  ];
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
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
              <div className="delete-user"> Delete </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default HomePage;
