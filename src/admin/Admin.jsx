import { useContext, useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { firestorage, firestore } from "../firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ImExit } from "react-icons/im";
import { AuthContext } from "../context/AuthContext";

const Admin = () => {
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false)
  const [inpName, setInpName] = useState("");
  const [inpPrice, setInpPrice] = useState("");
  const [inpImg, setInpImg] = useState("");
  const [type, setType] = useState("appetizers")
  const [docId, setDocId] = useState(null);
  const { dispatch } = useContext(AuthContext)
  const navigate = useNavigate()

  const cardCollection = collection(firestore, "cards");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user.email === "") {
      console.log(user.email);
      navigate("/")
    }
    const unsubscribe = onSnapshot(cardCollection, (snapShot) => {
      let data = [];
      snapShot.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setCards(data);
    },
      (error) => {
        console.log(error);
      });

    return () => unsubscribe();
  }, []);

  const handleNameChange = (e) => {
    setInpName(e.target.value);
  };

  const handlePriceChange = (e) => {
    setInpPrice(e.target.value);
  };

  const handleUpload = (e) => {
    const img = e.target.files[0];
    const imgRef = ref(firestorage, `cards/${img.name}`);

    uploadBytes(imgRef, img).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        setInpImg(downloadURL);
      });
    }).catch((error) => {
      console.error("Error uploading image: ", error);
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!docId) {
      console.error("No document ID specified for update.");
      return;
    }

    const cardDocRef = doc(firestore, "cards", docId);

    setShowModal(true);

    try {
      await updateDoc(cardDocRef, {
        name: inpName,
        img: inpImg,
        price: inpPrice,
        type: type,
      });

      setShowModal(false);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleShowModal = (name, price, type, id) => {
    let root = document.getElementsByTagName("html")[0];
    root.style.overflowY = showModal ? "auto" : "hidden";

    setInpName(name);
    setInpPrice(price);
    setType(type)
    setDocId(id);
    setShowModal(true);
  };

  const handleDeleteModal = (id) => {
    setDocId(id)
    setDeleteModal(true)
  }

  const handleDelteDoc = async () => {
    await deleteDoc(doc(firestore, "cards", docId));
    setDeleteModal(false)
  }

  const handleLogOut = () => {
    const data = localStorage.setItem("user", null)
    dispatch({ type: "LOGOUT", payload: data })
  }

  return (
    <>
      <div className="w-[100%] h-[60px] flex justify-between px-[80px] items-center">
        <ImExit className="w-auto h-[50%] text-red-500 hover:text-[red] cursor-pointer" onClick={handleLogOut} />
        <Link className="h-[100%] px-[14px] rounded-[50px] flex justify-between items-center bg-yellow-400 hover:bg-[yellow] text-orange-500 hover:text-[#ffae00]" to={"/admin/create"}>
          <h2 className="text-[20px]">Yangi Menu qushish</h2>
          <FaPlus className="w-auto h-[40%]" />
        </Link>
      </div>
      <div id="appetizers" className="w-[90%] grid grid-cols-6 gap-[20px] m-auto mt-[40px]">
        {cards.map((data) => (
          <div className="w-[100%] h-[350px] bg-[#fff] rounded-[10px] p-[16px] flex flex-col" key={data.id}>
            <img src={data.img} className="w-[150px] h-[150px] mx-auto object-cover" alt="" />
            <h3 className="mt-[20px] font-medium text-[#c00a27]">{data.name}</h3>
            <p className="mt-[10px] text-[#309b42]">{data.price} {"so'm"}</p>
            <p className="text-yellow-500">Tur: {data.type}</p>
            <button
              onClick={() => handleShowModal(data.name, data.price, data.type, data.id)}
              className="bg-[#f6f8f9] hover:bg-[#ffae00] py-[8px] mt-auto rounded-[8px] duration-200">Update</button>
            <button
              onClick={() => handleDeleteModal(data.id)}
              className="bg-[#f6f8f9] hover:bg-[#c00a27] py-[8px] mt-auto rounded-[8px] duration-200">Delete</button>
          </div>
        ))}
      </div>
      {showModal && (
        <>
          <div onClick={() => setShowModal(!showModal)} className="w-[100%] h-[100vh] backdrop-blur-[10px] absolute top-0 left-0 z-50"></div>
          <div className="w-[100%] h-[100vh] flex justify-around items-center flex-col absolute top-0 left-0 z-50">
            <div className="w-[30%] h-[80vh] bg-[#c00a27] flex justify-around m-auto">
              <form className="w-auto h-[80vh] justify-evenly m-auto flex flex-col">
                <div className="flex items-center justify-between">
                  <h2 className="text-[38px] font-bold text-[#ffae00]">Yangilash</h2>
                  <IoClose size={40} onClick={() => setShowModal(!showModal)} className="text-[#ffae00] hover:text-[red] cursor-pointer" />
                </div>
                <div className="w-[300px]">
                  <label className="text-[#fff] font-semibold cursor-pointer py-[4px]" htmlFor="name">Nomi:</label><br />
                  <input id="name" className="text-[#fff] w-[100%] py-[4px] rounded-[6px] bg-orange-500 border-[4px] focus:bg-[#ffae00] px-[12px] placeholder:text-[rgba(255,255,255,.5)]" type="text" placeholder="Lavash" onChange={handleNameChange} value={inpName} />
                </div>
                <div className="w-[300px]">
                  <label className="text-[#fff] font-semibold cursor-pointer py-[4px]" htmlFor="price">Narxi:</label><br />
                  <input id="price" className="text-[#fff] w-[100%] py-[4px] rounded-[6px] bg-orange-500 border-[4px] focus:bg-[#ffae00] px-[12px] placeholder:text-[rgba(255,255,255,.5)]" type="text" placeholder="17,000" onChange={handlePriceChange} value={inpPrice} />
                </div>
                <div className="w-[300px]">
                  <label className="text-[#fff] font-semibold cursor-pointer py-[4px]" htmlFor="price">Tur:</label><br />
                  <select
                    id="type"
                    className="w-[100%] row-start-1 col-start-1 bg-orange-500 py-[6px] px-[12px] focus:bg-[#ffae00] text-[rgba(255,255,255,.5)] focus:text-[#fff]"
                    defaultValue={type}
                    onChange={(e) => { setType(e.target.value), console.log(type) }}
                  >
                    <option
                      value="appetizers">
                      APPETIZERS
                    </option>
                    <option
                      value="burger">
                      BURGER
                    </option>
                    <option
                      value="chicken">
                      CHICKEN
                    </option>
                    <option
                      value="desert">
                      DESERTS
                    </option>
                    <option
                      value="drinks">
                      DRINKS
                    </option>
                    <option
                      value="kids">
                      KIDS
                    </option>
                    <option
                      value="pizza">
                      PIZZA
                    </option>
                    <option
                      value="spinner">
                      SPINNER
                    </option>
                    <option
                      value="salads">
                      SALADS
                    </option>
                    <option
                      value="combo">
                      COMBO
                    </option>
                    <option
                      value="sauce">
                      SAUCE
                    </option>
                  </select>
                </div>
                <div className="w-[300px] bg-orange-500 hover:bg-[#ffae00] rounded-[6px] cursor-pointer flex items-center">
                  <label className="w-[100%] text-center cursor-pointer text-[#fff] py-[6px] m-auto font-bold rounded-[6px]" htmlFor="img">Rasmni tanlang</label>
                  <input id="img" className="hidden" type="file" onChange={(e) => handleUpload(e)} />
                </div>
                <button className="bg-orange-500 hover:bg-[#ffae00] py-[6px] text-[18px] font-semibold rounded-[6px] text-[#fff]" onClick={handleUpdate}>Update</button>
              </form>
            </div>
          </div>
        </>
      )}
      {deleteModal && (
        <>
          <div onClick={() => setShowModal(!showModal)} className="w-[100%] h-[100vh] backdrop-blur-[10px] absolute top-0 left-0 z-50"></div>
          <div className="w-[100%] h-[100vh] flex justify-around items-center flex-col absolute top-0 left-0 z-50">
            <div className="w-[60%] h-[30vh] bg-[#c00a27] flex flex-col items-center justify-around m-auto">
              <h2 className="text-[30px] text-center text-[#ff0000] font-bold p-[20px]">{"Ushbu menuni o'chiriga ishonchingiz komilmi !"}</h2>
              <div className="w-[40%] flex justify-between">
                <button
                  onClick={() => setDeleteModal(!deleteModal)}
                  className="bg-[yellow] py-[8px] px-[16px] rounded-[8px]">Bekor qilish</button>
                <button
                  onClick={handleDelteDoc}
                  className="bg-[red] py-[8px] px-[16px] rounded-[8px]">{"O'chirish"}</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Admin;
