import { InteractionEditReplyOptions, InteractionReplyOptions, MessageCreateOptions, MessageEditOptions } from 'discord.js';

export type UniversalMessage = InteractionReplyOptions | InteractionEditReplyOptions | MessageCreateOptions | MessageEditOptions;
