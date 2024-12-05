import Image from "next/image"
import MlawGPTLogo from "../assets/MlawGPTLogo.svg"

const Header = () => {
  return (
    <header>
      <div className="shadow-xl py-5">
        <div className="container mx-auto">
          <Image src={MlawGPTLogo} width="100" alt="MlawGPT Logo"/>
        </div>
      </div>
    </header>
  )
}

export default Header