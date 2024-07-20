import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps"

const Addres = () => {
  return (
    <div>
      <YMaps query={{ lang: 'uz_UZ' }}>
        <div className="w-[90%] mx-auto pt-[100px]">
          <Map
            defaultState={{
              center: [40.113477, 67.831586],
              zoom: 18,
            }}
            modules={["control.ZoomControl", "control.FullscreenControl"]}
            width="100%"
            height="80vh"
          >
            <Placemark
              geometry={[40.113477, 67.831586]}
              options={{ iconColor: '#ff0000' }}
            />
          </Map>
        </div>
      </YMaps>
    </div>
  )
}
export default Addres