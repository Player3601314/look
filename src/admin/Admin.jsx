import { Fragment, useContext, useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { firestorage, firestore } from "../firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import { ImExit } from "react-icons/im";
import { AuthContext } from "../context/AuthContext";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoClose, IoMenu } from "react-icons/io5";

const Admin = () => {
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false)
  const [sidebar, setSidebar] = useState(false)
  const [inpName, setInpName] = useState("");
  const [inpPrice, setInpPrice] = useState("");
  const [inpImg, setInpImg] = useState("");
  const [type, setType] = useState("appetizers")
  const [docId, setDocId] = useState(null);
  const { dispatch } = useContext(AuthContext)
  const navigate = useNavigate()

  const [sortConfig, setSortConfig] = useState({ field: 'all', direction: 'asc' });
  const cardCollection = collection(firestore, "cards");
  let root = document.getElementsByTagName("html")[0];
  console.log(cards);
  console.log(sortConfig);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.email === "") {
      console.log(user?.email);
      navigate("/");
    } else if (user.email === "test@gmail.com") {
      console.log(user.email);
      navigate("/order");
    }

    const unsubscribe = onSnapshot(cardCollection, (snapShot) => {
      let data = [];
      snapShot.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });

      data = sortCardsBy([...data]);

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
    const img = e.target.field[0];
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
    root.style.overflowY = showModal ? "auto" : "hidden";

    setInpName(name);
    setInpPrice(price);
    setType(type)
    setDocId(id);
    setShowModal(!showModal);
  };

  const handleDeleteModal = (id) => {
    root.style.overflowY = deleteModal ? "auto" : "hidden";

    setDocId(id)
    setDeleteModal(!deleteModal)
  }

  const handleDelteDoc = async () => {
    await deleteDoc(doc(firestore, "cards", docId));
    setDeleteModal(false)
  }

  const sortCardsBy = (data) => {
    const { field, direction } = sortConfig;

    setSidebar(false)

    return data.sort((a, b) => {
      let comparison = 0;
      if (a[field] > b[field]) {
        comparison = 1;
      } else if (a[field] < b[field]) {
        comparison = -1;
      }
      return direction === 'asc' ? comparison : comparison * -1;
    });
  };

  const handleSort = (field) => {
    const direction = field === sortConfig.field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ field, direction });

    const sortedData = sortCardsBy([...cards]);
    setCards(sortedData);
  };

  const handleLogOut = () => {
    const data = localStorage.setItem("user", null)
    root.style.removeProperty('overflow-y');
    dispatch({ type: "LOGOUT", payload: data })
  }

  const linkScroll = () => {
    root.style.overflowY = sidebar ? "auto" : "hidden"

    setSidebar(!sidebar)
  }

  return (
    <>
      <div className="w-[100%] h-[100vh] flex justify-between sm:flex-col">

        <div className="w-[100%] h-[80px] fixed top-0 left-0 items-center hidden sm:flex md:flex p-[20px] sm:px-[5px] md:px-[60px] justify-between bg-[#c00a27] z-10">
          <div className="w-[150px] h-[60px]">
            <img className="w-[100%] h-[100%]" src="http://loook.uz/assets/loook-logo-5055c421.svg" alt="" />
          </div>
          <div>
            <IoMenu
              onClick={linkScroll}
              size={30}
              color="#fff" />
          </div>
        </div>

        <div className="w-[25%] h-[100vh] lg:w-[30%] fixed top-0 left-0 bg-[#c00a27] flex flex-col justify-between py-[40px] px-[20px] text-center items-center sm:hidden md:hidden">
          <Link onClick={linkScroll} to={"/"} className="w-[200px] h-[60px] mx-auto">
            <img src="http://loook.uz/assets/loook-logo-5055c421.svg" alt="" />
          </Link>
          <div className="w-[100%] text-[35px] font-bold text-[orange]">
            <h2>Saralash</h2>
          </div>
          <Link onClick={linkScroll} to={"/admin/create"} className="w-[80%] text-[20px] font-bold text-[#fff] bg-[orange] px-[20px] py-[4px] rounded-[4px]">
            Yangi menu
          </Link>
          <div className="w-[80%] h-[45%] flex flex-col justify-evenly">
            <button
              onClick={() => handleSort('all')}
              className={`w-[100%] text-left rounded-[6px] ${sortConfig.field === "all" ? "bg-[white] text-[red] rounded-[4px]" : "text-[white] hover:bg-[rgba(255,255,255,.5)] duration-200"}`}>
              <div className="py-[4px] px-[20px] text-[20px] font-semibold">Hammasi</div>
            </button>

            <button
              onClick={() => handleSort('name')}
              className={`w-[100%] items-center rounded-[6px] ${sortConfig.field === "name" ? "bg-[white] text-[red] rounded-[4px]" : "text-[white] hover:bg-[rgba(255,255,255,.5)] duration-200"}`}>
              <div className="py-[4px] px-[20px] text-[20px] font-semibold flex justify-between">
                <p>Nomi</p>
                {sortConfig.field === "name" && sortConfig.direction === "asc" && (
                  <IoIosArrowUp color="#ff0000" size={30} className="ml-auto" />
                )}
                {sortConfig.field === "name" && sortConfig.direction === "desc" && (
                  <IoIosArrowDown color="#ff0000" size={30} />
                )}
              </div>
            </button>

            <button
              onClick={() => handleSort('price')}
              className={`w-[100%] items-center rounded-[6px] ${sortConfig.field === "price" ? "bg-[white] text-[red] rounded-[4px]" : "text-[white] hover:bg-[rgba(255,255,255,.5)] duration-200"}`}>
              <div className="py-[4px] px-[20px] text-[20px] font-semibold flex justify-between">
                <p>Narxi</p>
                {sortConfig.field === "price" && sortConfig.direction === "asc" && (
                  <IoIosArrowUp color="#ff0000" size={30} />
                )}
                {sortConfig.field === "price" && sortConfig.direction === "desc" && (
                  <IoIosArrowDown color="#ff0000" size={30} />
                )}
              </div>
            </button>

            <button
              onClick={() => handleSort('type')}
              className={`w-[100%] items-center rounded-[6px] ${sortConfig.field === "type" ? "bg-[white] text-[red] rounded-[4px]" : "text-[white] hover:bg-[rgba(255,255,255,.5)] duration-200"}`}>
              <div className="py-[4px] px-[20px] text-[20px] font-semibold flex justify-between">
                <p>Turi</p>
                {sortConfig.field === "type" && sortConfig.direction === "asc" && (
                  <IoIosArrowUp color="#ff0000" size={30} className="ml-auto" />
                )}
                {sortConfig.field === "type" && sortConfig.direction === "desc" && (
                  <IoIosArrowDown color="#ff0000" size={30} />
                )}
              </div>
            </button>

          </div>
          <div
            onClick={handleLogOut}
            className="w-[80%] h-auto mx-auto px-[20px] py-[4px] flex justify-between items-center cursor-pointer rounded-[4px] bg-[red] text-[white] hover:bg-[white] hover:text-[red] duration-200">
            <ImExit width={30} height={30} size={30} />
            <button className="text-[30px]">Chiqish</button>
          </div>
        </div>
        <div className="w-[75%] lg:w-[70%] sm:w-[100%] md:w-[85%] ml-auto sm:mx-auto sm:mt-[90px] md:mx-auto md:mt-[90px]">
          <div className="w-[85%] sm:w-[100%] md:w-[100%] mx-auto flex justify-between text-center mt-[20px] font-bold text-[20px] p-[20px] bg-[rgba(190,50,50)] text-white rounded-[4px] mb-[20px] sm:px-[10px] sm:py-[14px]">
            <div className="h-auto text-center">
              <p>Rasmi</p>
            </div>
            <div className="h-auto text-center">
              <p>Nomi</p>
            </div>
            <div className=" h-auto text-center">
              <p>Narxi</p>
            </div>
            <div className=" h-auto text-center">
              <p>Turi</p>
            </div>
          </div>
          {cards.length === 0
            ?
            (
              <Skeleton
                count={5}
                width={"85%"}
                height={86}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto",
                  position: "relative",
                  zIndex: 1,
                }}
              />
            )
            :
            cards.map((item) => (
              <Fragment key={item.id}>
                <details>
                  <summary className="w-[100%] sm:w-[95%] mx-auto flex justify-between text-center font-bold text-[16px] cursor-pointer">
                    <div className="w-[25%] mx-auto text-center items-center flex justify-start">
                      <img className="w-[86px] h-[86px] object-cover" src={item.img} alt={item.name} />
                    </div>
                    <div className="mx-auto sm:text-center sm:text-[14px] md:text-center text-end items-center flex justify-around">
                      <p>{item.name}</p>
                    </div>
                    <div className="w-[25%] mx-auto text-center items-center flex justify-end px-[5px] sm:text-center sm:text-[14px] md:text-center">
                      <p>{item.price}</p>
                    </div>
                    <div className="w-[25%] mx-auto text-center items-center flex justify-end px-[5px] sm:text-center sm:text-[14px] md:text-center">
                      <p>{item.type}</p>
                    </div>
                  </summary>
                  <div className="w-[85%] mx-auto items-center text-center mt-[10px]">
                    <div className="w-[50%] sm:w-[100%] md:w-[70%] lg:w-[60%] flex justify-evenly mx-auto">
                      <button
                        onClick={() => handleShowModal(item.name, item.price, item.type, item.id)}
                        className="bg-orange-500 hover:bg-[orange] text-[white] py-[4px] px-[20px] rounded-[6px] text-[18px] font-bold">Tahrirlash</button>
                      <button
                        onClick={() => handleDeleteModal(item.id)}
                        className="bg-red-700 hover:bg-[red] text-[white] py-[4px] px-[20px] rounded-[6px] text-[18px] font-bold">{"O'chirish"}</button>
                    </div>
                  </div>
                </details>
                <hr className="w-[90%] h-[1px] sm:w-[95%] mx-auto bg-slate-500 my-[20px]" />
              </Fragment>
            ))}
        </div>
      </div >
      {showModal && (
        <>
          <div onClick={() => setShowModal(!showModal)} className="w-[100%] h-[100vh] backdrop-blur-[10px] fixed top-0 left-0 z-50"></div>
          <div className="w-[100%] h-[100vh] flex justify-around items-center flex-col fixed top-0 left-0 z-50">
            <div className="sm:w-[90%] h-auto md:w-[55%] lg:w-[44%] bg-[#c00a27] flex justify-around m-auto p-[20px]">
              <form className="w-[100%] h-[80vh] justify-evenly m-auto flex flex-col">
                <div className="flex items-center justify-between">
                  <h2 className="text-[38px] font-bold text-[#ffae00]">Yangilash</h2>
                  <IoClose size={40} onClick={() => handleShowModal(inpName, inpPrice, type, docId)} className="text-[#ffae00] hover:text-[red] cursor-pointer" />
                </div>
                <div className="w-[100%]">
                  <label className="text-[#fff] font-semibold cursor-pointer py-[4px]" htmlFor="name">Nomi:</label><br />
                  <input id="name" className="text-[#fff] w-[100%] py-[4px] rounded-[6px] bg-orange-500 border-[4px] focus:bg-[#ffae00] px-[12px] placeholder:text-[rgba(255,255,255,.5)]" type="text" placeholder="Lavash" onChange={handleNameChange} value={inpName} />
                </div>
                <div className="w-[100%]">
                  <label className="text-[#fff] font-semibold cursor-pointer py-[4px]" htmlFor="price">Narxi:</label><br />
                  <input id="price" className="text-[#fff] w-[100%] py-[4px] rounded-[6px] bg-orange-500 border-[4px] focus:bg-[#ffae00] px-[12px] placeholder:text-[rgba(255,255,255,.5)]" type="text" placeholder="17,000" onChange={handlePriceChange} value={inpPrice} />
                </div>
                <div className="w-[100%]">
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
                <div className="w-[100%] bg-orange-500 hover:bg-[#ffae00] rounded-[6px] cursor-pointer flex items-center">
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
          <div onClick={() => setShowModal(!showModal)} className="w-[100%] h-[100vh] backdrop-blur-[10px] fixed top-0 left-0 z-50"></div>
          <div className="w-[100%] h-[100vh] flex justify-around items-center flex-col fixed top-0 left-0 z-50">
            <div className="w-[60%] h-auto sm:w-[90%] bg-[#c00a27] flex flex-col items-center justify-around m-auto p-[20px]">
              <h2 className="text-[30px] text-center text-[#ff0000] font-bold p-[20px] sm:p-0 sm:mb-[10px] md:p-0 md:mb-[10px]">{"Ushbu menuni o'chiriga ishonchingiz komilmi !"}</h2>
              <div className="w-[40%] flex justify-between sm:w-[80%] sm:flex-col sm:mt-[10px] md:w-[60%] md:flex-col md:mt-[10px] lg:w-[60%]">
                <button
                  onClick={() => handleDeleteModal(docId)}
                  className="bg-[yellow] py-[4px] px-[16px] text-[18px] font-bold text-[black] rounded-[8px] sm:mb-[10px] md:mb-[10px]">Bekor qilish</button>
                <button
                  onClick={handleDelteDoc}
                  className="bg-[red] py-[4px] px-[16px] text-[18px] font-bold text-[white] rounded-[8px] sm:mt-[10px] md:mt-[10px]">{"O'chirish"}</button>
              </div>
            </div>
          </div>
        </>
      )}

      {sidebar && (
        <div className="w-[100%] md:flex">
          <div
            onClick={linkScroll}
            className="w-[40%] h-[100vh] fixed top-0 left-0 hidden md:block backdrop-blur-md z-20"></div>
          <div className="w-[100%] h-[100vh] md:w-[60%] fixed top-0 right-0 z-20 bg-[#c00a27] flex-col justify-between p-[20px] text-center items-center hidden sm:flex md:flex">
            <div className="w-[100%] flex items-center mx-auto justify-between">
              <Link to={"/"} className="w-[150px] h-[60px] items-center">
                <img className="w-[100%] h-[100%]" src="http://loook.uz/assets/loook-logo-5055c421.svg" alt="" />
              </Link>
              <div>
                <IoClose
                  size={40}
                  color="#fff"
                  onClick={linkScroll}
                />
              </div>
            </div>
            <div className="w-[100%] text-[35px] font-bold text-[orange]">
              <h2>Saralash</h2>
            </div>
            <Link to={"/admin/create"} className="w-[100%] text-[20px] font-bold text-[#fff] bg-[orange] px-[20px] py-[4px] rounded-[4px] sm:text-[18px]">
              Yangi menu
            </Link>
            <div className="w-[100%] h-[45%] flex flex-col justify-evenly">
              <button
                onClick={() => handleSort('all')}
                className={`w-[100%] text-left rounded-[6px] ${sortConfig.field === "all" ? "bg-[white] text-[red] rounded-[4px]" : "text-[white] hover:bg-[rgba(255,255,255,.5)] duration-200"}`}>
                <div className="py-[4px] px-[20px] text-[20px] font-semibold">Hammasi</div>
              </button>

              <button
                onClick={() => handleSort('name')}
                className={`w-[100%] items-center rounded-[6px] ${sortConfig.field === "name" ? "bg-[white] text-[red] rounded-[4px]" : "text-[white] hover:bg-[rgba(255,255,255,.5)] duration-200"}`}>
                <div className="py-[4px] px-[20px] text-[20px] font-semibold flex justify-between">
                  <p>Nomi</p>
                  {sortConfig.field === "name" && sortConfig.direction === "asc" && (
                    <IoIosArrowUp color="#ff0000" size={30} className="ml-auto" />
                  )}
                  {sortConfig.field === "name" && sortConfig.direction === "desc" && (
                    <IoIosArrowDown color="#ff0000" size={30} />
                  )}
                </div>
              </button>

              <button
                onClick={() => handleSort('price')}
                className={`w-[100%] items-center rounded-[6px] ${sortConfig.field === "price" ? "bg-[white] text-[red] rounded-[4px]" : "text-[white] hover:bg-[rgba(255,255,255,.5)] duration-200"}`}>
                <div className="py-[4px] px-[20px] text-[20px] font-semibold flex justify-between">
                  <p>Narxi</p>
                  {sortConfig.field === "price" && sortConfig.direction === "asc" && (
                    <IoIosArrowUp color="#ff0000" size={30} />
                  )}
                  {sortConfig.field === "price" && sortConfig.direction === "desc" && (
                    <IoIosArrowDown color="#ff0000" size={30} />
                  )}
                </div>
              </button>

              <button
                onClick={() => handleSort('type')}
                className={`w-[100%] items-center rounded-[6px] ${sortConfig.field === "type" ? "bg-[white] text-[red] rounded-[4px]" : "text-[white] hover:bg-[rgba(255,255,255,.5)] duration-200"}`}>
                <div className="py-[4px] px-[20px] text-[20px] font-semibold flex justify-between">
                  <p>Turi</p>
                  {sortConfig.field === "type" && sortConfig.direction === "asc" && (
                    <IoIosArrowUp color="#ff0000" size={30} className="ml-auto" />
                  )}
                  {sortConfig.field === "type" && sortConfig.direction === "desc" && (
                    <IoIosArrowDown color="#ff0000" size={30} />
                  )}
                </div>
              </button>

            </div>
            <div
              onClick={handleLogOut}
              className="w-[100%] h-auto mx-auto px-[20px] py-[4px] sm:px-[6px] sm:text-[30px 
              ] flex justify-between items-center cursor-pointer rounded-[4px] bg-[red] text-[white] hover:bg-[white] hover:text-[red] duration-200">
              <ImExit width={30} height={30} size={30} />
              <button className="text-[30px]">Chiqish</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default Admin;
