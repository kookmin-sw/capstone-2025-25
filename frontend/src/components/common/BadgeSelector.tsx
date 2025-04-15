import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface BadgeOption {
  label: string;
  value: string;
  bgColor?: string;
  textColor?: string;
}

interface BadgeSelectorProps {
  options: BadgeOption[];
  selected: string;
  onChange: (value: string) => void;
  renderBadge: (option: BadgeOption) => React.ReactNode;
  label: string;
  placeholder?: string;
  withSearch?: boolean; // ✅ 검색창 표시 여부
}

export function BadgeSelector({
  options,
  selected,
  onChange,
  renderBadge,
  label,
  placeholder = '검색...',
  withSearch = true,
}: BadgeSelectorProps) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === selected);

  return (
    <div className="relative w-30">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center space-x-2 cursor-pointer">
            <span className="text-sm font-medium">{label}</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </PopoverTrigger>

        <div className="mt-2">
          {selectedOption && renderBadge(selectedOption)}
        </div>

        <PopoverContent className="w-52 p-0">
          <Command>
            {withSearch && (
              <>
                <CommandInput placeholder={placeholder} className="h-9" />
                <CommandEmpty>결과 없음</CommandEmpty>
              </>
            )}
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    {renderBadge(option)}
                    {selected === option.value && (
                      <Check className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
