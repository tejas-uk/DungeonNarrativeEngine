import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  maxItems?: number;
  emptyMessage?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className = "",
  maxItems,
  emptyMessage = "No options found.",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ensure options have both label and value
  const normalizedOptions = options.map((option) =>
    typeof option === "string"
      ? { value: option, label: option }
      : option
  );

  const selectedOptions = normalizedOptions.filter((option) =>
    selected.includes(option.value)
  );

  const handleSelect = (value: string) => {
    const isSelected = selected.includes(value);
    const newSelected = isSelected
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    
    // Handle max items limit
    if (maxItems !== undefined && !isSelected && newSelected.length > maxItems) {
      return;
    }
    
    onChange(newSelected);
  };

  const handleRemove = (value: string) => {
    const newSelected = selected.filter((item) => item !== value);
    onChange(newSelected);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Backspace" && selected.length > 0 && (event.target as HTMLInputElement).value === "") {
      handleRemove(selected[selected.length - 1]);
    }
  };

  return (
    <div ref={containerRef} className={`space-y-1 ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-parchment-dark border border-brown-light hover:bg-parchment-darker focus:ring-2 focus:ring-accent font-serif"
          >
            <span className="truncate">
              {selectedOptions.length > 0
                ? `${selectedOptions.length} option${selectedOptions.length > 1 ? "s" : ""} selected`
                : placeholder}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start" style={{ width: containerRef.current?.clientWidth }}>
          <Command onKeyDown={handleKeyDown}>
            <CommandInput placeholder="Search options..." className="h-9" />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {normalizedOptions.map((option) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          isSelected ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedOptions.map((option) => (
            <Badge
              key={option.value}
              variant="outline"
              className="bg-accent-light text-brown-dark font-serif py-1 px-2"
            >
              {option.label}
              <button
                type="button"
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => handleRemove(option.value)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {option.label}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
