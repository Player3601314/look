import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import { useTranslation } from "react-i18next";

const Contact = () => {

  const [t, i18n] = useTranslation('global');

  return (
    <div className="w-[100%] pt-[100px]">
      <div className="w-[90%] h-[80vh] mx-auto rounded-[12px] bg-[#fff] flex sm:flex-col md:flex-col p-[25px] sm:h-auto md:h-auto">
        <div className="w-[48%] mr-auto sm:w-[100%] md:w-[100%]">
          <div>
            <h2 className="text-[40px] font-bold mb-[20px]">{t("contact.heading")}</h2>
            <div className="w-[80%] flex justify-between sm:flex-col mb-[20px]">
              <p className="text-[18px]">{t("contact.call")}</p>
              <p className="text-[18px] text-yellow-500">+998 99 999 99 99</p>
            </div>
            <hr className="w-[100%] h-[1px] bg-[#0000001f] my-[40px]" />
          </div>
          <div className="w-[100%] h-[40%] flex flex-col justify-between">
            <div className="w-[80%] flex justify-between sm:flex-col mb-[20px]">
              <p className="text-[18px]">{t("contact.officeAddres")}</p>
              <p className="w-[200px] text-[18px] text-[#5b6871] inline-block">{t("contact.addres")}</p>
            </div>
            <div className="w-[80%] flex justify-between sm:flex-col mb-[20px]">
              <p className="text-[18px]">{t("contact.officeTime")}</p>
              <p className="text-[18px] text-[#5b6871]">09:00 - 19:00</p>
            </div>
            <div className="w-[80%] flex justify-between sm:flex-col mb-[20px]">
              <p className="text-[18px]">{t("contact.email")}</p>
              <p className="text-[18px] text-yellow-500">{"example@gmail.com"}</p>
            </div>
          </div>
        </div>
        <div className="w-[48%] h-[100%] ml-auto sm:w-[100%] sm:h-[500px] sm:mt-[60px] md:w-[100%] md:h-[500px] md:mt-[60px]">
          <YMaps query={{ lang: 'uz_UZ' }}>
            <div className="w-[100%] h-[100%] mx-auto">
              <Map
                defaultState={{
                  center: [40.113477, 67.831586],
                  zoom: 18,
                }}
                modules={["control.ZoomControl", "control.FullscreenControl"]}
                width="100%"
                style={{ height: "100%" }}
              >
                <Placemark
                  geometry={[40.113477, 67.831586]}
                  options={{ iconColor: '#ff0000' }}
                />
              </Map>
            </div>
          </YMaps>
        </div>
      </div>
    </div>
  )
}
export default Contact