import React from "react";
import { assets as adminAssets } from "../../assets/assets_admin/assets";
import { assets as frontendAssets } from "../../assets/assets_frontend/assets";
const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/*----------Left------------*/}
        <div>
         { <img className="mb-5 w-40 " src={frontendAssets.logo} alt="" />}
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste ea
            nemo corporis ratione omnis nam, aspernatur porro laudantium ipsum!
            Sint nobis aut dolor nemo nostrum enim quibusdam, ipsum explicabo
            deserunt.
          </p>
        </div>
        {/*----------Center------------*/}
        <div>
        
        <p className="text-xl font-medium mb-5">Company</p>
        <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Privacy policy</li>
        </ul>


        </div>
        {/*----------Right------------*/}
        <div >
            <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
            <ul className="flex flex-col gap-2  text-gray-600">
                <li>+1-212-456-7890</li>
                <li>greatstackdev@gmail.com</li>
            </ul>
        </div>
      </div>
        {/*----------COPY RIGHT------------*/}
        <div>
            <hr/>
            <p className="py-5 text-sm text-center">Copyright 2026@ Prescripto - All Right Reserved</p>
        </div>
    </div>
  );
};

export default Footer;
