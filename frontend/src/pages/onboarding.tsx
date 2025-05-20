import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import slideImage1PC from '@/assets/onboarding/onboarding-pc-1.png';
import slideImage2PC from '@/assets/onboarding/onboarding-pc-2.png';
import slideImage3PC from '@/assets/onboarding/onboarding-pc-3.png';
import slideImage4PC from '@/assets/onboarding/onboarding-pc-4.png';
import slideImage5PC from '@/assets/onboarding/onboarding-pc-5.png';
import slideImage1Mobile from '@/assets/onboarding/onboarding-mobile-1.png';
import slideImage3Mobile from '@/assets/onboarding/onboarding-mobile-3.png';
import slideImage4Mobile from '@/assets/onboarding/onboarding-mobile-4.png';
import slideImage5Mobile from '@/assets/onboarding/onboarding-mobile-5.png';

import OnboardingSlide from '@/components/\bonboarding/OnboardingSlide';
import { useResponsive } from '@/hooks/use-mobile';
import usePatchRegister from '@/hooks/queries/auth/usePatchRegister';

const paginationStyle = {
  position: 'absolute',
  top: '50px',
  bottom: 'auto',
  left: '0',
  right: '0',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  zIndex: 20,
};
const OnboardingPage = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const { isMobile } = useResponsive();
  const { patchUserRegisterMutation } = usePatchRegister();

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
  };

  const goToToday = () => {
    patchUserRegisterMutation(undefined, {
      onSuccess: () => {
        navigate('/today');
      },
    });
  };

  const slides = [
    {
      title: '머릿속 생각, 바로 버블로',
      description: '머릿속 복잡한 생각을 쓰면 \n AI가 버블로 쪼개줘요',
      imagePc: slideImage1PC,
      imageMobile: slideImage1Mobile,
      hideBorder: false,
    },
    {
      title: '버블 속 생각을 확장해요',
      description: 'AI 추천 질문으로 \n 생각을 더 구체화해요',
      imagePc: slideImage2PC,
      imageMobile: slideImage2PC,
      hideBorder: false,
    },
    {
      title: '버블에서 바로 일정으로',
      description:
        '중요도와 긴급도를 기준으로 \n 일정의 우선순위를 정리할 수 있어요',
      imagePc: slideImage3PC,
      imageMobile: slideImage3Mobile,
      hideBorder: true,
    },
    {
      title: '중요한 생각, 보관함에 쏙',
      description: '중요한 생각은 보관함에 \n 저장해 언제든 꺼내보세요 ',
      imagePc: slideImage4PC,
      imageMobile: slideImage4Mobile,
      hideBorder: false,
    },
    {
      title: '필요없는 버블은 pop!',
      description:
        '필요없는 버블은 삭제해 깔끔하게 \n 다 정리하면 축하 메시지가 짠!',
      imagePc: slideImage5PC,
      imageMobile: slideImage5Mobile,
      hideBorder: false,
    },
  ];

  const isLastSlide = (index) => index === slides.length - 1;

  return (
    <div className="w-full h-[100dvh] bg-[#F0F0F5] relative overflow-hidden">
      {!isLastSlide(activeIndex) && (
        <button
          onClick={goToToday}
          className="absolute top-6 right-6 text-gray-500 text-sm z-20"
        >
          건너뛰기
        </button>
      )}

      <Swiper
        modules={[Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          el: '.swiper-custom-pagination',
        }}
        onSlideChange={handleSlideChange}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <OnboardingSlide
              title={slide.title}
              description={slide.description}
              imageUrl={isMobile ? slide.imageMobile : slide.imagePc}
              isLastSlide={isLastSlide(index)}
              onClickToday={goToToday}
              hideBorder={slide.hideBorder}
            />
          </SwiperSlide>
        ))}

        <div className="swiper-custom-pagination" style={paginationStyle}></div>
      </Swiper>
    </div>
  );
};

export default OnboardingPage;
