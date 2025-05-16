// src/App.js

'use client'

import React, { useState } from 'react';
import ProductList from './src/productList';
import ParallaxBackground from './components/ParallaxBackground';
import Image from 'next/image';
import VoucherList from './src/voucherList';

export default function app() {

  const [ isClickingDangKy, setIsClickingDangKy ] = useState( false ) 

  const handleClick = (event: any) => { 
   
    const formElement = document.getElementById('subscriptionForm');

    if (formElement) {
      formElement.onsubmit = function(event) {
        event.preventDefault();
        
        setIsClickingDangKy(true)
        // Ensure event.target is an HTMLFormElement
        const target = event.target as HTMLFormElement;
        const formData = new FormData(target); 
       
        fetch('https://script.google.com/macros/s/AKfycbwHTz3tbGaHS1AoAt-nNN-HFMKanqEc1Fs6txZGrk7OnpCO3Gg8LzGQS7OhWzj6YxfZCA/exec', {
          method: 'POST',
          body: formData,
        })
        .then(response => response.json())
        .then(data => {
          alert('BẠN ĐÃ ĐĂNG KÝ Nhận mã khuyến mãi thành công!');
          (formElement as HTMLFormElement).reset()          
          setIsClickingDangKy(false)
        })
        .catch(error => {
          alert('Error: ' + error);
        })
        .finally(() => {
          setIsClickingDangKy(false); // Re-enable the button after fetch is done
        });
      };
    }
  };

  
  return ( 

    <div className="container p-4 mx-auto shadow-lg">
      <ParallaxBackground />
      <div className="relative h-[600px] mb-8">
          <Image
            src="/images/background.webp"
            alt="Background"
            fill
            className="object-cover"
            quality={75}
            priority
          /> 
      </div>
 

      <div className="flex flex-col gap-2 p-4 mx-auto container-lg lg:flex-row">
        <div className= ""  > 
          <div className='p-2 text-white bg-pink-700 border rounded-lg'>
            <strong className="mb-4 text-2xl font-bold">NHẬN MÃ MIỄN PHÍ </strong>
          </div>
  
          <div className='flex justify-center m-4 text-sm'> 
            <div className="form-container-subscription"> 
              <form id="subscriptionForm">
                  <label htmlFor="name">Name / Tên: </label>
                  <input type="text" id="name" name="name" required />
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" name="email" required />
                  
                  <label htmlFor="phone">Phone / Số điện thoại: </label>
                  <input type="text" id="phone" name="phone" required /> 

                  <div className="text-center">
                    <button type="submit"  
                      disabled={ isClickingDangKy }
                      className="p-2 text-2xl text-white uppercase bg-green-600 hover:bg-green-400"
                     
                      onClick={ handleClick } >Đăng ký nhận </button>
                  </div>
              </form>
              <div className="message" id="message"></div>
            </div>
          </div> 

          <div className='p-2 text-white bg-pink-700 border rounded-lg '>
            <strong className="mb-4 text-2xl font-bold uppercase">Voucher miễn phí   </strong>
          </div>

          <VoucherList />
        </div> 

        <div className='grow-2'>
          <div className='p-2 text-white bg-pink-700 border rounded-lg '>
            <strong className="mb-4 text-2xl font-bold uppercase">Tiện ích gia đình - Tiện Ích Không Ngờ </strong>
          </div> 

          <ProductList  />
        </div>
      </div>

       <div className="relative h-[600px] mb-8 mt-8">
          <Image
            src="/images/footer.jpg"
            alt="Tien ich khong ngo"
            fill
            className="object-cover"
            quality={75}
            priority
          /> 
          </div>
    </div> 
  );
};