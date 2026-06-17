import { ChatInputCommandInteraction, ButtonInteraction, InteractionEditReplyOptions, InteractionReplyOptions, Message, MessageFlags, ModalSubmitInteraction } from 'discord.js';
import { BotInteraction } from './BotInteraction';
import { UniversalMessage } from './types/UniversalMessage';
import { AnySelectMenuInteraction } from './types/AnySelectMenuInteraction';

export abstract class BotRepliableInteraction extends BotInteraction {
  protected declare readonly _interaction: ChatInputCommandInteraction | ButtonInteraction | AnySelectMenuInteraction | ModalSubmitInteraction;

  constructor(interaction: ChatInputCommandInteraction | ButtonInteraction | AnySelectMenuInteraction | ModalSubmitInteraction, executionId: string) {
    super(interaction, executionId);
    this._interaction = interaction;
  }

  get deferred() { return this._interaction.deferred; }
  get replied() { return this._interaction.replied; }

  reply(options: InteractionReplyOptions) {
    return this._interaction.reply(options);
  }

  editReply(options: string | InteractionEditReplyOptions) {
    return this._interaction.editReply(options);
  }

  deferReply(options?: { ephemeral?: boolean; flags?: number }) {
    return this._interaction.deferReply(options);
  }

  async sendReply(view: UniversalMessage): Promise<void>;
  /** @deprecated Pass a view instead */
  async sendReply(content: string | null, options?: UniversalMessage): Promise<void>;
  async sendReply(contentOrView: string | null | UniversalMessage, options: UniversalMessage = {}): Promise<void> {
    let replyOptions: UniversalMessage;
    if (typeof contentOrView !== 'string' && contentOrView !== null) {
      replyOptions = contentOrView;
    } else {
      process.emitWarning('sendReply(content, options) is deprecated — pass a view instead', 'DeprecationWarning');
      replyOptions = { ...options };
      if (contentOrView && contentOrView.length > 0) (replyOptions as InteractionReplyOptions).content = contentOrView;
    }
    if (this.deferred || this.replied) {
      await this.editReply(replyOptions as InteractionEditReplyOptions);
    } else {
      await this.reply(replyOptions as InteractionReplyOptions);
    }
  }

  async ephemeralReply(view: UniversalMessage): Promise<void>;
  /** @deprecated Pass a view instead */
  async ephemeralReply(content?: string | null, options?: UniversalMessage): Promise<void>;
  async ephemeralReply(contentOrView: string | null | UniversalMessage = null, options: UniversalMessage = {}): Promise<void> {
    let replyOptions: UniversalMessage;
    if (typeof contentOrView !== 'string' && contentOrView !== null) {
      const existingFlags = Number((contentOrView as InteractionReplyOptions).flags) || 0;
      replyOptions = { ...contentOrView, flags: existingFlags | MessageFlags.Ephemeral };
    } else {
      process.emitWarning('ephemeralReply(content, options) is deprecated — pass a view instead', 'DeprecationWarning');
      const existingFlags = Number(options.flags) || 0;
      replyOptions = { ...options, flags: existingFlags | MessageFlags.Ephemeral };
      if (contentOrView && contentOrView.length > 0) (replyOptions as InteractionReplyOptions).content = contentOrView;
    }
    if (this.deferred || this.replied) {
      await this.editReply(replyOptions as InteractionEditReplyOptions);
    } else {
      await this.reply(replyOptions as InteractionReplyOptions);
    }
  }

  async followUp(view: UniversalMessage): Promise<Message<boolean>>;
  /** @deprecated Pass a view instead */
  async followUp(content: string | null, options?: UniversalMessage): Promise<Message<boolean>>;
  async followUp(contentOrView: string | null | UniversalMessage, options: UniversalMessage = {}): Promise<Message<boolean>> {
    if (typeof contentOrView !== 'string' && contentOrView !== null) {
      return await this._interaction.followUp(contentOrView as InteractionReplyOptions);
    } else {
      process.emitWarning('followUp(content, options) is deprecated — pass a view instead', 'DeprecationWarning');
      return await this._interaction.followUp({ ...options, content: contentOrView } as InteractionReplyOptions);
    }
  }

  async ephemeralFollowUp(view: UniversalMessage): Promise<Message<boolean>>;
  /** @deprecated Pass a view instead */
  async ephemeralFollowUp(content?: string | null, options?: UniversalMessage): Promise<Message<boolean>>;
  async ephemeralFollowUp(contentOrView: string | null | UniversalMessage = null, options: UniversalMessage = {}): Promise<Message<boolean>> {
    if (typeof contentOrView !== 'string' && contentOrView !== null) {
      const existingFlags = Number((contentOrView as InteractionReplyOptions).flags) || 0;
      return await this._interaction.followUp({ ...contentOrView, flags: existingFlags | MessageFlags.Ephemeral } as InteractionReplyOptions);
    } else {
      process.emitWarning('ephemeralFollowUp(content, options) is deprecated — pass a view instead', 'DeprecationWarning');
      const existingFlags = Number(options.flags) || 0;
      return await this._interaction.followUp({ ...options, flags: existingFlags | MessageFlags.Ephemeral, content: contentOrView } as InteractionReplyOptions);
    }
  }

  fetchReply(): Promise<Message<boolean>> {
    return this._interaction.fetchReply();
  }
}
