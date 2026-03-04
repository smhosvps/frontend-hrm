
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { useGetUserSchedulesQuery } from "@/redux/features/schedule/scheduleApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Loader2 } from "lucide-react";

export default function CalendarSchedules() {
  const { data, isLoading, error }:any = useGetUserSchedulesQuery();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Build a map of dates -> schedule items (count and items)
  const schedulesByDate = new Map<string, typeof data.schedules>();
  if (data?.schedules) {
    data.schedules.forEach((item:any) => {
      const dateKey = item.schedule.date;
      if (!schedulesByDate.has(dateKey)) {
        schedulesByDate.set(dateKey, []);
      }
      schedulesByDate.get(dateKey)!.push(item);
    });
  }

  // Get the full month view including leading/trailing days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  // Month navigation
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Handle day click
  const handleDayClick = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    if (schedulesByDate.has(dateKey)) {
      setSelectedDate(dateKey);
      setModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-600">Failed to load schedules.</div>;
  }

  const selectedSchedules = selectedDate
    ? schedulesByDate.get(selectedDate) || []
    : [];

  return (
    <div className="px-0 py-4 md:px-4">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div>
            <h1 className="text-3xl font-bold bg-[#1969fe] bg-clip-text text-transparent">
              Calendar View
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Your scheduled events at a glance
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-1 rounded-full shadow-sm border border-gray-100">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevMonth}
            className="rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-lg font-semibold text-gray-800 min-w-[160px] text-center">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            className="rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid - Beautiful & Modern */}
      <div className="bg-whi0 backdrop-blur-sm rounded-3xl border border-gray-100">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const hasEvent = schedulesByDate.has(dateKey);
            const eventCount = hasEvent
              ? schedulesByDate.get(dateKey)!.length
              : 0;
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isCurrentDay = isToday(day);

            return (
              <button
                key={dateKey}
                onClick={() => handleDayClick(day)}
                disabled={!hasEvent}
                className={`
                  relative aspect-square p-2 rounded-2xl transition-all duration-200
                  flex flex-col items-center justify-start group
                  ${
                    isCurrentMonth
                      ? "bg-blue-100 hover:shadow-lg"
                      : "bg-gray-50/50 text-gray-400"
                  }
                  ${isCurrentDay ? "ring-2 ring-red-400 ring-offset-2" : ""}
                  ${
                    hasEvent
                      ? "cursor-pointer bg-blue-500 hover:scale-[1.02] text-white  border-2 border-transparent textehite"
                      : "cursor-default opacity-60"
                  }
                  ${!isCurrentMonth && "opacity-40"}
                `}
              >
                <span
                  className={`
                    text-sm font-medium
                    ${isCurrentDay ? "text-indigo-700" : ""}
                    ${hasEvent && !isCurrentDay ? "text-gray-800" : ""}
                  `}
                >
                  {format(day, "d")}
                </span>

                {hasEvent && (
                  <div className="absolute bottom-1 flex items-center justify-center bg--700">
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full shadow-sm border border-red-100">
                      {eventCount}
                    </span>
                  </div>
                )}

                {/* Subtle glow for days with events */}
                {hasEvent && (
                  <div className="absolute inset-0 rounded-2xl bg-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Elegant Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-[10px] border-0 shadow-2xl bg-white/95 backdrop-blur-md ">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl md:text-2xl font-bold text-gray-800">
              <span>
                {selectedDate
                  ? format(new Date(selectedDate), "EEEE, MMMM d, yyyy")
                  : ""}
              </span>
            </DialogTitle>
            <DialogDescription className="text-gray-500 flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-indigo-400 rounded-full" />
              {selectedSchedules.length} event
              {selectedSchedules.length !== 1 ? "s" : ""} scheduled
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2 mt-4">
            {selectedSchedules.map((item:any) => (
              <div
                key={item._id}
                className="group relative transition-all duration-300 border border-gray-100"
              >
                <h4 className="text-lg font-semibold text-gray-800 pr-24">
                  {item.schedule.info}
                </h4>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
