import { YMaps, Map, Placemark, FullscreenControl, SearchControl, TypeSelector, ZoomControl } from '@pbe/react-yandex-maps';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LiaMoneyBillSolid } from 'react-icons/lia';
import { BsCreditCard } from 'react-icons/bs';
import { addDoc, collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import Skeleton from 'react-loading-skeleton';

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
  const [order, setOrder] = useState(false)
  const [orderData, setOrderData] = useState([])

  const orderCollection = collection(firestore, "orders");
  const localOrderJSON = localStorage.getItem("orders")
  const localOrder = JSON.parse(localOrderJSON)
  const storageOrder = JSON.parse(localStorage.getItem("order"))
  const storageCards = JSON.parse(localStorage.getItem("cards"))
  console.log(localOrder);

  useEffect(() => {
    let totalPrice = 0;
    const localDataString = localStorage.getItem('cards');

    if (storageOrder) {
      setOrder(storageOrder.order)
    }

    onSnapshot(orderCollection, (snapShot) => {
      let data = [];
      snapShot.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setOrderData(data);
    })

    try {
      const localData = JSON.parse(localDataString) || [];

      if (Array.isArray(localData)) {
        localData.forEach((item) => {
          totalPrice += item.price || 0;
        });

        setPrice(totalPrice);
      } else {
        console.error('Data retrieved from localStorage is not an array:', localData);
      }
    } catch (error) {
      console.error('Error parsing JSON from localStorage:', error);
    }
  }, [storageData]);

  const handleRemove = (data, id) => {
    const filterData = data.filter((item) => item.id !== id);
    if (storageData.length !== 0) {
      setStorageData(filterData);
      localStorage.setItem('cards', JSON.stringify(filterData));
    }
    else if (storageData.length === 0) {
      localStorage.removeItem("cards")
      setStorageData(null)
      localStorage.setItem('cards', JSON.stringify([]));
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

  const handleChangeNum = (e) => {
    const num = e.target.value
    const numLength = num.length
    if (numLength === 12) {
      return
    }

    setNum(num)
  };

  const handleOrder = async (e) => {
    e.preventDefault();

    const numLength = num.length;
    if (name === "" || numLength !== 11 || storageData.length === 0 || coordinates === null || note === "") {
      alert("Iltimos o'zingiz yoki buyurtmangiz haqidagi ma'lumotlarni qaytadan tekshirib chiqing");
      return;
    }

    const storageArr = [];
    if (confirm("Barcha malumotlaringiz va xaridlaringiz to'g'riligiga ishonchingiz komilmi") === true) {
      try {
        if (localOrder) {
          storageArr.push(localOrder);
        }

        console.log("Radio value:", radio);

        let firstData = storageCards.map((item) => ({
          name: item.name,
          img: item.img,
          price: item.price,
          softPrice: item.softPrice,
          piece: item.piece,
          type: item.type
        }))

        let secondData = {
          userName: name,
          phoneNum: num,
          coordinates: coordinates,
          note: note,
          totalPrice: price,
          orderType: "default",
          radio: radio ? "naqd" : "terminal"
        };

        let orderOBJ = {
          order: true,
          phone: num,
          name: name,
        }

        Object.assign(secondData, firstData)

        const hasUndefinedFields = Object.values(secondData).some(value => value === undefined);
        if (hasUndefinedFields) {
          console.error("secondData contains undefined values:", secondData);
          return;
        }

        await addDoc(orderCollection, secondData);
        localStorage.setItem("orders", JSON.stringify(secondData))
        localStorage.setItem("order", JSON.stringify(orderOBJ))
        setOrder(true);
      }
      catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  const handleCancel = async (id) => {
    if (confirm("Buyurtmangizni bekor qilmoqchimisiz ?") === true) {
      localStorage.removeItem("order")
      localStorage.removeItem("orders")
      await deleteDoc(doc(firestore, "orders", id))
      setOrder(false)
      window.location.reload()
    }
    else {
      setOrder(true)
    }
  }

  const handleDone = async (id) => {
    localStorage.removeItem("order")
    localStorage.removeItem("orders")
    console.log(id);
    setOrder(false)
  }

  return (
    <div className="w-[94%] mx-auto pt-[100px] flex justify-between sm:flex-col md:flex-col lg:flex-col">
      <div className={order ? "w-[100%]" : "w-[70%] sm:w-[100%] md:w-[85%] md:mx-auto lg:w-[85%] lg:mx-auto"}>
        {!order && (
          <>
            <div>
              <h2 className="text-[40px] font-bold">Buyurtmani tasdiqlash</h2>
            </div>
            <form className="flex flex-col bg-[#fff] rounded-[6px] p-[30px] mt-[50px]">
              <h2 className="text-[40px] font-bold">{"Shaxsiy ma'lumotlar"}</h2>
              <div className="flex justify-between mt-[20px] sm:flex-col sm:w-[100%]">
                <input
                  className="w-[45%] sm:w-[100%] my-[10px] bg-[#f6f8f9] text-[18px] font-medium py-[10px] px-[14px]"
                  type="text"
                  placeholder="Ism familyangiz"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
                <input
                  className="hide-input-controls w-[45%] sm:w-[100%] my-[10px] bg-[#f6f8f9] text-[18px] font-medium py-[10px] px-[14px]"
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  placeholder="+998 ** *** ** **"
                  onChange={(e) => handleChangeNum(e)}
                  value={num}
                />
              </div>
            </form>
          </>
        )}
        {!order &&
          <div className="my-[20px] bg-[#fff] p-[30px] rounded-[6px] sm:px-[20px]">
            <h2 className="text-[40px] font-bold">Buyurtmalaringiz</h2>
            <div>
              {storageData.map((item) => (
                <div key={item.id} className="w-[100%] flex flex-row justify-between items-center my-[20px]">
                  <div className="w-[50%] flex items-center sm:w-[70%] md:w-[70%] lg:w-[60%]">
                    <button className="mr-[20px]">
                      <FaTrash
                        onClick={() => handleRemove(storageData, item.id)}
                        size={20}
                        color="#323232"
                        className="text-[#c00a27]"
                      />
                    </button>
                    <div className="w-[50%] flex items-center justify-between sm:w-[60%] lg:w-[60%]">
                      <img className="w-[100px] h-[95px] object-cover" src={item.img} alt="" />
                      <p className="text-[16px] w-[100px] text-center font-thin">{item.name}</p>
                    </div>
                  </div>
                  <div className="w-[16%] items-center text-center sm:w-[30%] md:w-[25%] lg:w-[20%]">
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
        }
        {order && (
          orderData.length > 0 ? (
            (() => {
              const filteredOrders = orderData.filter(item =>
                item.userName === localOrder.userName &&
                item.phoneNum === localOrder.phoneNum &&
                item.orderType !== "default"
              );

              if (filteredOrders.length > 0) {
                return filteredOrders.map((order) => (
                  <Fragment key={order.id}>
                    <div className="my-[20px] bg-[#fff] p-[30px] rounded-[6px]">
                      <h2 className="text-[40px] font-bold sm:text-center md:text-center lg:text-center">Buyurtmalaringiz</h2>
                      <div className="bg-[#fff] rounded-[6px] items-center flex justify-between sm:flex-col md:flex-col lg:flex-col">
                        <YMaps query={{ lang: 'uz_UZ' }}>
                          <div>
                            <Map
                              defaultState={{
                                center: order.coordinates,
                                zoom: 12,
                              }}
                              modules={["control.ZoomControl", "control.FullscreenControl"]}
                              width="350px"
                              height="350px"
                            >
                              <Placemark
                                geometry={order.coordinates}
                                options={{ iconColor: '#ff0000' }}
                              />
                            </Map>
                          </div>
                        </YMaps>
                        <div className="w-[40%] flex flex-col text-left pr-[40px] sm:w-auto sm:p-0 md:w-auto md:p-0 lg:w-auto lg:p-0 sm:my-[20px] md:my-[20px]">
                          <div className="text-[40px] font-medium text-left flex sm:text-[30px]">
                            <h2>Ismingiz: </h2>
                            <h2 className="pl-[10px] text-[red] font-bold">{order.userName}</h2>
                          </div>
                          <div className="text-[40px] font-medium text-left flex sm:text-[30px]">
                            <h2>Telfon: </h2>
                            <h2 className="pl-[10px] text-[red] font-bold">{"+"}{order.phoneNum}</h2>
                          </div>
                          <div className="text-[40px] font-medium text-left flex flex-wrap">
                            <h2>Umumiy narxi: </h2>
                            <h2 className="pl-[10px] text-[red] font-bold">{order.totalPrice} {"so'm"}</h2>
                          </div>
                          <div className="text-[40px] font-medium text-left flex sm:text-[30px]">
                            <h2>{"To'lov turi: "} </h2>
                            <h2 className="pl-[10px] text-[red] font-bold">{order.radio}</h2>
                          </div>
                        </div>
                      </div>
                      <div className="w-[100%] mx-auto text-center flex flex-col items-center text-[red]">
                        <h2 className='text-[black] text-[40px]'>Eslatma: </h2>
                        <textarea disabled className="w-[40%] sm:w-[80%] md:w-[60%] p-[20px] max-h-[150px] rounded-[4px] font-bold">{order.note}</textarea>
                      </div>
                      <div className="text-center my-[20px] flex flex-col">
                        {order.orderType !== "done" && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            className='w-[300px] mx-auto my-[6px] py-[8px] px-[10px] rounded-[4px] text-[20px] font-bold bg-red-600 hover:bg-[red] text-white'>Buyurtmani bekor qilish</button>
                        )}
                        {order.orderType === "done" && (
                          <button
                            onClick={() => handleDone(order.id)}
                            className='w-[300px] mx-auto my-[6px] py-[8px] px-[10px] rounded-[4px] text-[20px] font-bold bg-green-600 hover:bg-[green] text-white'>Buyurtmani oldim</button>
                        )}
                        <h2 className="text-[40px] text-center font-medium inline-block">Maxsulotlaringiz:</h2>
                      </div>
                      {Object.values(order).map((item, itemIndex) => (
                        item && typeof item === 'object' && (
                          <Fragment key={itemIndex}>
                            <div className="w-[100%] h-auto p-[20px] bg-[#fff] flex justify-between sm:hidden md:hidden">
                              {item.img && (
                                <>
                                  <div className="flex items-center">
                                    <img
                                      className="w-[100px] h-[100px] object-cover"
                                      src={item.img}
                                      alt={item.name}
                                    />
                                    <div className="ml-[40px] flex flex-col justify-around text-[34px]">
                                      <div className="flex">
                                        <h4 className="inline-block">Mahsulot nomi: </h4>
                                        <h4 className="text-[red] pl-[10px] font-bold">{item.name}</h4>
                                      </div>
                                      <div className="flex">
                                        <h4 className="inline-block">Mahsulot soni: </h4>
                                        <h4 className="text-[red] pl-[10px] font-bold">{item.piece}</h4>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col justify-around text-right items-end text-[34px]">
                                    <div className="flex">
                                      <h4 className="inline-block">Mahsulot narxi: </h4>
                                      <h4 className="text-[red] pl-[10px] font-bold">{item.price}</h4>
                                    </div>
                                    <div className="flex">
                                      <h4 className="inline-block">Mahsulot turi: </h4>
                                      <h4 className="text-[red] pl-[10px] font-bold">{item.type}</h4>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                            {item.img && (
                              <div
                                className="w-[100%] h-[350px] bg-[#fff] sm:w-[350px] sm:mx-auto rounded-[10px] p-[16px] hidden sm:flex md:w-[50%] md:flex md:mx-auto flex-col text-[red] font-bold"
                                key={item.name}
                              >
                                <img src={item.img} className="w-[150px] h-auto sm:w-[80%] mx-auto object-cover md:w-[100%]" alt="" />
                                <div className="sm:w-[80%] sm:mx-auto md:w-[70%] md:mx-auto md:text-center md:justify-between mt-[20px] flex text-[20px]">
                                  <p className='text-[black] mr-[4px] font-medium'>Nomi: </p>
                                  {item.name}
                                </div>
                                <div className="sm:w-[80%] sm:mx-auto md:w-[70%] md:mx-auto md:text-center md:justify-between mt-[0px] flex text-[20px]">
                                  <p className='text-[black] mr-[4px] font-medium'>Narxi:</p>
                                  {item.softPrice}
                                  {t("price.value")}
                                </div>
                                <div className="sm:w-[80%] sm:mx-auto md:w-[70%] md:mx-auto md:text-center md:justify-between mt-[0px] flex text-[20px]">
                                  <p className='text-[black] mr-[4px] font-medium'>Soni: </p>
                                  {item.piece}
                                </div>
                                <div className="sm:w-[80%] sm:mx-auto md:w-[70%] md:mx-auto md:text-center md:justify-between mt-[0px] flex text-[20px]">
                                  <p className='text-[black] mr-[4px] font-medium'>Turi: </p>
                                  {item.type}
                                </div>
                              </div>
                            )}
                          </Fragment>
                        )
                      ))}
                    </div>
                  </Fragment>
                ));
              } else {
                return <>
                  <Skeleton width={"100%"} height={"100vh"} />
                  <div className="w-[100%] absolute top-[60px] left-0 flex justify-center items-center h-screen">
                    <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                      <p>{"Sizning buyurtmangiz kurib chiqilmoqda. Iltimos kutib turing!"}</p>
                    </div>
                  </div>
                </>;
              }
            })()
          ) : (
            <div><Skeleton width={"100%"} height={"100vh"} /></div>
          )
        )}

        {!order && (
          <>
            <div className="my-[20px] bg-[#fff] p-[30px] rounded-[6px]">
              <h2 className="text-[40px] font-bold">Buyurtmani yetkaizb berish</h2>
              <h4 className='text-[20px] font-medium p-[20px] bg-[#f6f8f9] text-[#6e7c87] rounded-[6px] my-[20px]'>Iltimos yetkazib berish uchun manzilingizni tanlang</h4>
              <YMaps query={{ lang: 'uz_UZ' }}>
                <div>
                  <Map
                    defaultState={{
                      center: [40.120302, 67.828544],
                      zoom: 12,
                      controls: [],
                    }}
                    width="100%"
                    height="400px"
                    onClick={handleMapClick}
                  >
                    <SearchControl />
                    <FullscreenControl />
                    <ZoomControl options={{ float: "right" }} />
                    <TypeSelector options={{ float: "right" }} />
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
              <div className='flex justify-between sm:flex-col'>
                <label htmlFor='naqd' onClick={() => setRadio(true)} className={`w-[48%] cursor-pointer ${radio ? "bg-[#FFF7E5]" : "bg-[#f6f8f9]"} py-[14px] px-[14px] rounded-[6px] flex justify-between items-center sm:w-[100%] my-[10px]`}>
                  <div className='flex items-center'>
                    <div className='w-[40px] h-[40px] bg-[#eef0f2] items-center flex rounded-full'>
                      <LiaMoneyBillSolid className='mx-auto text-[#ffae00]' />
                    </div>
                    <h4 className='text-[20px] font-medium ml-[10px]'>Naqd</h4>
                  </div>
                  <input id='naqd' type="radio" value="naqd" checked={radio} onChange={() => { }} name="paymentMethod" className='hidden' />
                </label>

                <label htmlFor='terminal' onClick={() => setRadio(false)} className={`w-[48%] cursor-pointer ${radio ? "bg-[#f6f8f9]" : "bg-[#FFF7E5]"} py-[14px] px-[14px] rounded-[6px] flex justify-between items-center sm:w-[100%] my-[10px]`}>
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
          </>
        )}
      </div>

      {!order && (
        <div className="w-[28%] h-[360px] bg-[#fff] mt-[80px] sticky top-[0px] rounded-[4px] py-[20px] px-[20px] sm:w-[100%] md:w-[85%] md:mx-auto lg:w-[85%] lg:mx-auto lg:h-auto">
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
      )}
    </div>
  );
};

export default Pay;
