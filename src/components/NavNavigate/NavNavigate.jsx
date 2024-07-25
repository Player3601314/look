import { Fragment } from 'react'

const NavNavigate = (props) => {
  const menu = [
    {
      img: "https://firebasestorage.googleapis.com/v0/b/king-burger-15159.appspot.com/o/icons%2FAPPETIZERS.png?alt=media&token=56880568-b814-433b-ba88-8f4978e3239f",
      name: "APPETIZ",
      link: "appetizers"
    },
    {
      img: "https://firebasestorage.googleapis.com/v0/b/king-burger-15159.appspot.com/o/icons%2FBURGERS.png?alt=media&token=5edef084-38a0-4afd-8861-b1dac49905a3",
      name: "BURGER",
      link: "burger"
    },
    {
      img: "https://firebasestorage.googleapis.com/v0/b/king-burger-15159.appspot.com/o/icons%2FCHICKEN.png?alt=media&token=9e70cc88-a596-4983-878d-0748b69e235a",
      name: "CHICKEN",
      link: "chicken"
    },
    {
      img: "https://firebasestorage.googleapis.com/v0/b/king-burger-15159.appspot.com/o/icons%2FDESSERTS.png?alt=media&token=ca93c879-f758-43fc-9b12-18e78eee1339",
      name: "DESERTS",
      link: "desert"
    },
    {
      img: "https://firebasestorage.googleapis.com/v0/b/king-burger-15159.appspot.com/o/icons%2FDRINKS.png?alt=media&token=91d8b471-0236-45df-b64e-f1166c3b20f9",
      name: "DRINKS",
      link: "drinks"
    },
    {
      img: "https://firebasestorage.googleapis.com/v0/b/king-burger-15159.appspot.com/o/icons%2FKIDS.png?alt=media&token=6a72a192-fce1-481d-b6c7-bc0063f9cfd0",
      name: "KIDS",
      link: "kids"
    },
    {
      img: "https://firebasestorage.googleapis.com/v0/b/king-burger-15159.appspot.com/o/icons%2FPIZZA.png?alt=media&token=9002738e-4a7d-41a2-a26b-e3b8436564d4",
      name: "PIZZA",
      link: "pizza"
    },
    {
      img: "https://firebasestorage.googleapis.com/v0/b/king-burger-15159.appspot.com/o/icons%2FSPINNER.png?alt=media&token=edd972bc-8af5-4e01-89db-e904d92f0d33",
      name: "SPINNER",
      link: "spinner"
    },
    {
      img: "https://firebasestorage.googleapis.com/v0/b/king-burger-15159.appspot.com/o/icons%2FSALADS.png?alt=media&token=2d02da80-7bf7-4567-a7ad-f39f51a0ae77",
      name: "SALADS",
      link: "salads"
    },
    {
      img: "https://firebasestorage.googleapis.com/v0/b/king-burger-15159.appspot.com/o/icons%2FCOMBO.png?alt=media&token=0be546af-c1a0-4b09-8e82-4bfe2ab9ee6b",
      name: "COMBO",
      link: "combo"
    },
    {
      img: "https://firebasestorage.googleapis.com/v0/b/king-burger-15159.appspot.com/o/icons%2FSAUCE.png?alt=media&token=a70829b6-1bad-45b6-8536-74b0398262df",
      name: "SAUCE",
      link: "sauce"
    },
  ]

  const scrollToSection = (link) => {
    const section = document.getElementById(link);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div>
      <div className="w-[95%] h-[100px] rounded-[10px] mx-auto items-center fixed top-[100px] left-[30px] backdrop-blur-[10px] flex justify-around z-[2] sm:px-[0px] sm:w-[100%] sm:left-0 sm:overflow-x-scroll overflowNavigate md:px-[30px] md:w-[100%] md:left-0 md:overflow-x-scroll lg:px-[20px] lg:w-[90%] lg:overflow-x-scroll">
        {menu.map((data, index) => (
          <Fragment key={index}>
            <div
              onClick={() => scrollToSection(data.link)}
              className="w-[100px] h-[80px] text-center items-center text-[14px] bg-[#fff] rounded-[8px] flex flex-col justify-between p-[4px] 
              sm:w-[100px] sm:mr-[10px] sm:ml-[10px] sm:px-[20px]
              md:w-[100px] md:mr-[10px] md:ml-[10px] md:px-[20px] 
              lg:w-[100px] lg:mr-[10px] lg:ml-[10px] lg:px-[20px]">
              <img className="w-[35px] h-[35px] m-auto object-cover" src={data.img} alt="" />
              <p>{data.name}</p>
            </div>
          </Fragment>
        ))}
      </div>
      {props.children}
    </div>
  )
}

export default NavNavigate