import { settingsService } from './settingsService';
import { ragContextService } from './ragContextService';

export const buildSystemPrompt = async (): Promise<string> => {
  const settings = await settingsService.getCurrentSettings();
  const context = await ragContextService.buildContext();
  const basePrompt = settings.prompts.system;

  if (!context) {
    return basePrompt;
  }

  return `${basePrompt}\n\n=== CONTEXTO ===\n${context}\n\nUse apenas as informações acima para responder. Caso o contexto não cubra a pergunta, informe que não possui dados suficientes.`;
};


