import { ButtonInteraction, InteractionUpdateOptions, MessageFlags } from 'discord.js';
import { BotRepliableInteraction } from './BotRepliableInteraction';
import { AnySelectMenuInteraction } from './types/AnySelectMenuInteraction';
import { UniversalMessage } from './types/UniversalMessage';

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

  updateComponentMessage(view: UniversalMessage): void;
  /** @deprecated Pass a view instead */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateComponentMessage(content: string | null, options?: any): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateComponentMessage(contentOrView: string | null | UniversalMessage, options?: any) {
    if (typeof contentOrView !== 'string' && contentOrView !== null) {
      return this.update(contentOrView as InteractionUpdateOptions);
    } else {
      process.emitWarning('updateComponentMessage(content, options) is deprecated — pass a view instead', 'DeprecationWarning');
      const updateOptions = { ...options };
      const isComponentsV2 = (updateOptions.flags & MessageFlags.IsComponentsV2) !== 0;
      if (!isComponentsV2) {
        updateOptions.content = contentOrView;
      } else {
        delete updateOptions.content;
      }
      return this.update(updateOptions);
    }
  }
}
