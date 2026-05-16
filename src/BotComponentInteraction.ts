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
    console.log('Updating component interaction with options:', options);
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
    const updateOptions = { ...options };
    const isComponentsV2 = (updateOptions.flags & MessageFlags.IsComponentsV2) !== 0;

    if (!isComponentsV2) {
      updateOptions.content = content;
    } else {
      delete updateOptions.content;
    }
    return this.update(updateOptions);
  }
}
