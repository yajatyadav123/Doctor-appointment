import React from "react";
import { AppContext } from "../context/AppContext";
import { assets as frontendAssets } from "../assets/assets_frontend/assets";
const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          About <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>
 
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img className="w-full md:max-w-[360px]" src={frontendAssets.about_image} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            At Prescripto, we are committed to transforming the way people
            access healthcare. Our platform allows you to discover experienced
            doctors, book appointments effortlessly, and manage your healthcare
            needs with confidence, all from one convenient place.
          </p>

          <p>
            We believe quality healthcare should be accessible to everyone. From
            scheduling consultations to maintaining a seamless patient
            experience, Prescripto ensures that your health remains our top
            priority every step of the way.
          </p>
          <b className="text-gray-800">Our vision</b>
          <p>
            Our vision is to make quality healthcare accessible, convenient, and
            affordable for everyone. We strive to bridge the gap between
            patients and healthcare professionals by providing a seamless
            digital platform that simplifies appointment booking and improves
            the overall healthcare experience.
          </p>
        </div>
      </div>
       <div className="text-xl my-4">
           <p>Why <span className="text-gray-700  font-semibold">Choose Us</span></p>
       </div>
       <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white  transition-all duration-300 text-gray-600 cursor-pointer ">
         <b>Efficiency</b>
         <p>Streamlined appointment scheduling that fits into your busy lifestyle </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white  transition-all duration-300 text-gray-600 cursor-pointer ">
          <b>Convenience</b>
          <p>Access to a network trusted healthcare professionals in your area</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white  transition-all duration-300 text-gray-600 cursor-pointer ">
          <b>Personalization</b>
          <p>Tailored recommendations and reminders to help you to stay on top of your health</p>
        </div>
       </div>


    </div>
  );
};

export default About;
