import { ContainerBuilder, MessageFlags, TextDisplayBuilder } from 'discord.js';
import { UniversalMessage } from '../types/UniversalMessage';

function noticeView(message: string): UniversalMessage {
  const container = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`ℹ️ ${message}`));
  return { flags: MessageFlags.IsComponentsV2, components: [container] };
}

function successView(message: string): UniversalMessage {
  const container = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`✅ ${message}`));
  return { flags: MessageFlags.IsComponentsV2, components: [container] };
}

function errorView(message: string): UniversalMessage {
  const container = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`❌ ${message}`));
  return { flags: MessageFlags.IsComponentsV2, components: [container] };
}

export { noticeView, successView, errorView };
