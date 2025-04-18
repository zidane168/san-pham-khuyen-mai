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

      <div className="container p-4 mx-auto">
        <div className='p-2 text-white bg-pink-700 border rounded-lg '>
          <strong className="mb-4 text-2xl font-bold uppercase">Voucher miễn phí vô hạn - Tiện Ích Không Ngờ ({pagination?.count || 0})</strong>
        </div>

        <ul className="grid grid-cols-1 gap-4 shadow-lg md:grid-cols-2 lg:grid-cols-2">
          {
          vouchers.map((v: Voucher, index: number) => (
            <li key={ index } className="p-4 rounded-lg ">
              <div className='p-2 mb-2 text-white bg-blue-700 rounded-md shadow-xl/30'>
                <strong className="mb-2 text-xl font-semibold uppercase">{v.title}</strong>
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

        <div className='p-2 text-white bg-pink-700 border rounded-lg '>
          <strong className="mb-4 text-2xl font-bold uppercase">Tiện ích gia đình - Tiện Ích Không Ngờ ({pagination?.count || 0})</strong>
        </div>
    
        <ul className="grid grid-cols-1 gap-4 shadow-lg md:grid-cols-2 lg:grid-cols-2">
          {
          items.map((product: Product, index: number) => (
            <li key={ index } className="p-4 rounded-lg ">
              <div className='p-2 mb-2 text-white bg-blue-700 rounded-md shadow-xl/30'>
                <strong className="mb-2 text-xl font-semibold uppercase">{product.title}</strong>
              </div>
              {/* <div 
                className="mb-4 text-gray-600"
                dangerouslySetInnerHTML={{ __html: product.description }}
              /> */}
              <div className="space-x-2 space-y-2">


                {product.videoLink && (

                  <VideoEmbed url={ product.videoLink } />
                  // <a
                  //   href={product.videoLink}
                  //   target="_blank"
                  //   rel="noopener noreferrer"
                  //   className="block text-blue-600"
                  // >
                  //   Watch Video
                  // </a>
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