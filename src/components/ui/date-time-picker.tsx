"use client";

import * as React from "react";
import { add, format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "./time-picker";

interface DateTimePickerProps {
  date?: Date;
  setDate?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onChange?: (date: Date | undefined) => void;
}

export function DateTimePicker({
  date: externalDate,
  setDate: externalSetDate,
  placeholder = "Chọn ngày và giờ",
  className,
  disabled = false,
  onChange,
}: DateTimePickerProps = {}) {
  const [internalDate, setInternalDate] = React.useState<Date>();

  // Sử dụng external date nếu có, ngược lại dùng internal date
  const date = externalDate !== undefined ? externalDate : internalDate;
  const setDate = externalSetDate || setInternalDate;

  /**
   * carry over the current time when a user clicks a new day
   * instead of resetting to 00:00
   */
  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) {
      setDate(undefined);
      onChange?.(undefined);
      return;
    }
    if (!date) {
      setDate(newDay);
      onChange?.(newDay);
      return;
    }
    const diff = newDay.getTime() - date.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(date, { days: Math.ceil(diffInDays) });
    setDate(newDateFull);
    onChange?.(newDateFull);
  };

  const handleTimeChange = (newTime: Date | undefined) => {
    if (newTime) {
      setDate(newTime);
      onChange?.(newTime);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal h-9 px-3 py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          {date ? (
            <span className="text-sm">
              {format(date, "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 shadow-lg border-0"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <div className="flex bg-background rounded-md border shadow-md">
          <div className="border-r border-border">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d: any) => handleSelect(d)}
              initialFocus
              locale={vi}
              weekStartsOn={1}
              className="rounded-none"
              classNames={{
                day: "hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors text-sm",
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground font-medium",
                day_disabled:
                  "text-muted-foreground opacity-50 cursor-not-allowed",
                nav_button: "hover:bg-accent hover:text-accent-foreground",
                caption_label: "text-sm font-medium text-foreground",
              }}
            />
          </div>
          <div className="min-w-[180px] bg-white rounded-t-lg rounded-b-lg">
            <div className="p-2 border-b border-border">
              <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                <Clock className="h-3 w-3" />
                Chọn giờ
              </div>
            </div>
            <div className="p-2">
              <TimePicker setDate={handleTimeChange} date={date} />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
