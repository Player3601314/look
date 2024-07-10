import Appetizers from "../components/Foods/Appetizers/Appetizers"
import Burger from "../components/Foods/Burger/Burger"
import Chicken from "../components/Foods/Chicken/Chicken"
import Combo from "../components/Foods/Combo/Combo"
import Desert from "../components/Foods/Desert/Desert"
import Drinks from "../components/Foods/Drinks/Drinks"
import Kids from "../components/Foods/Kids/Kids"
import Pizza from "../components/Foods/Pizza/Pizza"
import Salads from "../components/Foods/Salads/Salads"
import Sauce from "../components/Foods/Sauce/Sauce"
import Spinner from "../components/Foods/Spinner/Spinner"
import { Slider } from "../components/Slider/Slider"

const HomePage = ({ storageData, setStorageData }) => {
  return (
    <div className="relative top-[250px]">
      <Slider />
      <Appetizers storageData={storageData} setStorageData={setStorageData} />
      <Burger storageData={storageData} setStorageData={setStorageData} />
      <Chicken storageData={storageData} setStorageData={setStorageData} />
      <Desert storageData={storageData} setStorageData={setStorageData} />
      <Drinks storageData={storageData} setStorageData={setStorageData} />
      <Kids storageData={storageData} setStorageData={setStorageData} />
      <Pizza storageData={storageData} setStorageData={setStorageData} />
      <Spinner storageData={storageData} setStorageData={setStorageData} />
      <Salads storageData={storageData} setStorageData={setStorageData} />
      <Combo storageData={storageData} setStorageData={setStorageData} />
      <Sauce storageData={storageData} setStorageData={setStorageData} />
    </div>
  )
}

export default HomePage