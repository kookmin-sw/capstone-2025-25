import { toast } from 'sonner';

type ToastType = 'success' | 'error';

const toastStyles: Record<ToastType, React.CSSProperties> = {
  success: {
    borderColor: '#7098FF',
    background: '#E8EFFF',
    color: '#7098FF',
  },
  error: {
    borderColor: '#FF5053',
    background: '#FCEEEE',
    color: '#FF5053',
  },
};

export function showToast(type: ToastType, message: string) {
  toast[type](message, {
    position: 'top-center',
    style: toastStyles[type],
  });
}
