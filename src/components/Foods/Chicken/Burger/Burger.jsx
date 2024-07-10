import { collection, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { firestore } from "../../../firebase/firebase"


const Burger = ({ setStorageData }) => {
  const [t, i18n] = useTranslation("global")

  const [cards, setCards] = useState([])

  const cardCollection = collection(firestore, "cards")

  useEffect(() => {
    onSnapshot(cardCollection, (snapShot) => {
      let data = []
      snapShot.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id })
      })
      setCards(data)
    },
      (error) => {
        console.log(error)
      }
    )
  }, [])


  const addToKart = (dataCard) => {
    let data = localStorage.getItem("cards");
    if (data) {
      data = JSON.parse(data);
    } else {
      data = [];
    }

    if (Array.isArray(dataCard)) {
      dataCard.forEach(item => {
        const isDuplicate = data.some(existingItem => existingItem.name === item.name);
        if (!isDuplicate) {
          data.push({
            name: item.name,
            img: item.img,
            price: item.price,
            type: item.type,
            piece: 1,
            id: item.id,
          });
        } else {
          alert("Bu mahsulot alla qachon savatga yuborilgan");
        }
      });
    }
    else if (typeof dataCard === 'object') {
      const isDuplicate = data.some(existingItem => existingItem.name === dataCard.name);
      if (!isDuplicate) {
        data.push({
          name: dataCard.name,
          img: dataCard.img,
          price: Number(dataCard.price),
          softPrice: Number(dataCard.price),
          type: dataCard.type,
          piece: 1,
          id: dataCard.id,
        });
      } else {
        data.push({
          name: dataCard.name,
          img: dataCard.img,
          price: Number(dataCard.price),
          softPrice: Number(dataCard.price),
          type: dataCard.type,
          piece: data.price + 1,
          id: dataCard.id,
        });
      }
    }
    else {
      console.error("addToKart received unexpected dataCard type:", typeof dataCard, dataCard);
    }

    localStorage.setItem("cards", JSON.stringify(data));
    setStorageData(data);
  };

  return (
    <div id="burger" className="w-[100%] h-auto py-[100px] px-[40px]">
      <h1 className="text-[40px] mb-[40px] font-bold">BURGERS</h1>
      <div className="w-[90%] grid grid-cols-6 gap-[20px] m-auto">
        {cards.filter(data => data.type === "burgers").map((data) => (
          <div
            className="w-[100%] h-[350px] bg-[#fff] rounded-[10px] p-[16px] flex flex-col"
            key={data.name}
          >
            <img
              src={data.img}
              className="w-[150px] h-[150px] mx-auto object-cover"
              alt=""
            />
            <h3 className="mt-[20px] font-medium text-[#c00a27]">{data.name}</h3>
            <p className="mt-[10px] text-[#309b42]">
              {data.price} {t("price.value")}
            </p>
            <button
              onClick={() => addToKart(data)}
              className="bg-[#f6f8f9] hover:bg-[#ffae00] px-[12px] py-[12px] mt-auto rounded-[8px] duration-200"
            >
              {t("button.add")}
            </button>
          </div>
        ))}
        {!cards || cards.filter(data => data.type === "burgers").length === 0 && (
          <>
            Havn't data
          </>
        )}
      </div>
    </div>
  )
}

export default Burger