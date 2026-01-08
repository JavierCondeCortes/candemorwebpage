/**
 * Servicio para interactuar con la API de Twitch
 */

export interface StreamStatus {
  isLive: boolean;
  userName?: string;
  gameTitle?: string;
  title?: string;
  viewerCount?: number;
  thumbnailUrl?: string;
}

class TwitchService {
  private clientId: string = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || '';
  private accessToken: string = process.env.NEXT_PUBLIC_TWITCH_ACCESS_TOKEN || '';

  /**
   * Obtiene el estado del stream de un canal
   */
  async getStreamStatus(channelName: string): Promise<StreamStatus> {
    try {
      // Validar credenciales
      if (!this.clientId || !this.accessToken) {
        console.warn('⚠️ Credenciales de Twitch no configuradas. Configura NEXT_PUBLIC_TWITCH_CLIENT_ID y NEXT_PUBLIC_TWITCH_ACCESS_TOKEN en .env.local');
        return { isLive: false };
      }

      // Obtener usuario
      const userResponse = await fetch(
        `https://api.twitch.tv/helix/users?login=${channelName}`,
        {
          headers: {
            'Client-ID': this.clientId,
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!userResponse.ok) {
        const errorData = await userResponse.json().catch(() => ({}));
        console.warn(`⚠️ Error obteniendo usuario de Twitch (${userResponse.status}):`, errorData);
        return { isLive: false };
      }

      const userData = await userResponse.json();
      const userId = userData.data?.[0]?.id;

      if (!userId) {
        console.warn('⚠️ Usuario de Twitch no encontrado:', channelName);
        return { isLive: false };
      }

      // Obtener stream activo
      const streamResponse = await fetch(
        `https://api.twitch.tv/helix/streams?user_id=${userId}`,
        {
          headers: {
            'Client-ID': this.clientId,
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!streamResponse.ok) {
        console.warn(`⚠️ Error obteniendo stream de Twitch (${streamResponse.status})`);
        return { isLive: false };
      }

      const streamData = await streamResponse.json();
      const stream = streamData.data?.[0];

      if (!stream) {
        console.log(`ℹ️ ${channelName} no está en vivo`);
        return { isLive: false };
      }

      console.log(`✅ ${channelName} está en vivo: ${stream.title}`);
      return {
        isLive: true,
        userName: channelName,
        gameTitle: stream.game_name,
        title: stream.title,
        viewerCount: stream.viewer_count,
        thumbnailUrl: stream.thumbnail_url,
      };
    } catch (error) {
      console.error('❌ Error verificando stream de Twitch:', error);
      return { isLive: false };
    }
  }

  /**
   * Obtiene información del canal
   */
  async getChannelInfo(channelName: string): Promise<any> {
    try {
      if (!this.clientId || !this.accessToken) {
        return null;
      }

      const response = await fetch(
        `https://api.twitch.tv/helix/users?login=${channelName}`,
        {
          headers: {
            'Client-ID': this.clientId,
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.data?.[0];
    } catch (error) {
      console.error('Error obteniendo información del canal:', error);
      return null;
    }
  }
}

export const twitchService = new TwitchService();
