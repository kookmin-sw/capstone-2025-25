import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { Plus, ChevronDown, ChevronUp, Timer, RotateCw } from 'lucide-react';
import { useState, useEffect, ChangeEvent } from 'react';
import { MultiSlider } from '@/components/ui/MultiSlider.tsx';
import { PomodoroCycle, Eisenhower } from '@/types/pomodoro';
import { Input } from '@/components/ui/Input.tsx';

type Props = {
  linkedEisenhower?: Eisenhower;
};

export default function AddPomodoro({ linkedEisenhower }: Props) {
  const [title, setTitle] = useState('');
  const [page, setPage] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [cycleValue, setCycleValue] = useState<PomodoroCycle[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // 슬라이더 값 포맷팅
  const formatSliderLabel = (value: number, index: number) => {
    if (index === 0) return '시작';
    if (index === generateSliderValuesFromTime(hours, minutes).length * 2 + 1)
      return '종료';

    const isEven = index % 2 === 0;
    const cycleIndex = Math.floor(index / 2);
    const type = isEven ? '휴식' : '집중';

    return `${type} ${isEven ? cycleIndex : cycleIndex + 1}`;
  };

  // 세션 간격 추천
  const generateSliderValuesFromTime = (hours: number, minutes: number) => {
    const totalMinutes = hours * 60 + minutes;
    const values: { workDuration: number; breakDuration: number | null }[] = [];
    let remainingTime = totalMinutes;

    // workDuration 25분, breakDuration 5분으로 기본 구성
    while (remainingTime > 0) {
      if (remainingTime > 30) {
        values.push({ workDuration: 25, breakDuration: 5 });
        remainingTime -= 30; // 집중 25분 + 휴식 5분씩 차감
      } else {
        values.push({ workDuration: remainingTime, breakDuration: null });
        remainingTime = 0;
      }
    }

    return values;
  };

  useEffect(() => {
    setTotalTime(hours * 60 + minutes);
    const newSliderValues = generateSliderValuesFromTime(hours, minutes);
    setCycleValue(newSliderValues);
  }, [hours, minutes, page]);

  //시간 설정
  const handleTimeChange = (
    direction: 'up' | 'down',
    unit: 'hours' | 'minutes',
  ) => {
    if (unit === 'hours') {
      if (direction === 'up') {
        setHours((prev) => Math.min(prev + 1, 24));
      } else {
        setHours((prev) => Math.max(prev - 1, 0));
      }
    } else {
      if (direction === 'up') {
        if (minutes === 59) {
          setMinutes(0);
          setHours((prev) => Math.min(prev + 1, 24));
        } else {
          setMinutes((prev) => prev + 1);
        }
      } else {
        if (minutes === 0) {
          if (hours > 0) {
            setMinutes(59);
            setHours((prev) => prev - 1);
          }
        } else {
          setMinutes((prev) => prev - 1);
        }
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  //모달 닫으면 입력 데이터 초기화 되도록
  const resetStates = () => {
    setTitle('');
    setHours(0);
    setMinutes(0);
    setPage(0);
  };

  const createPomodoro = () => {
    // 생성 api 추가
    setModalOpen(false);
    resetStates();
  };

  return (
    <Modal
      trigger={<Plus size={24} className="cursor-pointer" />}
      isOpen={modalOpen}
      title="뽀모도로 설정하기"
      description={`일정의 예상 시간을 입력해주세요.
      뽀모도로 기법을 바탕으로 집중 및 휴식시간을 제안해드려요.`}
      onOpenChange={(open) => {
        setModalOpen(!modalOpen);
        if (!open) {
          resetStates();
        }
      }}
      footer={
        <div className="w-full flex justify-end">
          {page === 0 ? (
            <Button
              className="px-8"
              onClick={() => setPage(1)}
              disabled={hours == 0 && minutes == 0}
            >
              다음
            </Button>
          ) : (
            <div className="flex w-full justify-between gap-4">
              <Button
                variant="white"
                className="px-8 flex-1"
                onClick={() => {
                  setPage(0);
                }}
              >
                뒤로가기
              </Button>
              <Button className="px-8 w-full flex-1" onClick={createPomodoro}>
                다음
              </Button>
            </div>
          )}
        </div>
      }
    >
      {/*시간 설정 파트*/}
      {page === 0 && (
        <div className="flex flex-col gap-[33px]">
          {linkedEisenhower?.id ? (
            <div className="h-[153px] border-1">컴포넌트로</div>
          ) : (
            <div>
              <label className="text-[14px] block mb-2">뽀모도로 이름</label>
              <Input
                placeholder="주제를 입력하세요"
                value={title}
                onChange={handleInputChange}
                onClick={(e) => e.stopPropagation()}
                className="h-12"
              />
            </div>
          )}
          <div className="flex justify-center items-center gap-[30px]">
            <div className="flex items-center gap-[10px]">
              <div className="flex flex-col items-center gap-6">
                <button
                  onClick={() => handleTimeChange('up', 'hours')}
                  className=" text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  <ChevronUp className="h-5 w-5" />
                </button>
                <div className="text-[28px] font-semibold w-12 text-center">
                  {hours}
                </div>
                <button
                  onClick={() => handleTimeChange('down', 'hours')}
                  className=" text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
              <div className="text-[16px] text-gray-800">hr</div>
            </div>
            <div className="flex items-center">
              <div className="flex flex-col items-center gap-6">
                <button
                  onClick={() => handleTimeChange('up', 'minutes')}
                  className=" text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  <ChevronUp className="h-5 w-5" />
                </button>
                <div className="text-[28px] font-semibold w-12 text-center">
                  {minutes}
                </div>
                <button
                  onClick={() => handleTimeChange('down', 'minutes')}
                  className=" text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
              <div className="text-[16px]text-gray-800">min</div>
            </div>
          </div>
        </div>
      )}
      {page === 1 && (
        <>
          <div className="flex flex-col gap-[33px]">
            {linkedEisenhower?.id ? (
              <div className="h-[153px] border-1"></div>
            ) : (
              <div className="flex px-4 py-4 border-1 border-[#E5E5E5] gap-2.5 rounded-[10px]">
                <Timer className="text-primary-100" />
                <p className="text-[16px] font-semibold">{title}</p>
              </div>
            )}
            <div className="flex flex-col gap-[10px]">
              <div className=" bg-[#F2F2F2] rounded-[10px] px-[25px] py-[20px] h-[87px]">
                <MultiSlider
                  min={0}
                  max={totalTime}
                  step={1}
                  cycles={cycleValue}
                  onValueChange={setCycleValue}
                />
              </div>

              <div className="flex w-full  justify-end items-center gap-[3px] text-[#AAAAAA] font-normal text-[14px]">
                <div
                  className="cursor-pointer flex justify-end items-center gap-[3px]"
                  onClick={() => {
                    setCycleValue(generateSliderValuesFromTime(hours, minutes));
                  }}
                >
                  <RotateCw size={16} className="text-[#AAAAAA] " />
                  <p>다시 설정</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
