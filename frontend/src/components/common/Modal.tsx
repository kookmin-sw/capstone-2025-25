import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';

type ModalProps = {
  trigger: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  onClose?: () => void;
};

export function Modal({
  trigger,
  title,
  description,
  children,
  footer,
  maxWidth = 'sm:max-w-lg',
  onClose,
}: ModalProps) {
  return (
    <Dialog onOpenChange={(open) => !open && onClose?.()}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={maxWidth}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4">{children}</div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
