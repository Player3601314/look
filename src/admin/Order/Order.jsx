import { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/Nav/Nav";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import { ImExit } from "react-icons/im";
import { AuthContext } from "../../context/AuthContext";

const Order = ({ storageData, setStorageData }) => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

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
        <div className="w-[80%] h-auto mx-auto pt-[90px]">
          <div className="w-[100%] h-[100px] py-[20px] flex justify-between items-center">
            <ImExit className="w-auto h-[50%] text-red-500 hover:text-[red] cursor-pointer" onClick={handleLogOut} />
            <div className="text-[28px] flex">
              <h4>Qabul qilingan buyurtmalar: </h4>
              <h4 className="text-[red] font-bold pl-[10px]">{"0"}</h4>
            </div>
            <div>
              <select
                onChange={(e) => setFilterOrder(e.target.value)}
                className="w-[100%] row-start-1 col-start-1 bg-orange-500 py-[6px] px-[12px] focus:bg-[#ffae00] text-[#fff]"
              >
                <option value="default">Hammasi</option>
                <option value="got">Yetkazilayotgan</option>
                <option value="done">{"Yetkazib bo'linganlar"}</option>
              </select>
            </div>
          </div>
          {orders.length > 0 ? (
            <>
              {orders.filter(item => item.orderType === filterOrder && item.id !== orderData).map((order) => (
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
                                  <h4 className="inline-block">Mahsulot nomi: </h4>
                                  <h4 className="text-[red] pl-[10px] font-bold">{item.name}</h4>
                                </div>
                                <div className="flex">
                                  <h4 className="inline-block">Mahsulot soni: </h4>
                                  <h4 className="text-[red] pl-[10px] font-bold">{item.piece}</h4>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col justify-around items-end text-right text-[34px]">
                              <div className="flex">
                                <h4 className="inline-block">Mahsulot narxi: </h4>
                                <h4 className="text-[red] pl-[10px] font-bold">{item.price}</h4>
                              </div>
                              <div className="flex">
                                <h4 className="inline-block">Mahsulot turi: </h4>
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
                                  <h4 className="inline-block">Mahsulot nomi: </h4>
                                  <h4 className="text-[red] pl-[10px] font-bold">{item.name}</h4>
                                </div>
                                <div className="flex">
                                  <h4 className="inline-block">Mahsulot soni: </h4>
                                  <h4 className="text-[red] pl-[10px] font-bold">{item.piece}</h4>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col justify-around items-end text-right text-[34px]">
                              <div className="flex">
                                <h4 className="inline-block">Mahsulot narxi: </h4>
                                <h4 className="text-[red] pl-[10px] font-bold">{item.price}</h4>
                              </div>
                              <div className="flex">
                                <h4 className="inline-block">Mahsulot turi: </h4>
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
            <div>No orders found.</div>
          )}


        </div>
      </div>
    </div >
  );
};

export default Order;
