import { useTranslation } from "react-i18next"
import { FaFacebookSquare, FaTwitter } from "react-icons/fa"
import { RiInstagramFill } from "react-icons/ri"
import { Link } from "react-router-dom"

const Footer = () => {

    const [t, i18n] = useTranslation("global")

    return (
        <div className="w-[100%] h-[40vh] relative top-[250px] bg-[#c00a27] py-[40px] px-[120px]">
            <div className="w-[100%] h-[100%] m-auto flex justify-between items-center">
                <div className="w-[200px] h-[40px]">
                    <Link to={"/adminsign"}><img className="w-[100%] h-[100%]" src="http://look.uz/assets/loook-logo-5055c421.svg" alt="" /></Link>
                </div>
                <div className="flex w-[200px] text-[#ffae00] justify-evenly m-auto">
                    <Link target="_blank" to={"/"}>
                        <FaTwitter className="hover:text-[#fff]" size={40} />
                    </Link>
                    <Link target="_blank" to={"/"}>
                        <FaFacebookSquare className="hover:text-[#fff]" size={40} />
                    </Link>
                    <Link target="_blank" to={"https://www.instagram.com/sultan_food_uz/"}>
                        <RiInstagramFill className="hover:text-[#fff]" size={40} />
                    </Link>
                </div>
                <div className="text-[#fff] hover:text-[#ffae00] text-[20px] font-medium">
                    <Link target="_blank" to={"https://t.me/web_user_1109"}>{t("created.creater")}</Link>
                </div>
            </div>
        </div>
    )
}

export default Footer