import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Award, Calendar } from 'lucide-react';
import type { StudentGrade } from '@/types/student';
import { format, parseISO } from 'date-fns';

interface GradesTabProps {
  grades: StudentGrade[];
}

export const GradesTab = ({ grades }: GradesTabProps) => {
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

  const calculateOverallGrade = () => {
    if (grades.length === 0) return null;

    const totalWeightedScore = grades.reduce((sum, grade) => {
      return sum + (grade.percentage * grade.weight) / 100;
    }, 0);

    const totalWeight = grades.reduce((sum, grade) => sum + grade.weight, 0);

    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  };

  const overallGrade = calculateOverallGrade();

  // Group grades by assessment type
  const gradesByType = grades.reduce(
    (acc, grade) => {
      if (!acc[grade.assessmentType]) {
        acc[grade.assessmentType] = [];
      }
      acc[grade.assessmentType].push(grade);
      return acc;
    },
    {} as Record<string, StudentGrade[]>
  );

  return (
    <div className="space-y-6">
      {/* Overall Grade Summary */}
      {overallGrade !== null && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Overall Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-4xl font-bold text-primary">{overallGrade.toFixed(2)}%</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on {grades.length} assessment{grades.length !== 1 ? 's' : ''}
                </p>
              </div>
              {getGradeBadge(overallGrade)}
            </div>
            <Progress value={overallGrade} className="h-3" />
          </CardContent>
        </Card>
      )}

      {/* Grades by Assessment Type */}
      {Object.keys(gradesByType).length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No grades yet</h3>
          <p className="text-muted-foreground">Your assessment grades will appear here</p>
        </div>
      ) : (
        Object.entries(gradesByType).map(([assessmentType, typeGrades]) => (
          <div key={assessmentType}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {assessmentType}
              <Badge variant="outline">{typeGrades.length}</Badge>
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {typeGrades.map((grade) => (
                <Card key={grade.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold">{grade.assessmentName}</h4>
                          <p className="text-sm text-muted-foreground">{grade.className}</p>
                        </div>
                        {getGradeBadge(grade.percentage)}
                      </div>

                      {/* Score Display */}
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Score</span>
                          <span className="text-2xl font-bold">
                            {grade.score}/{grade.maxScore}
                          </span>
                        </div>
                        <Progress value={grade.percentage} className="h-2 mb-2" />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Percentage</span>
                          <span className="font-semibold">{grade.percentage.toFixed(1)}%</span>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Weight:</span>
                          <span className="font-medium ml-2">{grade.weight}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {format(parseISO(grade.date), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="text-muted-foreground">Teacher:</span>
                        <span className="font-medium ml-2">{grade.teacherName}</span>
                      </div>

                      {/* Feedback */}
                      {grade.feedback && (
                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                          <p className="text-sm font-medium mb-1">Teacher's Feedback:</p>
                          <p className="text-sm text-muted-foreground">{grade.feedback}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
