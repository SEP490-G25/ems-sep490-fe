import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ScheduleFilter } from '@/types/student';
import { Filter } from 'lucide-react';

interface ScheduleFiltersProps {
  classOptions: Array<{ id: number; name: string; code: string }>;
  currentFilters: ScheduleFilter;
  onFilterChange: (filters: ScheduleFilter) => void;
}

export const ScheduleFilters = ({
  classOptions,
  currentFilters,
  onFilterChange,
}: ScheduleFiltersProps) => {
  const handleClassChange = (value: string) => {
    onFilterChange({
      ...currentFilters,
      classId: value === 'all' ? null : parseInt(value),
    });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...currentFilters,
      attendanceStatus: value as ScheduleFilter['attendanceStatus'],
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4" />
          <h3 className="font-semibold">Filters</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Class Filter */}
          <div className="space-y-2">
            <Label htmlFor="class-filter">Class</Label>
            <Select
              value={currentFilters.classId?.toString() || 'all'}
              onValueChange={handleClassChange}
            >
              <SelectTrigger id="class-filter">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classOptions.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>
                    {cls.code} - {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Attendance Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status-filter">Attendance Status</Label>
            <Select
              value={currentFilters.attendanceStatus || 'all'}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="planned">Planned (Upcoming)</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="excused">Excused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range could be added here in the future */}
        </div>
      </CardContent>
    </Card>
  );
};
