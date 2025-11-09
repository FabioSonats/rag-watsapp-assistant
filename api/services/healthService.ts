import type { SystemStatus } from '../domain/systemStatus';

export const getSystemStatus = async (): Promise<SystemStatus> => {
    const timestamp = new Date().toISOString();

    return {
        status: 'ok',
        timestamp,
        services: {
            supabase: 'unknown',
            evolutionApi: 'unknown',
        },
    };
};

