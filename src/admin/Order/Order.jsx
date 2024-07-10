import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/Nav/Nav";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";

const Order = ({ storageData, setStorageData }) => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const cardCollection = collection(firestore, "orders");

  useEffect(() => {
    if (!userData) {
      navigate("/");
      return;
    }

    if (userData.email === "admin@gmail.com") {
      navigate("/admin");
    } else if (userData.email === "test@gmail.com") {
      navigate("/order");
    } else {
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

  console.log("Orders:", orders);

  return (
    <div>
      <Nav storageData={storageData} setStorageData={setStorageData} />
      <div>
        <div className="w-[100%] h-[60vh] pt-[120px]">
          {orders.length > 0 ? (
            orders.map((order, orderIndex) => (
              <Fragment key={orderIndex}>
                <div key={orderIndex}>{order.userName}</div>
                {Object.values(order).map((item, itemIndex) => (
                  item && typeof item === 'object' && (
                    <Fragment key={itemIndex}>
                      <div className="w-[100%] flex justify-between">
                        <div className="flex items-center">
                          {item.img && (
                            <img
                              className="w-[100px] h-[100px]"
                              src={item.img}
                              alt={item.name}
                            />
                          )}
                          <div>{item.name}</div>
                        </div>
                        <div className="">
                          <div>Price: {item.price}</div>
                          <div>Type: {item.type}</div>
                        </div>
                      </div>
                    </Fragment>
                  )
                ))}
              </Fragment>
            ))
          ) : (
            <div>No orders found.</div>
          )}


        </div>
      </div>
    </div >
  );
};

export default Order;
