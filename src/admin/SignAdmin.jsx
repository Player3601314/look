import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";

const SignAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { dispatch } = useContext(AuthContext)

  const navigate = useNavigate()

  const userData = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    if (userData.email === "admin@gmail.com") {
      navigate("/admin")
    }
    else if (userData.email === "test@gmail.com") {
      navigate("/order")
    }
  }, [])

  const handleSignIn = (e) => {
    e.preventDefault();
    try {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          if (email === "admin@gmail.com") {
            dispatch({ type: "LOGIN", payload: user })
            navigate("/admin")
          }
          else if (email === "test@gmail.com") {
            dispatch({ type: "ORDER", payload: user })
            navigate("/order")
          }
        })
        .catch((error) => {
          console.log(error.message);
          alert("Kechirasiz email yoki parolni to'gri kiriting")
        });
    } catch (error) {
      alert("Kechirasiz email yoki parolni to'gri kiriting")
    }
  };

  return (
    <div className="w-[100%] h-[100vh] flex justify-around items-center">
      <form className="w-[30%] h-[350px] sm:w-[80%] bg-[#c00a27] items-center text-[#fff] p-[20px]">
        <div>
          <h2 className="text-[38px] font-bold text-[yellow] text-center">Admin</h2>
        </div>
        <div className="w-[100%] mx-auto items-center flex flex-col">
          <label className="cursor-pointer" htmlFor="email">
            Email:
          </label>
          <input
            className="w-[80%] px-[12px] text-black py-[4px] rounded-[4px] bg-yellow-500 focus:bg-[yellow]"
            id="email"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <br />
          <label className="cursor-pointer" htmlFor="password">
            Password:
          </label>
          <input
            className="w-[80%] px-[12px] text-black py-[4px] rounded-[4px] bg-yellow-500 focus:bg-[yellow]"
            id="password"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div className="w-[100%] h-[80px] flex justify-around flex-col text-center my-[20px]">
          {/* <Link className="w-[170px] m-auto text-[red] " to={"/admin/change-password"}>
            Parol esdan chiqdimi ?
          </Link> */}
          <button
            onClick={handleSignIn}
            className="w-[auto] mx-auto text-[red] text-[20px] font-bold py-[4px] px-[12px] bg-yellow-500 hover:bg-[yellow] rounded-[6px]"
          >
            Tekshirish
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignAdmin;
