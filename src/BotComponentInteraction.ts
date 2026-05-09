import { ButtonInteraction, InteractionUpdateOptions, MessageFlags } from 'discord.js';
import { BotRepliableInteraction } from './BotRepliableInteraction';
import { AnySelectMenuInteraction } from './types/AnySelectMenuInteraction';

export abstract class BotComponentInteraction extends BotRepliableInteraction {
  protected declare readonly _interaction: ButtonInteraction | AnySelectMenuInteraction;

  constructor(interaction: ButtonInteraction | AnySelectMenuInteraction, executionId: string) {
    super(interaction, executionId);
    this._interaction = interaction;
  }

  get customId() { return this._interaction.customId; }
  get message() { return this._interaction.message; }

  update(options: string | InteractionUpdateOptions) {
    if (this._interaction.deferred) {
      return this._interaction.editReply(options);
    }
    return this._interaction.update(options);
  }

  deferUpdate() {
    return this._interaction.deferUpdate();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateComponentMessage(content: string | null, options?: any) {
    const isV2 = options?.flags && (options.flags & MessageFlags.IsComponentsV2);

    // IS_COMPONENTS_V2 messages must be edited via the channel message endpoint.
    // discord.js's editReply/update payload builder injects a content field which
    // Discord rejects for V2 messages, so we bypass it with message.edit().
    if (isV2) {
      return this.message.edit({ flags: options.flags, components: options.components });
    }

    const updateOptions = { ...options };
    if (content && content.length > 0) {
      updateOptions.content = content;
    }
    return this.update(updateOptions);
  }
}
