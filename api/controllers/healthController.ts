import type { SystemStatus } from '../domain/systemStatus';
import { getSystemStatus } from '../services/healthService';

export const healthController = {
    async index(): Promise<SystemStatus> {
        return getSystemStatus();
    },
};

