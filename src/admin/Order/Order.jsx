import { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/Nav/Nav";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import { ImExit } from "react-icons/im";
import { AuthContext } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";

const Order = ({ storageData, setStorageData }) => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [t, i18n] = useTranslation('global');

  const [orders, setOrders] = useState([]);
  const [filterOrder, setFilterOrder] = useState("default")
  const cardCollection = collection(firestore, "orders");
  const orderData = JSON.parse(localStorage.getItem("orderData"))

  const { dispatch } = useContext(AuthContext)

  useEffect(() => {
    if (!userData) {
      navigate("/");
      return;
    }

    if (userData.email === "admin@gmail.com") {
      navigate("/admin");
    }
    else if (userData.email === "test@gmail.com") {
      navigate("/order");
    }
    else {
      navigate("/");
    }

    const unsubscribe = onSnapshot(
      cardCollection,
      (snapShot) => {
        let data = [];
        snapShot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setOrders(data);
      },
      (error) => {
        console.error("Error fetching orders: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLogOut = () => {
    const data = localStorage.setItem("user", null)
    dispatch({ type: "LOGOUT", payload: data })
  }

  const handleGet = async (docId, type) => {
    const cardDocRef = doc(firestore, "orders", docId);

    try {
      if (type === "default") {
        console.log(docId);
        localStorage.setItem("orderData", JSON.stringify(docId))
        await updateDoc(cardDocRef, {
          orderType: "got"
        });
      }
      else if (type === "got") {
        await updateDoc(cardDocRef, {
          orderType: "done"
        });
      }
      else if (type === "done") {
        await deleteDoc(cardDocRef)
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }

  return (
    <div>
      <Nav storageData={storageData} setStorageData={setStorageData} />
      <div>
        <div className="w-[80%] h-auto mx-auto pt-[90px] sm:w-[90%]">
          <div className="w-[100%] h-[100px] py-[20px] flex justify-between items-center">
            <ImExit className="w-[10%] h-[50%] text-red-500 hover:text-[red] cursor-pointer" onClick={handleLogOut} />
            <div className="text-[28px] flex sm:text-[16px] sm:w-[100%] sm:justify-evenly md:text-[18px]">
              <h4>Qabul qilingan buyurtmalar: </h4>
              <h4 className="text-[red] font-bold pl-[10px]">{"0"}</h4>
            </div>
            <select
              onChange={(e) => setFilterOrder(e.target.value)}
              className="w-[18%] row-start-1 col-start-1 bg-orange-500 py-[6px] px-[12px] focus:bg-[#ffae00] text-[#fff] sm:w-[50%] md:w-[30%] lg:w-[22%]"
            >
              <option value="default">Hammasi</option>
              <option value="got">Yetkazilayotgan</option>
              <option value="done">{"Yetkazib bo'linganlar"}</option>
            </select>
          </div>
          {orders.length > 0 ? (
            <>
              {orders.filter(item => item.orderType === filterOrder && item.id !== orderData).map((order) => (
                <Fragment key={order.id}>
                  <div className="bg-[#fff] rounded-[6px] items-center flex justify-between sm:flex-col md:flex-col lg:flex-col py-[20px]">
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
                    <div className="w-[40%] flex flex-col text-left pl-[40px] sm:w-auto sm:p-0  sm:px-[20px] md:w-auto md:p-0 lg:w-auto lg:p-0 sm:my-[20px] md:my-[20px]">
                      <div className="text-[40px] font-medium text-left flex sm:text-[30px]">
                        <h2>Ismingiz: </h2>
                        <h2 className="pl-[10px] text-[red] font-bold">{order.userName}</h2>
                      </div>
                      <div className="text-[40px] font-medium text-left flex sm:text-[30px]">
                        <h2>Telfon: </h2>
                        <h2 className="pl-[10px] text-[red] font-bold">{"+"}{order.phoneNum}</h2>
                      </div>
                      <div className="text-[40px] font-medium text-left flex sm:text-[30px]">
                        <h2>Telfon: </h2>
                        <h2 className="pl-[10px] text-[red] font-bold">{order.totalPrice}{t("price.value")}</h2>
                      </div>
                      <div className="text-[40px] font-medium text-left flex sm:text-[30px]">
                        <h2>{"To'lov turi: "} </h2>
                        <h2 className="pl-[10px] text-[red] font-bold">{order.radio}</h2>
                      </div>
                      <div className="w-[100%] mx-auto text-center hidden sm:flex flex-col items-center text-[red]">
                        <h2 className='text-[black] text-[40px]'>Eslatma: </h2>
                        <textarea disabled className="w-[70%] sm:w-[80%] md:w-[60%] lg:w-[60%] p-[20px] max-h-[150px] rounded-[4px] font-bold">{order.note}</textarea>
                      </div>
                    </div>
                    <div className="w-[100%] mx-auto text-center sm:hidden flex flex-col items-center text-[red]">
                      <h2 className='text-[black] text-[40px]'>Eslatma: </h2>
                      <textarea disabled className="w-[70%] sm:w-[80%] md:w-[60%] lg:w-[50%] p-[20px] max-h-[150px] rounded-[4px] font-bold">{order.note}</textarea>
                    </div>
                  </div>
                  <details className="mb-[120px]">
                    <summary className="cursor-pointer flex flex-col">
                      <div className="text-center my-[20px]">
                        <h2 className="text-[40px] text-center font-medium inline-block">Mijoz:</h2>
                        <h2 className="text-[40px] text-center font-bold text-[red] inline-block pl-[10px]">{order.userName}</h2>
                      </div>
                      <button onClick={() => handleGet(order.id, order.orderType)} className="w-[200px] mx-auto my-[20px] rounded-[6px] bg-[#c00a27] py-[10px] inline-block text-center text-[20px] font-medium text-[#fff]">
                        {filterOrder === "default" ? "Qabul qilish" :
                          filterOrder === "got" ? "Yetkazib berildi" :
                            filterOrder === "done" ? "Tayyor (o'chirish)" : "Xatolik bor"}
                      </button>
                    </summary>
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
                                      <h4 className="inline-block">Nomi: </h4>
                                      <h4 className="text-[red] pl-[10px] font-bold">{item.name}</h4>
                                    </div>
                                    <div className="flex">
                                      <h4 className="inline-block">Soni: </h4>
                                      <h4 className="text-[red] pl-[10px] font-bold">{item.piece}</h4>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col justify-around text-right items-end text-[34px]">
                                  <div className="flex">
                                    <h4 className="inline-block">Narxi: </h4>
                                    <h4 className="text-[red] pl-[10px] font-bold">{item.price}</h4>
                                  </div>
                                  <div className="flex">
                                    <h4 className="inline-block">Turi: </h4>
                                    <h4 className="text-[red] pl-[10px] font-bold">{item.type}</h4>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          {item.img && (
                            <div
                              className="w-[100%] h-[350px] bg-[#fff] sm:w-[350px] sm:mx-auto rounded-[10px] p-[16px] hidden sm:flex md:w-[50%] md:flex md:mx-auto flex-col text-[red] font-bold sm:my-[20px]"
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
                  </details>
                </Fragment>
              ))}
              {orders.filter(item => item.orderType === filterOrder && item.id === orderData).map((order) => (
                <Fragment key={order.id}>
                  <div className="bg-[#fff] rounded-[6px] items-center flex justify-between">
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
                    <div className="w-[20%]">
                      <h2>Eslatma: </h2>
                      <p className="w-[100%] h-auto">{order.note}</p>
                    </div>
                    <div className="w-[40%] flex flex-col text-left pr-[40px]">
                      <div className="text-[40px] font-medium text-left flex">
                        <h2>Telfon: </h2>
                        <h2 className="pl-[10px] text-[red] font-bold">{"+"}{order.phoneNum}</h2>
                      </div>
                      <div className="text-[40px] font-medium text-left flex flex-wrap">
                        <h2>Umumiy narxi: </h2>
                        <h2 className="pl-[10px] text-[red] font-bold">{order.totalPrice} {"so'm"}</h2>
                      </div>
                      <div className="text-[40px] font-medium text-left flex">
                        <h2>{"To'lov turi: "} </h2>
                        <h2 className="pl-[10px] text-[red] font-bold">{order.radio}</h2>
                      </div>
                    </div>
                  </div>
                  <details className="mb-[120px]">
                    <summary className="cursor-pointer flex flex-col">
                      <div className="text-center my-[20px]">
                        <h2 className="text-[40px] text-center font-medium inline-block">Mijoz:</h2>
                        <h2 className="text-[40px] text-center font-bold text-[red] inline-block pl-[10px]">{order.userName}</h2>
                      </div>
                      <button onClick={() => handleGet(order.id, order.orderType)} className="w-[200px] mx-auto my-[20px] rounded-[6px] bg-[#c00a27] py-[10px] inline-block text-center text-[20px] font-medium text-[#fff]">
                        {filterOrder === "default" ? "Qabul qilish" :
                          filterOrder === "got" ? "Yetkazib berildi" :
                            filterOrder === "done" ? "Tayyor (o'chirish)" : "Xatolik bor"}
                      </button>
                    </summary>
                    {Object.values(order).map((item, itemIndex) => (
                      item && typeof item === 'object' && item.img && (
                        <Fragment key={itemIndex}>
                          <div className="w-[100%] h-auto p-[20px] bg-[#fff] flex justify-between">
                            <div className="flex items-center">
                              <img
                                className="w-[100px] h-[100px] object-cover"
                                src={item.img}
                                alt={item.name}
                              />
                              <div className="ml-[40px] flex flex-col justify-around text-[34px]">
                                <div className="flex">
                                  <h4 className="inline-block">Nomi: </h4>
                                  <h4 className="text-[red] pl-[10px] font-bold">{item.name}</h4>
                                </div>
                                <div className="flex">
                                  <h4 className="inline-block">Soni: </h4>
                                  <h4 className="text-[red] pl-[10px] font-bold">{item.piece}</h4>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col justify-around items-end text-right text-[34px]">
                              <div className="flex">
                                <h4 className="inline-block">Narxi: </h4>
                                <h4 className="text-[red] pl-[10px] font-bold">{item.price}</h4>
                              </div>
                              <div className="flex">
                                <h4 className="inline-block">Turi: </h4>
                                <h4 className="text-[red] pl-[10px] font-bold">{item.type}</h4>
                              </div>
                            </div>
                          </div>
                        </Fragment>
                      )
                    ))}
                  </details>
                </Fragment>
              ))}
            </>
          ) : (
            <>
              <Skeleton width={"100%"} height={"100vh"} />
              <div className="w-[100%] absolute top-[60px] left-0 flex justify-center items-center h-screen">
                <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                  <p>{"Yuklanmoqda. Iltimos kutib turing!"}</p>
                </div>
              </div>
            </>
          )}


        </div>
      </div>
    </div >
  );
};

export default Order;
