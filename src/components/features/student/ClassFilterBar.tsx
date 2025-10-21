import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import type { StudentClassFilter } from '@/types/student';

interface ClassFilterBarProps {
  filter: StudentClassFilter;
  onFilterChange: (filter: StudentClassFilter) => void;
  resultCount?: number;
}

export const ClassFilterBar = ({ filter, onFilterChange, resultCount }: ClassFilterBarProps) => {
  const statusOptions: Array<{ value: StudentClassFilter['status']; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' },
  ];

  const modalityOptions: Array<{ value: StudentClassFilter['modalityType']; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'offline', label: 'Offline' },
    { value: 'online', label: 'Online' },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  const hasActiveFilters =
    (filter.status && filter.status !== 'all') ||
    (filter.modalityType && filter.modalityType !== 'all') ||
    filter.searchTerm;

  const clearFilters = () => {
    onFilterChange({
      status: 'all',
      modalityType: 'all',
      searchTerm: '',
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search classes by name or code..."
                value={filter.searchTerm || ''}
                onChange={(e) => onFilterChange({ ...filter, searchTerm: e.target.value })}
                className="pl-10"
              />
            </div>
            {hasActiveFilters && (
              <Button variant="outline" size="icon" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Status:</span>
              {statusOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant={filter.status === option.value ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => onFilterChange({ ...filter, status: option.value })}
                >
                  {option.label}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-2 border-l pl-2">
              <span className="text-sm text-muted-foreground">Mode:</span>
              {modalityOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant={filter.modalityType === option.value ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => onFilterChange({ ...filter, modalityType: option.value })}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Result Count */}
          {resultCount !== undefined && (
            <p className="text-sm text-muted-foreground">
              Found {resultCount} {resultCount === 1 ? 'class' : 'classes'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
