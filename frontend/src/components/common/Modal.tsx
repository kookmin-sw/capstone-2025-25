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
  trigger?: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function Modal({
  trigger,
  title,
  isOpen = false,
  description,
  children,
  footer,
  maxWidth = 'sm:max-w-lg',
  onOpenChange,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={maxWidth}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription className="whitespace-pre-line">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div>{children}</div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
