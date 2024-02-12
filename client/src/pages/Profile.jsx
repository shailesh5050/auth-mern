import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { authFirebase } from "../firebase";
import { updateUserSuccess, deleteUserSuccess } from "../redux/userSlice";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [imagePercetage, setImagePercetage] = useState(0);
  useEffect(() => {
    if (image) {
      handleImageUpload(image);
    }
  }, [image]);
  async function handleImageUpload(image) {
    const storage = getStorage(authFirebase);
    const fileName = new Date().getTime() + "-" + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setImagePercetage(Math.round(progress));
      },
      (error) => {
        console.log(error);
      },
      // download url
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData((prev) => ({ ...prev, profilePicture: downloadURL }));
      }
    );
  }
  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      dispatch(updateUserSuccess(data));
      alert(data.message);
    } catch (error) {
      alert(error.message);
    }
  }

  async function deleteUser() {
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      // dispatch(updateUserSuccess(data));
      alert(data.message);
      dispatch(deleteUserSuccess());
      navigate("/sign-in");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt="profile"
          className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm self-center">
          {imageError ? (
            <span className="text-red-700">
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : (
            ""
          )}
        </p>
        <p className="text-sm self-center text-green-300">
          {imagePercetage > 0 && "Image Uploaded "}
          {imagePercetage > 0 && imagePercetage + " % "}
        </p>
        <input
          defaultValue={currentUser.username}
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser.email}
          type="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={deleteUser} className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error && "Something went wrong!"}</p>
      <p className="text-green-700 mt-5">User is updated successfully!</p>
    </div>
  );
}
