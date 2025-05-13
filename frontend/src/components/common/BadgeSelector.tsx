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
import { Check, Plus, X } from 'lucide-react';
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
  label?: string;
  placeholder?: string;
  withSearch?: boolean;
  displayMode?: 'inline' | 'block';
  onCreateOption?: (label: string) => void;
  onDeleteOption?: (value: string) => void;
}

export function BadgeSelector({
  options,
  selected,
  onChange,
  renderBadge,
  label,
  placeholder = '검색...',
  withSearch = true,
  displayMode = 'inline',
  onCreateOption,
  onDeleteOption,
}: BadgeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const selectedOption = options.find((o) => o.value === selected);

  const handleSelect = (value: string) => {
    onChange(value);
    setOpen(false);
  };

  const handleCreate = () => {
    if (onCreateOption && searchValue.trim()) {
      onCreateOption(searchValue.trim());
      setSearchValue('');
      setOpen(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDeleteOption) {
      onDeleteOption(value);
    }
  };

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchValue.toLowerCase()),
  );
  const noResult = withSearch && searchValue && filtered.length === 0;

  return (
    <div
      className={
        displayMode === 'inline'
          ? 'relative  w-full gap-4 flex items-center'
          : ''
      }
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            {displayMode === 'inline' && (
              <>
                <span className="text-sm font-medium">{label}</span>
                {selectedOption ? (
                  renderBadge(selectedOption)
                ) : (
                  <span className="text-sm text-gray-400">비어있음</span>
                )}
              </>
            )}

            {displayMode === 'block' && (
              <div className="flex items-center gap-1">
                {selectedOption ? (
                  renderBadge(selectedOption)
                ) : (
                  <span className="text-sm text-gray-400">비어있음</span>
                )}
              </div>
            )}
          </div>
        </PopoverTrigger>

        {/*{displayMode === 'inline' && selectedOption && (*/}
        {/*  <div className="mt-2">{renderBadge(selectedOption)}</div>*/}
        {/*)}*/}

        <PopoverContent className="w-52 p-0">
          <Command>
            {withSearch && (
              <CommandInput
                value={searchValue}
                onValueChange={setSearchValue}
                placeholder={placeholder}
                className="h-9"
              />
            )}

            {noResult ? (
              <CommandEmpty>
                <button
                  className="w-full flex items-center justify-start gap-2 p-2 hover:bg-gray-100 text-sm"
                  onClick={handleCreate}
                >
                  <Plus className="w-4 h-4" />
                  <span>“{searchValue}” 추가하기</span>
                </button>
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {filtered.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option.value)}
                    className="cursor-pointer group"
                  >
                    <div className="flex items-center justify-between w-full">
                      {renderBadge(option)}
                      <div className="flex items-center gap-1">
                        {selected === option.value && (
                          <Check className="w-4 h-4 text-muted-foreground" />
                        )}

                        {withSearch && onDeleteOption && (
                          <button
                            type="button"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(e, option.value);
                            }}
                          >
                            <X className="w-4 h-4 text-muted-foreground" />
                          </button>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
