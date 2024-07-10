import React from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LiaMoneyBillSolid } from 'react-icons/lia';
import { BsCreditCard } from 'react-icons/bs';
import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

const Pay = (props) => {
  const [t, i18n] = useTranslation('global');
  const storageData = props.storageData;
  const setStorageData = props.setStorageData;

  const [name, setName] = useState("")
  const [num, setNum] = useState(998)
  const [note, setNote] = useState("")
  const [price, setPrice] = useState(0);
  const [coordinates, setCoordinates] = useState(null);
  const [radio, setRadio] = useState(true)

  const cardCollection = collection(firestore, "orders");

  console.log(coordinates);

  useEffect(() => {
    let totalPrice = 0;
    const localData = JSON.parse(localStorage.getItem('cards')) || [];
    localData.forEach((item) => {
      totalPrice += item.price;
    });
    setPrice(totalPrice);
  }, []);

  const handleRemove = (data, id) => {
    const filterData = data.filter((item) => item.id !== id);
    if (storageData.length !== 0) {
      setStorageData(filterData);
      localStorage.setItem('cards', JSON.stringify(filterData));
    }
    else if (storageData.length === 0) {
      localStorage.clear()
      setStorageData(null)
      localStorage.setItem('cards', JSON.stringify([]));
      console.log("...");
    }
  };

  const handleAddPrice = (item) => {
    const existingData = JSON.parse(localStorage.getItem('cards')) || [];
    const itemIndex = existingData.findIndex((dataItem) => dataItem.id === item.id);

    if (itemIndex > -1) {
      existingData[itemIndex].piece += 1;
      existingData[itemIndex].price += Number(item.softPrice);
    } else {
      existingData.push({
        name: item.name,
        img: item.img,
        price: Number(item.softPrice),
        softPrice: item.softPrice,
        piece: 1,
        type: item.type,
        id: item.id,
      });
    }

    setPrice(existingData.reduce((acc, curr) => acc + curr.price, 0));
    setStorageData(existingData);
    localStorage.setItem('cards', JSON.stringify(existingData));
  };

  const handleRemovePrice = (item) => {
    const existingData = JSON.parse(localStorage.getItem('cards')) || [];
    const itemIndex = existingData.findIndex((dataItem) => dataItem.id === item.id);

    if (itemIndex > -1 && existingData[itemIndex].piece > 1) {
      existingData[itemIndex].piece -= 1;
      existingData[itemIndex].price -= Number(item.softPrice);

      setPrice(existingData.reduce((acc, curr) => acc + curr.price, 0));
      setStorageData(existingData);
      localStorage.setItem('cards', JSON.stringify(existingData));
    }
  };

  const handleMapClick = (e) => {
    const coords = e.get('coords');
    setCoordinates(coords);
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    const numLength = num.length
    // const coordData = [40.120302, 67.828544]
    if (name === "" || numLength !== 11 || storageData.length === 0 || coordinates === null || note === "") {
      alert("Iltimos o'zingiz yoki buyurtmangiz haqidagi ma'lumotlarni qaytadan tekshirib chiqing")
      return
    }
    try {

      let firstData = {};
      storageData.forEach((item, index) => {
        firstData[index.toString()] = item;
      });

      let secondData = {
        userName: name,
        phoneNum: num,
        coordinates: coordinates,
        radio: radio ? "naqd" : "terminal"
      }

      Object.assign(secondData, firstData)

      await addDoc(cardCollection, secondData);
      window.location.reload();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  console.log(storageData);

  const handleChangeNum = (e) => {
    const num = e.target.value
    const numLength = num.length
    if (numLength === 12) {
      return
    }

    setNum(num)
  }


  return (
    <div className="w-[94%] mx-auto pt-[100px] flex justify-between">
      <div className="w-[70%]">
        <div>
          <h2 className="text-[40px] font-bold">Buyurtmani tasdiqlash</h2>
        </div>
        <form className="flex flex-col bg-[#fff] rounded-[6px] p-[30px] mt-[50px]">
          <h2 className="text-[40px] font-bold">{"Shaxsiy ma'lumotlar"}</h2>
          <div className="flex justify-between mt-[20px]">
            <input
              className="w-[45%] bg-[#f6f8f9] text-[18px] font-medium py-[10px] px-[14px]"
              type="text"
              placeholder="Ism familyangiz"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <input
              className="hide-input-controls w-[45%] bg-[#f6f8f9] text-[18px] font-medium py-[10px] px-[14px]"
              type="number"
              placeholder="+998 ** *** ** **"
              onChange={(e) => handleChangeNum(e)}
              value={num}
            />
          </div>
        </form>
        <div className="my-[20px] bg-[#fff] p-[30px] rounded-[6px]">
          <h2 className="text-[40px] font-bold">Buyurtmalaringiz</h2>
          <div>
            {storageData.map((item) => (
              <div key={item.id} className="w-[100%] flex flex-row justify-between items-center my-[20px]">
                <div className="w-[50%] flex items-center">
                  <button className="mr-[20px]">
                    <FaTrash
                      onClick={() => handleRemove(storageData, item.id)}
                      size={20}
                      color="#323232"
                      className="text-[#c00a27]"
                    />
                  </button>
                  <div className="w-[50%] flex items-center justify-between">
                    <img className="w-[100px] h-[95px]" src={item.img} alt="" />
                    <p className="text-[16px] w-[100px] text-center font-thin">{item.name}</p>
                  </div>
                </div>
                <div className="w-[16%] items-center text-center">
                  <p className="text-[#c00a27]">
                    {item.price} {t('price.value')}
                  </p>
                  <div className="w-[100%] h-[40px] flex justify-between items-center bg-[#f6f8f9] rounded-full">
                    <FaMinus
                      onClick={() => handleRemovePrice(item)}
                      className="hover:text-[#ffae00] duration-200 cursor-pointer m-auto"
                      size={16}
                    />
                    <p>{item.piece}</p>
                    <FaPlus
                      onClick={() => handleAddPrice(item)}
                      className="hover:text-[#ffae00] duration-200 cursor-pointer m-auto"
                      size={16}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="my-[20px] bg-[#fff] p-[30px] rounded-[6px]">
          <h2 className="text-[40px] font-bold">Buyurtmani yetkaizb berish</h2>
          <h4 className='text-[20px] font-medium p-[20px] bg-[#f6f8f9] text-[#6e7c87] rounded-[6px] my-[20px]'>Iltimos yetkazib berish uchun manzilingizni tanlang</h4>
          <YMaps query={{ lang: 'uz_UZ' }}>
            <div>
              <Map
                defaultState={{ center: [40.120302, 67.828544], zoom: 12 }}
                width="100%"
                height="400px"
                onClick={handleMapClick}
              >
                <Placemark
                  geometry={coordinates}
                  options={{ iconColor: '#ff0000' }}
                />
              </Map>
            </div>
          </YMaps>
        </div>

        <div className="my-[20px] bg-[#fff] p-[30px] rounded-[6px]">
          <h2 className='text-[40px] font-bold'>Elsatma</h2>
          <textarea
            className='w-[100%] bg-[#f6f8f9] text-[18px] font-medium resize-none rounded-[6px] p-[12px]'
            placeholder='Buyurtma uchun eslatma qoldiring'
            onChange={(e) => setNote(e.target.value)}
          >
          </textarea>
        </div>

        <div className="my-[20px] bg-[#fff] p-[30px] rounded-[6px]">
          <h2 className='text-[40px] font-bold'>{"To'lov turi"}</h2>
          <div className='flex justify-between'>
            <label htmlFor='naqd' onClick={() => setRadio(true)} className={`w-[48%] cursor-pointer ${radio ? "bg-[#FFF7E5]" : "bg-[#f6f8f9]"} py-[14px] px-[14px] rounded-[6px] flex justify-between items-center`}>
              <div className='flex items-center'>
                <div className='w-[40px] h-[40px] bg-[#eef0f2] items-center flex rounded-full'>
                  <LiaMoneyBillSolid className='mx-auto text-[#ffae00]' />
                </div>
                <h4 className='text-[20px] font-medium ml-[10px]'>Naqd</h4>
              </div>
              <input id='naqd' type="radio" value="naqd" checked={radio} onChange={() => { }} name="paymentMethod" className='hidden' />
            </label>

            <label htmlFor='terminal' onClick={() => setRadio(false)} className={`w-[48%] cursor-pointer ${radio ? "bg-[#f6f8f9]" : "bg-[#FFF7E5]"} py-[14px] px-[14px] rounded-[6px] flex justify-between items-center`}>
              <div className='flex items-center'>
                <div className='w-[40px] h-[40px] bg-[#eef0f2] items-center flex rounded-full'>
                  <BsCreditCard className='mx-auto text-[#ffae00]' />
                </div>
                <h4 className='text-[20px] font-medium ml-[10px]'>Terminal</h4>
              </div>
              <input id='terminal' type="radio" value="terminal" checked={!radio} onChange={() => { }} name="paymentMethod" className='hidden' />
            </label>

          </div>
        </div>
      </div>

      <div className="w-[28%] h-[360px] bg-[#fff] mt-[80px] sticky top-[0px] rounded-[4px] py-[20px] px-[20px]">
        <h2 className="text-[40px] font-bold">Jami</h2>
        <div className="flex mt-[20px] justify-between">
          <div>
            <p className="text-[18px] font-medium text-[#6e7c87]">Buyurtma narxi:</p>
            <p className="text-[18px] font-medium text-[#6e7c87]">Yetkazib berish narxi:</p>
            <p className="text-[18px] font-medium text-[#6e7c87]">Yetkazib berish vaqti:</p>
          </div>
          <div>
            <p className="text-[18px] font-medium">{price} {t('price.value')}</p>
            <p className="text-[18px] font-medium">None</p>
            <p className="text-[18px] font-medium">40 daqiqa</p>
          </div>
        </div>
        <hr className="w-[100%] h-[1px] my-[20px] bg-[#b9b9b9b9]" />
        <div className="h-[auto] flex flex-col">
          <div className="flex justify-between">
            <h4 className="text-[20px] font-medium text-[#000]">Umumiy narxi</h4>
            <h4 className="text-[20px] font-medium text-red-600">
              {price} {t('price.value')}
            </h4>
          </div>
          <button
            onClick={handleOrder}
            className="w-[100%] py-[15px] mt-[20px] bg-red-700 text-[#fff] text-[18px] font-bold rounded-[6px]">
            Tasdiqlash
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pay;
