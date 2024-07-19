import { Pagination, Autoplay } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

import "./slider.css"
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export const Slider = () => {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      spaceBetween={50}
      slidesPerView={1}
      loop={true}
      autoplay={true}
      pagination={{ clickable: true }}
      className='w-[90%] m-auto h-[80vh] sm:h-[40vh]'
    >
      <SwiperSlide className='w-[100%] h-[100%] rounded-[18px]'>
        <img className='w-[100%] h-[100%] object-cover rounded-[18px]' src="http://look.uz/assets/homepage-slider-1-98ea9b48.jpg" alt="" />
      </SwiperSlide>
      <SwiperSlide className='w-[100%] h-[100%] rounded-[18px]'>
        <img className='w-[100%] h-[100%] object-cover rounded-[18px]' src="http://look.uz/assets/homepage-slider-2-058ad017.jpg" alt="" />
      </SwiperSlide>
      <SwiperSlide className='w-[100%] h-[100%] rounded-[18px]'>
        <img className='w-[100%] h-[100%] object-cover rounded-[18px]' src="http://look.uz/assets/homepage-slider-3-b840f884.jpg" alt="" />
      </SwiperSlide>
      <SwiperSlide className='w-[100%] h-[100%] rounded-[18px]'>
        <img className='w-[100%] h-[100%] object-cover rounded-[18px]' src="http://look.uz/assets/homepage-slider-4-3b760d92.jpg" alt="" />
      </SwiperSlide>
    </Swiper>
  );
};