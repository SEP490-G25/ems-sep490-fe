import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Video, FileAudio, File } from 'lucide-react';
import type { ClassMaterial } from '@/types/student';
import { format, parseISO } from 'date-fns';

interface MaterialsTabProps {
  materials: ClassMaterial[];
}

export const MaterialsTab = ({ materials }: MaterialsTabProps) => {
  const getMaterialIcon = (type: ClassMaterial['type']) => {
    const icons = {
      slide: FileText,
      worksheet: FileText,
      video: Video,
      audio: FileAudio,
      document: File,
      other: File,
    };

    const Icon = icons[type];
    return <Icon className="h-5 w-5" />;
  };

  const getMaterialTypeBadge = (type: ClassMaterial['type']) => {
    const labels: Record<ClassMaterial['type'], string> = {
      slide: 'Slide',
      worksheet: 'Worksheet',
      video: 'Video',
      audio: 'Audio',
      document: 'Document',
      other: 'Other',
    };

    return <Badge variant="outline">{labels[type]}</Badge>;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';

    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  // Group materials by session
  const materialsBySession = materials.reduce(
    (acc, material) => {
      const key = material.sessionNumber ? `Session ${material.sessionNumber}` : 'General Materials';
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(material);
      return acc;
    },
    {} as Record<string, ClassMaterial[]>
  );

  return (
    <div className="space-y-6">
      {Object.keys(materialsBySession).length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No materials available</h3>
          <p className="text-muted-foreground">Course materials will appear here when uploaded</p>
        </div>
      ) : (
        Object.entries(materialsBySession).map(([sessionTitle, sessionMaterials]) => (
          <div key={sessionTitle}>
            <h3 className="text-lg font-semibold mb-4">
              {sessionTitle} ({sessionMaterials.length})
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sessionMaterials.map((material) => (
                <Card key={material.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {getMaterialIcon(material.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-sm line-clamp-2">{material.title}</h4>
                          {getMaterialTypeBadge(material.type)}
                        </div>

                        {material.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                            {material.description}
                          </p>
                        )}

                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p>Uploaded: {format(parseISO(material.uploadedAt), 'MMM dd, yyyy')}</p>
                          <p>By: {material.uploadedBy}</p>
                          {material.fileSize && <p>Size: {formatFileSize(material.fileSize)}</p>}
                        </div>

                        <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                          <a href={material.fileUrl} download target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </div>
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
