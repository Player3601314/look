import { addDoc, collection } from "firebase/firestore";
import { firestorage, firestore } from "../firebase/firebase";
import { useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Link } from "react-router-dom";

const CreateCard = () => {
  const cardCollection = collection(firestore, "cards");
  const inpName = useRef("");
  const inpPrice = useRef("");
  const [inpImg, setInpImg] = useState("")
  const [type, setType] = useState("appetizers")

  const handleNameChange = (e) => {
    inpName.current = e.target.value;
  };

  const handlePriceChange = (e) => {
    inpPrice.current = e.target.value;
  };

  const handleUpload = (e) => {
    console.log(e.target.files[0].name);
    const img = e.target.files[0]
    const imgRef = ref(firestorage, `cards/${img.name}`)
    uploadBytes(imgRef, img).then((data) => {
      console.log(data);
      getDownloadURL(data.ref).then(val =>
        setInpImg(val)
      )
    })
  }

  const handleCreate = async (e) => {
    e.preventDefault();

    const name = inpName.current;
    const price = inpPrice.current;

    if (name === "" || price === "" || inpImg === "") {
      alert("Iltimos hamma qatorni to'ldiring")
      return
    }

    try {
      await addDoc(cardCollection, {
        name: name,
        img: inpImg,
        price: price,
        softPrice: price,
        type: type,
      });
      window.location.reload()
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="w-[100%] h-[100vh] flex justify-around items-center flex-col">
      <div className="w-[30%] h-[550px] bg-[#c00a27] flex justify-around m-auto">
        <form className="w-auto h-[550px] justify-evenly m-auto flex flex-col" onSubmit={handleCreate}>
          <div><Link to={"/admin"} className="text-[#fff] font-bold">{"< Ortga qaytish"}</Link></div>
          <div>
            <h2 className="text-[38px] font-bold text-[#ffae00]">{"Menu qo'shish"}</h2>
          </div>
          <div className="w-[300px]">
            <label className="text-[#fff] font-semibold cursor-pointer py-[4px]" htmlFor="name">
              Nomi:
            </label>
            <br />
            <input
              id="name"
              className="text-[#fff] w-[100%] py-[4px] rounded-[6px] bg-orange-500 border-[4px] focus:bg-[#ffae00] px-[12px] placeholder:text-[rgba(255,255,255,.5)]"
              type="text"
              placeholder="Lavash"
              onChange={handleNameChange}
            />
          </div>
          <div className="w-[300px]">
            <label className="text-[#fff] font-semibold cursor-pointer py-[4px]" htmlFor="price">
              Narxi:
            </label>
            <br />
            <input
              id="price"
              className="text-[#fff] w-[100%] py-[4px] rounded-[6px] bg-orange-500 border-[4px] focus:bg-[#ffae00] px-[12px] placeholder:text-[rgba(255,255,255,.5)]"
              type="text"
              placeholder="17,000"
              onChange={handlePriceChange}
            />
          </div>
          <div className="w-[300px]">
            <label className="text-[#fff] font-semibold cursor-pointer py-[4px]" htmlFor="type">
              Tur:
            </label>
            <br />
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
            <label className="w-[100%] text-center cursor-pointer text-[#fff] py-[6px] m-auto font-bold rounded-[6px]" htmlFor="img">
              Rasmni tanlang
            </label>
            <input
              id="img"
              className="hidden"
              type="file"
              onChange={(e) => handleUpload(e)}
            />
          </div>
          <button className="bg-orange-500 hover:bg-[#ffae00] py-[6px] text-[18px] font-semibold rounded-[6px] text-[#fff]" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCard;
