import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInFail, signInSuccess, signInStart } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
export default function SignIn() {
  const [formData, setFormData] = useState({});

  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("api/auth/signin", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      alert(data.message);
      if (data._id) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
      setFormData({ email: "", password: "" });
    } catch (error) {
      console.error("Error:", error);
      dispatch(signInFail(error));
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
          id="email"
          value={formData.email}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
          value={formData.password}
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-500">Sign Up</span>
        </Link>
      </div>
    </div>
  );
}
