import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, ChevronRight, TrendingUp } from 'lucide-react';
import type { StudentGrade } from '@/types/student';
import { format, parseISO } from 'date-fns';

interface RecentScoresCardProps {
  grades: StudentGrade[];
  onViewAll?: () => void;
}

export const RecentScoresCard = ({ grades, onViewAll }: RecentScoresCardProps) => {
  const getGradeBadge = (percentage: number) => {
    if (percentage >= 90) {
      return <Badge className="bg-green-600">Excellent</Badge>;
    } else if (percentage >= 80) {
      return <Badge className="bg-blue-600">Good</Badge>;
    } else if (percentage >= 70) {
      return <Badge className="bg-yellow-600">Average</Badge>;
    } else if (percentage >= 60) {
      return <Badge className="bg-orange-600">Pass</Badge>;
    } else {
      return <Badge variant="destructive">Fail</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Scores
            </CardTitle>
            <CardDescription>Your latest assessment results</CardDescription>
          </div>
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {grades.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No grades available yet
          </p>
        ) : (
          <div className="space-y-3">
            {grades.map((grade) => (
              <div
                key={grade.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm truncate">{grade.assessmentName}</h4>
                    {getGradeBadge(grade.percentage)}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{grade.className}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(parseISO(grade.date), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold">{grade.score}/{grade.maxScore}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {grade.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
