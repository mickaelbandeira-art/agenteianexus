import { format, differenceInDays, addDays, isSameDay, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';

interface TimelineEvent {
    date: Date;
    label: string;
    type: 'start' | 'end' | 'milestone' | 'exam' | 'contract';
    status: 'pending' | 'completed' | 'current' | 'future';
}

interface ClassTimelineProps {
    startDate: Date;
    endDate?: Date;
    assistedServiceDate?: Date;
    medicalExamDate?: Date;
    contractSignatureDate?: Date;
    status: string;
}

export const ClassTimeline = ({
    startDate,
    endDate,
    assistedServiceDate,
    medicalExamDate,
    contractSignatureDate,
    status
}: ClassTimelineProps) => {
    const events: TimelineEvent[] = [
        {
            date: startDate,
            label: 'Início',
            type: 'start',
            status: 'completed'
        }
    ];

    if (medicalExamDate) {
        events.push({
            date: medicalExamDate,
            label: 'Exame Médico',
            type: 'exam',
            status: isSameDay(new Date(), medicalExamDate) ? 'current' : new Date() > medicalExamDate ? 'completed' : 'future'
        });
    }

    if (contractSignatureDate) {
        events.push({
            date: contractSignatureDate,
            label: 'Assinatura Contrato',
            type: 'contract',
            status: isSameDay(new Date(), contractSignatureDate) ? 'current' : new Date() > contractSignatureDate ? 'completed' : 'future'
        });
    }

    if (assistedServiceDate) {
        events.push({
            date: assistedServiceDate,
            label: 'Atendimento Assistido',
            type: 'milestone',
            status: isSameDay(new Date(), assistedServiceDate) ? 'current' : new Date() > assistedServiceDate ? 'completed' : 'future'
        });
    }

    if (endDate) {
        events.push({
            date: endDate,
            label: 'Fim do Treinamento',
            type: 'end',
            status: status === 'Concluída' ? 'completed' : 'future'
        });
    }

    // Sort events by date
    events.sort((a, b) => a.date.getTime() - b.date.getTime());

    const getIcon = (type: string, status: string) => {
        if (status === 'completed') return <CheckCircle2 className="w-6 h-6 text-green-500" />;
        if (status === 'current') return <Clock className="w-6 h-6 text-blue-500 animate-pulse" />;
        return <Circle className="w-6 h-6 text-gray-300" />;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-500';
            case 'current': return 'bg-blue-500';
            default: return 'bg-gray-200';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-medium">Régua de Treinamento</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative py-8">
                    {/* Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0" />

                    {/* Events */}
                    <div className="relative z-10 flex justify-between items-center w-full px-4">
                        {events.map((event, index) => (
                            <div key={index} className="flex flex-col items-center group">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className={`relative bg-white p-1 rounded-full border-2 transition-all duration-300 ${event.status === 'current' ? 'border-blue-500 scale-110' :
                                                    event.status === 'completed' ? 'border-green-500' : 'border-gray-200'
                                                }`}>
                                                {getIcon(event.type, event.status)}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{format(event.date, "dd 'de' MMMM", { locale: ptBR })}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <div className="mt-4 text-center">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{event.label}</p>
                                    <p className="text-xs text-gray-500">
                                        {format(event.date, 'dd/MM', { locale: ptBR })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
