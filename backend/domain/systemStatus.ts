export interface SystemStatus {
    status: 'ok' | 'degraded';
    timestamp: string;
    services: {
        supabase: 'online' | 'offline' | 'unknown';
        evolutionApi: 'online' | 'offline' | 'unknown';
    };
}

