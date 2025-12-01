import { supabase } from '@/integrations/supabase/client';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    points: number;
    condition: (stats: UserStats) => boolean;
}

export interface UserStats {
    trainingsCompleted: number;
    perfectScores: number;
    streakDays: number;
    totalPoints: number;
    level: number;
}

// Definição de conquistas
export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_training',
        name: 'Primeiro Passo',
        description: 'Complete seu primeiro treinamento',
        icon: '🎯',
        points: 100,
        condition: (stats) => stats.trainingsCompleted >= 1
    },
    {
        id: 'perfect_score',
        name: 'Perfeição',
        description: 'Obtenha 100% em um quiz',
        icon: '⭐',
        points: 200,
        condition: (stats) => stats.perfectScores >= 1
    },
    {
        id: 'five_trainings',
        name: 'Dedicado',
        description: 'Complete 5 treinamentos',
        icon: '🏆',
        points: 300,
        condition: (stats) => stats.trainingsCompleted >= 5
    },
    {
        id: 'week_streak',
        name: 'Consistente',
        description: 'Mantenha uma sequência de 7 dias',
        icon: '🔥',
        points: 250,
        condition: (stats) => stats.streakDays >= 7
    },
    {
        id: 'level_5',
        name: 'Experiente',
        description: 'Alcance o nível 5',
        icon: '💎',
        points: 500,
        condition: (stats) => stats.level >= 5
    }
];

/**
 * Serviço de Gamificação
 */
export class GamificationService {
    /**
     * Concede pontos ao usuário
     */
    static async awardPoints(
        userId: string,
        clientId: string,
        points: number,
        reason: string
    ): Promise<void> {
        try {
            // Buscar conquistas atuais
            const { data: achievements } = await supabase
                .from('user_achievements')
                .select('*')
                .eq('user_id', userId)
                .eq('client_id', clientId)
                .single();

            const currentPoints = achievements?.total_points || 0;
            const newPoints = currentPoints + points;
            const newLevel = Math.floor(newPoints / 1000) + 1;
            const experiencePoints = newPoints % 1000;

            // Atualizar pontos
            await supabase
                .from('user_achievements')
                .upsert({
                    user_id: userId,
                    client_id: clientId,
                    total_points: newPoints,
                    level: newLevel,
                    experience_points: experiencePoints
                });

            // Verificar novas conquistas
            await this.checkAchievements(userId, clientId);

            console.log(`✨ ${points} pontos concedidos: ${reason}`);
        } catch (error) {
            console.error('Erro ao conceder pontos:', error);
        }
    }

    /**
     * Verifica e desbloqueia conquistas
     */
    static async checkAchievements(userId: string, clientId: string): Promise<void> {
        try {
            // Buscar dados do usuário
            const { data: achievements } = await supabase
                .from('user_achievements')
                .select('*')
                .eq('user_id', userId)
                .eq('client_id', clientId)
                .single();

            if (!achievements) return;

            // Buscar progresso de treinamentos
            const { data: progress } = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', userId);

            // Calcular estatísticas
            const stats: UserStats = {
                trainingsCompleted: progress?.filter(p => p.status === 'completed').length || 0,
                perfectScores: progress?.filter(p => p.quiz_score === 100).length || 0,
                streakDays: achievements.streak_days || 0,
                totalPoints: achievements.total_points || 0,
                level: achievements.level || 1
            };

            // Verificar cada conquista
            const unlockedAchievements = achievements.achievements || [];
            const newAchievements: string[] = [];

            for (const achievement of ACHIEVEMENTS) {
                if (!unlockedAchievements.includes(achievement.id) && achievement.condition(stats)) {
                    newAchievements.push(achievement.id);
                    unlockedAchievements.push(achievement.id);
                }
            }

            // Atualizar conquistas desbloqueadas
            if (newAchievements.length > 0) {
                await supabase
                    .from('user_achievements')
                    .update({ achievements: unlockedAchievements })
                    .eq('user_id', userId)
                    .eq('client_id', clientId);

                console.log(`🎉 Novas conquistas desbloqueadas: ${newAchievements.join(', ')}`);
            }
        } catch (error) {
            console.error('Erro ao verificar conquistas:', error);
        }
    }

    /**
     * Atualiza sequência de dias
     */
    static async updateStreak(userId: string, clientId: string): Promise<void> {
        try {
            const { data: achievements } = await supabase
                .from('user_achievements')
                .select('*')
                .eq('user_id', userId)
                .eq('client_id', clientId)
                .single();

            if (!achievements) return;

            const lastActivity = achievements.last_activity_date;
            const today = new Date().toISOString().split('T')[0];

            if (lastActivity === today) {
                // Já acessou hoje
                return;
            }

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            let newStreak = 1;
            if (lastActivity === yesterdayStr) {
                // Continuou a sequência
                newStreak = (achievements.streak_days || 0) + 1;
            }

            await supabase
                .from('user_achievements')
                .update({
                    streak_days: newStreak,
                    last_activity_date: today
                })
                .eq('user_id', userId)
                .eq('client_id', clientId);
        } catch (error) {
            console.error('Erro ao atualizar sequência:', error);
        }
    }

    /**
     * Busca ranking do cliente
     */
    static async getLeaderboard(clientId: string, limit: number = 10) {
        const { data, error } = await supabase
            .from('user_achievements')
            .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
            .eq('client_id', clientId)
            .order('total_points', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Erro ao buscar ranking:', error);
            return [];
        }

        return data;
    }

    /**
     * Registra conclusão de treinamento
     */
    static async onTrainingCompleted(
        userId: string,
        clientId: string,
        quizScore?: number
    ): Promise<void> {
        // Conceder pontos base
        let points = 100;

        // Bonus por pontuação
        if (quizScore) {
            if (quizScore === 100) {
                points += 50; // Bonus por perfeição
            } else if (quizScore >= 80) {
                points += 25; // Bonus por boa pontuação
            }
        }

        await this.awardPoints(userId, clientId, points, 'Treinamento concluído');

        // Atualizar estatísticas
        const { data: achievements } = await supabase
            .from('user_achievements')
            .select('*')
            .eq('user_id', userId)
            .eq('client_id', clientId)
            .single();

        const trainingsCompleted = (achievements?.trainings_completed || 0) + 1;
        const perfectScores = quizScore === 100
            ? (achievements?.perfect_scores || 0) + 1
            : (achievements?.perfect_scores || 0);

        await supabase
            .from('user_achievements')
            .update({
                trainings_completed: trainingsCompleted,
                perfect_scores: perfectScores
            })
            .eq('user_id', userId)
            .eq('client_id', clientId);

        // Atualizar sequência
        await this.updateStreak(userId, clientId);
    }
}
