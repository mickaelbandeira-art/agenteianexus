import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getCoursesBySegment, type ClaroMandatoryCourse } from '@/lib/claro';

interface ClassCoursesProps {
  segmentId: string;
  classId?: string;
}

export const ClassCourses = ({ segmentId, classId }: ClassCoursesProps) => {
  const [courses, setCourses] = useState<ClaroMandatoryCourse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (segmentId) {
      loadCourses();
    }
  }, [segmentId]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await getCoursesBySegment(segmentId);
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!segmentId) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Selecione um segmento para visualizar os cursos obrigatórios.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{course.course_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Duração: {course.course_duration}h • Ordem: {course.course_order}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum curso obrigatório cadastrado para este segmento.
        </div>
      )}
    </div>
  );
};
