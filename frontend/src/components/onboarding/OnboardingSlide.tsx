import { cn } from '@/lib/utils';

type OnboardingSlideProps = {
  title: string;
  description: string;
  imageUrl: string;
  isLastSlide: boolean;
  onClickToday: () => void;
  hideBorder?: boolean;
};

const OnboardingSlide = ({
  title,
  description,
  imageUrl,
  isLastSlide,
  onClickToday,
  hideBorder = false,
}: OnboardingSlideProps) => {
  return (
    <div className="flex flex-col items-center w-full h-full px-[50px] md:px-[250px] pt-[100px] md:pt-[130px]">
      <div className="flex flex-col items-center text-center gap-[10px] mb-10">
        <h2 className="text-[24px] md:text-[32px] text-gray-scale-700 font-semibold">
          {title}
        </h2>
        <p className="text-[20px] md:text-[24px] text-gray-scale-700 whitespace-pre-line">
          {description}
        </p>
      </div>

      <div
        className={cn(
          'w-[307px] h-[559px] md:w-[940px] md:h-[612px] rounded-t-3xl overflow-hidden mt-auto',
          hideBorder
            ? 'overflow-visible w-[307px] h-[600px] md:w-[959px] md:h-[612px]'
            : 'border border-gray-scale-400 overflow-hidden',
        )}
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {isLastSlide && (
        <div className="absolute bottom-0 w-full flex justify-center">
          <button
            onClick={onClickToday}
            className="w-full md:max-w-[940px] bg-blue text-white px-6 py-4 hover:bg-blue-400 cursor-pointer"
          >
            <p className="text-[16px]">생각정리, 지금 시작해볼까요?</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default OnboardingSlide;
