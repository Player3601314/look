import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import Nav from "./components/Nav/Nav"
import Footer from "./components/Footer/Footer"
import Admin from "./admin/Admin"
import { useContext, useState } from "react"
import CreateCard from "./admin/CreateCard"
import SignAdmin from "./admin/SignAdmin"
import Pay from "./pages/Pay"
import { AuthContext } from "./context/AuthContext"
import NavNavigate from "./components/NavNavigate/NavNavigate"
import Order from "./admin/Order/Order"

function App() {

  const [storageData, setStorageData] = useState([])

  const { currentUser } = useContext(AuthContext)
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to={"/"} />
  }

  return (
    <>
      <Routes>
        <Route path="/" element={
          <Nav storageData={storageData} setStorageData={setStorageData}>
            <NavNavigate>
              <HomePage storageData={storageData} setStorageData={setStorageData} />
            </NavNavigate>
            <Footer />
          </Nav>
        } />
        <Route path="pay" element={
          <Nav storageData={storageData} setStorageData={setStorageData}>
            <Pay storageData={storageData} setStorageData={setStorageData} />
          </Nav>
        } />

        <Route path="/admin" element={
          <RequireAuth>
            <Admin storageData={storageData} setStorageData={setStorageData} />
          </RequireAuth>
        } />
        <Route path="/admin/create" element={
          <RequireAuth>
            <CreateCard />
          </RequireAuth>
        } />
        <Route path="/adminsign" element={
          <SignAdmin />
        } />

        <Route path="/order" element={
          <RequireAuth>
            <Order storageData={storageData} setStorageData={setStorageData} />
          </RequireAuth>
        } />
      </Routes>
    </>
  )
}

export default App
