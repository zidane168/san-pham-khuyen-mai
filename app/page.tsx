'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { fetchProducts } from './features/productSlice';
import { Product, Voucher } from './types';
import Image from 'next/image';
import ParallaxBackground from './components/ParallaxBackground';
import { fetchVouchers } from './features/voucherSlice';
 
// YouTube embed component
const VideoEmbed = ({ url }: { url: string }) => {
  const getVideoId = (link: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = link.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(url);

  if (!videoId) return <div>Invalid video URL</div>;

  return (
    <div className="w-full aspect-video">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="rounded-lg"
        allowFullScreen
      />
    </div>
  );
};


export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error, pagination } = useSelector((state: any) => state.products);
  const { vouchers } = useSelector((state: any) => state.vouchers);
  const [page, setPage] = useState(1);

  // search step1
  const [ query, setQuery ] = useState('');

  // search step2: filter (call api)
  const filterItems = items.filter( (product: Product )  => product.title.toLowerCase().includes(query.toLowerCase())  || product.description.toLowerCase().includes(query.toLowerCase()) )
  
  // search step3: handleSearch
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const initialLoadDone = useRef(false);

  // Modified fetch function with limit
  const loadProducts = useCallback( (pageNumber: number, limit: number = 3) => { 
      dispatch(fetchProducts({ page: pageNumber, limit }));  
    },
    [dispatch]
  );

  const loadVouchers = useCallback( (pageNUmber: number, limit: number = 10) => {
      dispatch(fetchVouchers({ page: pageNUmber, limit} ))
    },
    [ dispatch ]
  ) 

  // Initial load for first 3 items
  useEffect(() => {
    if (!initialLoadDone.current) {
      loadProducts(1, 100);
      loadVouchers(1, 100)
      initialLoadDone.current = true;
    }
  }, [loadProducts]);

  // Scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100 &&
      status !== 'loading' &&
      pagination?.totalPage &&
      page < pagination.totalPage
    ) {
      // console.log( 'load tiep 3 san pham nè ')
      const nextPage = page + 1;
      setPage(nextPage);
      loadProducts(nextPage, 4); // Load 4 more items
    }
  }, [page, status, pagination, loadProducts]);

  // Scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleClick = (event: any) => { 

    const formElement = document.getElementById('subscriptionForm');

    if (formElement) {
      formElement.onsubmit = function(event) {
        event.preventDefault();
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
        })
        .catch(error => {
          alert('Error: ' + error);
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

      <input
            type="text"
            value={query}
            onChange={handleSearch}
            className="w-full p-2 bg-white border-none rounded-md shadow-lg"
            placeholder="Tìm sản phẩm / Search products"
          />
      

      <div className="flex flex-col gap-2 p-4 mx-auto container-lg lg:flex-row">
        <div className={ filterItems.length == 0 ? "max-w-[450px]" : ""  } > 
          <div className='p-2 text-white bg-pink-700 border rounded-lg'>
            <strong className="mb-4 text-2xl font-bold">NHẬN MÃ MIỄN PHÍ/GET FREE</strong>
          </div>
  
          <div className='flex justify-center m-4 text-sm'> 
            <div className="form-container-subscription"> 
              <form id="subscriptionForm">
                  <label htmlFor="name">Name / Tên </label>
                  <input type="text" id="name" name="name" required />
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" name="email" required />
                  
                  <label htmlFor="phone">phone / Số điện thoại </label>
                  <input type="text" id="phone" name="phone" required /> 

                  <input type="submit" value="Đăng ký nhận mã khuyển mãi" onClick={ handleClick } />
              </form>
              <div className="message" id="message"></div>
            </div>
          </div> 

          <div className='p-2 text-white bg-pink-700 border rounded-lg '>
            <strong className="mb-4 text-2xl font-bold uppercase">Voucher miễn phí vô hạn  </strong>
          </div>

          <ul className="shadow-lg ">
            {
            vouchers.map((v: Voucher, index: number) => (
              <li key={ index } className="p-4 rounded-lg ">
                <div className='p-2 mb-2 text-white bg-blue-700 rounded-md shadow-xl/30'>
                  <strong className="mb-2 font-semibold uppercase text-md">{v.title}</strong>
                </div> 
                <div className="space-x-2 space-y-2"> 
                  {v.videoLink && ( 
                    <VideoEmbed url={ v.videoLink } /> 
                  )}

                  {
                    !v.videoLink && v.description && ( 
                      <div className='p-4 border-4 border-blue-800 rounded-lg shadow-2xl bg-amber-100' dangerouslySetInnerHTML = {{ __html: v.description }}   />
                    )
                  } 
  
                {v.voucherLink && (
                    <a
                    href={v.voucherLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white uppercase transition-all duration-300 transform shadow-lg bg-gradient-to-r from-green-500 to-blue-500 rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-amber-100 hover:bg-gradient-to-br group"
                  >
                    {/* Animated border */}
                    <span className="absolute inset-0 transition-all duration-300 rounded-xl -z-10 bg-gradient-to-r from-green-500 to-blue-500 blur-sm group-hover:blur-md group-hover:opacity-75"></span>
                    
                    {/* Button content */}
                    <span className="relative tracking-wider">
                      Lấy Mã/Free Voucher
                    </span>
                    
                    {/* Animated arrow icon */}
                    <svg
                      className="relative w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      ></path>
                    </svg>
                  </a>
                  )}
                </div>
              </li>
            ))}
          </ul>  
        </div> 
        
        <div className='lg:grow-8'>    
          <div className='p-2 text-white bg-pink-700 border rounded-lg '>
            <strong className="mb-4 text-2xl font-bold uppercase">Tiện ích gia đình - Tiện Ích Không Ngờ </strong>
          </div> 

          { filterItems.length == 0 &&  ( 
              <div className="text-[20px] text-blue-700 font-bold flex flex-col h-full p-2 mt-2 text-center bg-white rounded-md">
                <div> KHÔNG TÌM THẤY SẢN PHẨM PHÙ HỢP </div>
                <div> PRODUCTS NOT BE FOUND </div>
              </div> 
            ) 
          }

          <ul className="grid grid-cols-1 gap-4 shadow-lg lg:grid-cols-2">
            {

            filterItems.map((product: Product, index: number) => (
              <li key={ index } className="p-4 rounded-lg ">
                <div className='p-2 mb-2 text-white bg-blue-700 rounded-md shadow-xl/30'>
                  <strong className="mb-2 text-lg font-semibold uppercase">{product.title}</strong>
                </div> 
                <div className="space-x-2 space-y-2">  
                  {product.videoLink && ( 
                    <VideoEmbed url={ product.videoLink } />
                  )}

                  {
                    !product.videoLink && product.description && ( 
                      <div className='p-4 border-4 border-blue-800 rounded-lg shadow-2xl bg-amber-100' dangerouslySetInnerHTML = {{ __html: product.description }}   />
                    )
                  } 

                  {product.affiliateLink && (
                  <a
                    href={product.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white uppercase transition-all duration-300 transform shadow-lg bg-gradient-to-r from-amber-500 to-red-500 rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-amber-100 hover:bg-gradient-to-br group"
                  >
                    {/* Animated border */}
                    <span className="absolute inset-0 transition-all duration-300 rounded-xl -z-10 bg-gradient-to-r from-amber-500 to-red-500 blur-sm group-hover:blur-md group-hover:opacity-75"></span>
                    
                    {/* Button content */}
                    <span className="relative tracking-wider">
                      MUA NGAY - Limited Offer
                    </span>
                    
                    {/* Animated arrow icon */}
                    <svg
                      className="relative w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      ></path>
                    </svg>
                  </a>
                  )} 

                {product.voucherLink && (
                    <a
                    href={product.voucherLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white uppercase transition-all duration-300 transform shadow-lg bg-gradient-to-r from-green-500 to-blue-500 rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-amber-100 hover:bg-gradient-to-br group"
                  >
                    {/* Animated border */}
                    <span className="absolute inset-0 transition-all duration-300 rounded-xl -z-10 bg-gradient-to-r from-green-500 to-blue-500 blur-sm group-hover:blur-md group-hover:opacity-75"></span>
                    
                    {/* Button content */}
                    <span className="relative tracking-wider">
                      Lấy Voucher - Get Free Voucher
                    </span>
                    
                    {/* Animated arrow icon */}
                    <svg
                      className="relative w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      ></path>
                    </svg>
                  </a>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {status === 'loading' && (
            <div className="flex justify-center my-8">
              <div className="w-8 h-8 border-b-2 border-gray-600 rounded-full animate-spin"> </div>
            </div>
          )}

          {status === 'failed' && (
            <div className="my-4 text-center text-red-500">Error: {error}</div>
          )}

          {pagination?.totalPage === page && items.length > 0 && (
            <div className="mt-8 text-center text-gray-500">          
              Đã hiển thị sản phẩm cuối cùng!
            </div>
          )}  

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
}