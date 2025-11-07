import { Button } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";

interface MonthSelectorProps {
  selectedMonth: string; // YYYY-MM 형식
  onMonthChange: (month: string) => void;
}

const MonthSelector = ({ selectedMonth, onMonthChange }: MonthSelectorProps) => {
  const currentMonth = dayjs().format("YYYY-MM");
  const isCurrentMonth = selectedMonth === currentMonth;
  const isFutureMonth = dayjs(selectedMonth).isAfter(dayjs(), "month");

  const handlePrevMonth = () => {
    const newMonth = dayjs(selectedMonth).subtract(1, "month").format("YYYY-MM");
    onMonthChange(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = dayjs(selectedMonth).add(1, "month").format("YYYY-MM");
    // 현재월까지만 선택 가능
    if (dayjs(newMonth).isAfter(dayjs(), "month")) {
      return;
    }
    onMonthChange(newMonth);
  };

  const displayMonth = dayjs(selectedMonth).format("MMMM YYYY");

  return (
    <div className="flex items-center justify-between">
      <Button
        type="text"
        size="small"
        icon={<ChevronLeft size={16} />}
        onClick={handlePrevMonth}
      />
      <span className="text-sm font-medium text-gray-700">{displayMonth}</span>
      <Button
        type="text"
        size="small"
        icon={<ChevronRight size={16} />}
        onClick={handleNextMonth}
        disabled={isCurrentMonth || isFutureMonth}
      />
    </div>
  );
};

export default MonthSelector;
