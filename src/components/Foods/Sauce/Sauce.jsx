import { collection, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { firestore } from "../../../firebase/firebase"
import { SkeletionComp } from "../Skeletion"


const Sauce = ({ setStorageData }) => {
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

    const existingItem = data.find(item => item.id === dataCard.id);

    if (existingItem) {
      existingItem.piece += 1;
      existingItem.price += Number(dataCard.softPrice)
    } else {
      data.push({
        name: dataCard.name,
        img: dataCard.img,
        price: Number(dataCard.price),
        softPrice: Number(dataCard.price),
        type: dataCard.type,
        piece: 1,
        id: dataCard.id,
      });
    }

    localStorage.setItem("cards", JSON.stringify(data));
    localStorage.setItem("order", JSON.stringify({ order: false }))
    setStorageData(data);
  };

  return (
    <div id="sauce" className="w-[100%] h-auto pt-[200px] px-[40px] sm:px-[10px]">
      <h1 className="text-[40px] mb-[40px] font-bold">SAUCE</h1>
      <div className="w-[90%] grid grid-cols-6 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-[20px] m-auto sm:justify-around sm:items-center">
        {cards.length === 0
          ?
          (<>
            <SkeletionComp cards={6} />
          </>)
          :
          cards.filter(data => data.type === "sauce").map((data) => (
            <div
              className="w-[100%] h-[350px] bg-[#fff] sm:w-[90%] sm:h-auto sm:mx-auto rounded-[10px] p-[16px] flex flex-col"
              key={data.name}>
              <img src={data.img} className="w-[150px] h-[150px] sm:w-[80%] sm:h-auto mx-auto object-cover" alt="" />
              <h3 className="sm:w-[80%] sm:mx-auto mt-[20px] font-medium text-[#c00a27]">{data.name}</h3>
              <p className="sm:w-[80%] sm:mx-auto mt-[10px] text-[#309b42]">{data.price} {t("price.value")}</p>
              <button
                onClick={() => addToKart(data)}
                className="bg-[#f6f8f9] hover:bg-[#ffae00] px-[] py-[12px] mt-auto rounded-[8px] duration-200">{t("button.add")}</button>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Sauce