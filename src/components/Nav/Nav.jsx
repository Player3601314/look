import { Link, NavLink } from "react-router-dom"
import { RiShoppingBagFill } from "react-icons/ri";
import "./nav.css"
import { useTranslation } from "react-i18next";
import { Fragment, useEffect, useState } from "react";
import arrowIcon from "../../assets/arrow.svg"
import closeImg from "../../assets/close.svg"
import searchIcon from "../../assets/search.svg"
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { IoClose, IoMapOutline, IoMenu } from "react-icons/io5";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineContactPhone } from "react-icons/md";

const Nav = (props) => {

  const [t, i18n] = useTranslation("global")

  const [lang, setLang] = useState(0)
  const [showLang, setShowLang] = useState(false)
  const [kart, setKart] = useState(false)
  const [nav, setNav] = useState(false)
  const [item, setItem] = useState(null)
  const [price, setPrice] = useState(0)
  const storageData = props.storageData
  const setStorageData = props.setStorageData
  const itemStorage = localStorage.getItem("cards")
  const dataArr = JSON.parse(itemStorage)

  useEffect(() => {

    if (itemStorage === undefined || itemStorage === null) {
      setItem(0)
    }
    else if (storageData === null || storageData.length === 0) {
      setStorageData(dataArr)
      storageData.map((item) => {
        setPrice(item.price)
      })
    }
    else {
      const itemStore = JSON.parse(itemStorage)
      setItem(itemStore.length)
    }
  }, [storageData])


  const flag = [
    "https://www.loook.uz/assets/uz-5ba25708.svg",
    "https://www.loook.uz/assets/ru-94c1c1a4.svg",
    "https://www.loook.uz/assets/en-3885355b.svg"
  ]

  const handleLangChange = (lang) => {
    i18n.changeLanguage(lang)
  }

  const handleOpenCart = () => {
    let root = document.getElementsByTagName("html")[0]
    kart ? root.style.overflowY = "auto" : root.style.overflowY = "hidden"

    let totalPrice = 0;
    storageData.forEach((item) => {
      totalPrice += item.price;
    });
    setPrice(totalPrice);
    console.log(totalPrice);

    setKart(!kart);
    setShowLang(false)
    setNav(false)
  }

  const clearStorage = () => {
    localStorage.removeItem("cards")
    setStorageData([])
  }

  const handleRemove = (data, id) => {
    if (!Array.isArray(data)) {
      console.error('Data is not an array:', data);
      return;
    }

    const filterData = data.filter(item => item.id !== id);
    if (filterData.length === 0) {
      setStorageData([])
    }
    setStorageData(filterData)
    localStorage.setItem('cards', JSON.stringify(filterData));
  }

  const handleAddPrice = (item) => {
    console.log(item);
    const existingData = JSON.parse(localStorage.getItem("cards")) || [];
    const itemIndex = existingData.findIndex(dataItem => dataItem.id === item.id);

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
    localStorage.setItem("cards", JSON.stringify(existingData));
    localStorage.setItem("order", JSON.stringify({ order: false }))
  };

  const handleRemovePrice = (item) => {
    const existingData = JSON.parse(localStorage.getItem("cards")) || [];
    const itemIndex = existingData.findIndex(dataItem => dataItem.id === item.id);

    if (itemIndex > -1 && existingData[itemIndex].piece > 1) {
      existingData[itemIndex].piece -= 1;
      existingData[itemIndex].price -= Number(item.softPrice);

      setPrice(existingData.reduce((acc, curr) => acc + curr.price, 0));
      setStorageData(existingData);
      localStorage.setItem("cards", JSON.stringify(existingData));
    }
  };

  const getClass = ({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : "navlinks"

  const handleNav = () => {
    let root = document.getElementsByTagName("html")[0]
    root.style.overflowY = nav ? "auto" : "hidden"

    setNav(!nav)
    setShowLang(false)
  }

  return (
    <>
      <div className="w-[100%] sm:w-[100%] h-[90px] bg-[#c00a27] fixed flex flex-row justify-between px-[40px] sm:px-[20px] py-[20px] items-center z-10">
        <div className="w-[40%] lg:w-[70%] flex justify-between items-center">
          <Link to={"/"} className="w-[200px] h-[40px] sm:w-[100px] sm:h-[20px]">
            <img
              src="http://loook.uz/assets/loook-logo-5055c421.svg"
              className="object-cover"
              alt="" />
          </Link>
          <div className="w-[60%] sm:hidden md:hidden flex justify-evenly">
            <NavLink className={getClass} to={"/"}>{t("header.home")}</NavLink>
            <NavLink className={getClass} to={"/address"}>{t("header.branches")}</NavLink>
            <NavLink className={getClass} to={"/contact"}>{t("header.contact")}</NavLink>
          </div>
        </div>
        <div className="w-[20%] lg:w-[25%] flex items-center sm:hidden md:hidden">
          <div
            onClick={handleOpenCart}
            className="navlinks cursor-pointer">
            <div className="flex items-center text-[#fff] hover:text-[#ffae00] duration-200">
              <RiShoppingBagFill size={40} />
              <span className="ml-[10px] text-[20px] font-bold">{t("header.cart")}</span>
              <span className="w-[35px] h-[25px] rounded-[10px] text-center items-center bottom-[20px] right-[10px] relative bg-[#ffae00] m-auto text-[18px] font-semibold">{item}</span>
            </div>
          </div>
          <div
            onClick={() => setShowLang(!showLang)}
            className="w-[80%] m-auto flex cursor-pointer"
          >
            <img className="ml-auto" src={flag[lang]} alt="" />
            <img className={showLang ? "mr-auto transform rotate-180 duration-300" : "mr-auto duration-300"} src={arrowIcon} alt="" />
          </div>
          {showLang && (
            <dir className="w-[150px] h-[120px] absolute top-[60px] right-0 bg-[#ffae00] rounded-[8px] p-[6px] flex flex-col justify-around z-[999999]">
              <button
                onClick={() => { handleLangChange("uzb"), setLang(0), setShowLang(false) }}
                className="flex items-center">
                <img src={flag[0]} alt="" />
                <p className="ml-[20px] text-[#fff] text-[18px] font-medium hover:text-[#c00a27] hover:opacity-70 duration-200">{"O'zbekcha"}</p>
              </button>
              <button
                onClick={() => { handleLangChange("rus"), setLang(1), setShowLang(false) }}
                className="flex items-center">
                <img src={flag[1]} alt="" />
                <p className="ml-[20px] text-[#fff] text-[18px] font-medium hover:text-[#c00a27] hover:opacity-70 duration-200">{"Русский"}</p>
              </button>
              <button
                onClick={() => { handleLangChange("eng"), setLang(2), setShowLang(false) }}
                className="flex items-center">
                <img src={flag[2]} alt="" />
                <p className="ml-[20px] text-[#fff] text-[18px] font-medium hover:text-[#c00a27] hover:opacity-70 duration-200">{"English"}</p>
              </button>
            </dir>
          )}
        </div>
        <div className="sm:block md:block hidden">
          <IoMenu
            onClick={handleNav}
            className="sm:text-[30px] md:text-[40px]"
            color="#fff"
          />
        </div>
      </div>

      {nav && (
        <>
          <div className="w-[100%] h-[100vh] sm:block md:block hidden fixed top-0 left-0 z-20">
            <div onClick={handleNav} className="sm:w-[30%] h-[100%] md:w-[50%] backdrop-blur-md fixed top-0 left-0"></div>
            <div className="sm:w-[70%] h-[100%] md:w-[50%] bg-[#c00a27] fixed top-0 right-0">
              <div className="w-[100%] h-auto flex flex-col justify-between">
                <div className="py-[20px] pl-[20px]">
                  <IoClose
                    onClick={handleNav}
                    style={{ fontWeight: 'bold' }}
                    size={30}
                    color="#fff"
                  />
                </div>
                <div className="pb-[14px] pl-[20px]">
                  <div className="flex items-start">
                    <AiOutlineHome color={getClass === "active" ? "#ffae00" : "#fff"} size={32} />
                    <NavLink className={getClass} style={{ marginLeft: "20px" }} to={"/"}>{t("header.home")}</NavLink>
                  </div>
                </div>
                <div className="pb-[14px] pl-[20px]">
                  <div className="flex items-start">
                    <IoMapOutline color={getClass === "active" ? "#ffae00" : "#fff"} size={32} />
                    <NavLink className={getClass} style={{ marginLeft: "20px" }} to={"/address"}>{t("header.branches")}</NavLink>
                  </div>
                </div>
                <div className="pb-[14px] pl-[20px]">
                  <div className="flex items-start">
                    <MdOutlineContactPhone color={getClass === "active" ? "#ffae00" : "#fff"} size={32} />
                    <NavLink className={getClass} style={{ marginLeft: "20px" }} to={"/contact"}>{t("header.contact")}</NavLink>
                  </div>
                </div>
                <div className="w-[100%] flex flex-col pl-[20px]">
                  <div
                    onClick={handleOpenCart}
                    className="navlinks after:m-[0px] cursor-pointer sm:pb-[20px] md:pb-[30px]"
                  >
                    <div className="flex items-center text-[#fff] hover:text-[#ffae00] duration-200">
                      <RiShoppingBagFill size={30} />
                      <span className="ml-[10px] text-[20px] font-bold">{t("header.cart")}</span>
                      <span className="w-[35px] h-[25px] rounded-[10px] text-center items-center bottom-[0px] right-[60px] relative bg-[#ffae00] m-auto text-[18px] font-semibold">{item}</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setShowLang(!showLang)}
                    className="w-[100%] flex">
                    <div className="w-[24px] flex cursor-pointer">
                      <img className="ml-auto" src={flag[lang]} alt="" />
                    </div>
                    <div className="ml-[10px] text-[18px] text-[#fff]">{t("language.word")}</div>
                  </div>
                  {showLang && (
                    <dir className="w-[150px] h-[140px] relative rounded-[8px] p-[12px] flex flex-col justify-around z-[999999]">
                      <button
                        onClick={() => { handleLangChange("uzb"), setLang(0), setShowLang(false) }}
                        className="flex items-center">
                        <img src={flag[0]} alt="" />
                        <p className="ml-[20px] text-[#fff] text-[18px] font-medium hover:text-[#c00a27] hover:opacity-70 duration-200">{"O'zbekcha"}</p>
                      </button>
                      <button
                        onClick={() => { handleLangChange("rus"), setLang(1), setShowLang(false) }}
                        className="flex items-center">
                        <img src={flag[1]} alt="" />
                        <p className="ml-[20px] text-[#fff] text-[18px] font-medium hover:text-[#c00a27] hover:opacity-70 duration-200">{"Русский"}</p>
                      </button>
                      <button
                        onClick={() => { handleLangChange("eng"), setLang(2), setShowLang(false) }}
                        className="flex items-center">
                        <img src={flag[2]} alt="" />
                        <p className="ml-[20px] text-[#fff] text-[18px] font-medium hover:text-[#c00a27] hover:opacity-70 duration-200">{"English"}</p>
                      </button>
                    </dir>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {kart && (
        <>
          <div className={"w-[100%] h-[100vh] fixed z-50 flex flex-row"}>
            <div
              onClick={handleOpenCart}
              className="w-[65%] md:w-[50%] lg:w-[50%] backdrop-blur-[10px] sm:hidden">
            </div>

            <div className="w-[35%] sm:w-[100%] md:w-[50%] lg:w-[50%] bg-[#fff] p-[20px]">
              <div>
                <img
                  onClick={handleOpenCart}
                  className="w-[30px] ml-auto cursor-pointer"
                  src={closeImg}
                  alt=""
                />
              </div>
              {item === 0 && (
                <div className="w-[100%] h-[92%] flex flex-col justify-between">
                  <img className="mx-auto" src={searchIcon} alt="" />
                  <div>
                    <p className="text-[20px] font-medium text-[#84919a] text-center">{"Savat bo'sh!"}</p>
                    <p className="text-[20px] font-medium text-[#84919a] text-center">{"Savatingiz bo'sh, «Menyu» ni oching va o'zingizga yoqqan mahsulotni tanlang."}</p>
                  </div>
                  <button onClick={handleOpenCart} className="bg-[#c00a27] py-[10px] text-[20px] font-medium text-[#fff]">{"Savatga qo'shish"}</button>
                </div>
              )}
              {item !== 0 && (
                <div className="w-[100%] h-[92%] flex flex-col justify-between">
                  <div className="w-[100%] flex flex-col justify-between">
                    <div className="w-[100%] flex justify-between py-[10px]">
                      <h2 className="text-[22px] font-medium">Sizning savatingiz</h2>
                      <button
                        onClick={clearStorage}
                        className="text-[20px] font-medium text-[red]">Savatni tozalash</button>
                    </div>
                    <div className="w-[100%] h-[1px] bg-black"></div>
                  </div>
                  <div className="w-[100%] h-[200px] sm:h-[100%] flex flex-col my-[60px] overflow-y-auto">
                    {storageData.map(item => (
                      <Fragment key={item.id}>
                        <div className="w-[100%] flex flex-row justify-between items-center my-[20px]">
                          <div className="w-[50%] flex items-center">
                            {storageData.length >= 2 && (
                              <button className="ml-auto mr-[20px]">
                                <FaTrash
                                  onClick={() => handleRemove(storageData, item.id)}
                                  size={20}
                                  color="#323232"
                                  className="text-[#c00a27]"
                                />
                              </button>
                            )}
                            {storageData.length === 1 && (
                              <button className="ml-auto mr-[20px]">
                                <FaTrash
                                  onClick={() => { localStorage.removeItem("cards"), setStorageData([]) }}
                                  size={20}
                                  color="#323232"
                                  className="text-[#c00a27]"
                                />
                              </button>
                            )}
                            <div className="w-[100%] flex items-center justify-between">
                              <img className="w-[100px] h-[95px] sm:w-[80px] sm:h-[75px] object-cover" src={item.img} alt="" />
                              <p className="text-[16px] w-[100px] text-center font-thin">{item.name}</p>
                            </div>
                          </div>
                          <div className="w-[30%] items-center text-center">
                            <p className="text-[#c00a27]">{item.price} {t("price.value")}</p>
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
                      </Fragment>
                    ))}
                  </div>
                  <div className="w-[100%] mt-auto">
                    <p className="text-[40px] font-bold">Jami:
                      <span className="text-[#c00a27]">
                        {price} {t("price.value")}
                      </span>
                    </p>
                    <Link onClick={handleOpenCart} to={"/pay"} className="w-[100%] bg-[#c00a27] py-[10px] inline-block text-center text-[20px] font-medium text-[#fff]">Buyurtmani tasdiqlash</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {props.children}

    </>
  )
}

export default Nav