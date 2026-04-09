import { Interaction, PermissionsBitField } from 'discord.js';
import { Logger } from '@vulps22/logger';

export abstract class BotInteraction {
  protected readonly _interaction: Interaction;
  protected readonly _executionId: string;

  constructor(interaction: Interaction, executionId: string) {
    this._interaction = interaction;
    this._executionId = executionId;
  }

  get user() { return this._interaction.user; }
  get member() { return this._interaction.member; }
  get channel() { return this._interaction.channel; }
  get guild() { return this._interaction.guild; }
  get client() { return this._interaction.client; }
  get id() { return this._interaction.id; }
  get guildId() { return this._interaction.guildId; }
  get executionId() { return this._executionId; }

  isAdministrator(): boolean {
    if (!this.member || !('permissions' in this.member)) {
      return false;
    }
    const permissions = this.member.permissions;
    if (typeof permissions === 'string') {
      return false;
    }
    return permissions.has(PermissionsBitField.Flags.Administrator);
  }

  async updateLog(status: string): Promise<void> {
    await Logger.updateExecution(this._executionId, status);
  }
}
