interface PlayerInfo {
  id: string;
  name: string;
  ship: string;
}

export class NetworkManager {
  private static instance: NetworkManager;
  private ws: WebSocket | null = null;
  private isHost: boolean = false;
  private players: PlayerInfo[] = [];
  private playerId: string = '';
  private playerName: string = '';
  private ship: string = '';
  private wsUrl = 'wss://temp-w9qo.onrender.com';

  private onConnectedCallback: (() => void) | null = null;
  private playersUpdateCallback: ((players: PlayerInfo[]) => void) | null = null;
  private remoteUpdateCallback: ((x: number, y: number, name: string, ship: string, angle: number) => void) | null = null;

  public static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  public connect(name: string, ship: string, onConnected: () => void) {
    this.playerName = name;
    this.ship = ship;
    this.onConnectedCallback = onConnected;

    this.ws = new WebSocket(this.wsUrl);

    this.ws.onopen = () => {
      const hello = {
        type: 'join',
        name: this.playerName,
        ship: this.ship,
      };
      this.ws?.send(JSON.stringify(hello));
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'init') {
        this.playerId = data.id;
        if (this.onConnectedCallback) this.onConnectedCallback();
      } else if (data.type === 'players') {
        this.players = data.players;
        if (this.playersUpdateCallback) this.playersUpdateCallback(this.players);
      } else if (data.type === 'update') {
        if (this.remoteUpdateCallback) {
          const { x, y, name, ship, angle } = data;
          this.remoteUpdateCallback(x, y, name, ship, angle);
        }
      }
    };

    this.ws.onclose = () => {
      console.log('Disconnected from server');
    };
  }

  public sendPlayerUpdate(x: number, y: number, angle: number) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const msg = {
      type: 'update',
      id: this.playerId,
      x,
      y,
      name: this.playerName,
      ship: this.ship,
      angle,
    };
    this.ws.send(JSON.stringify(msg));
  }

  public onPlayersUpdate(callback: (players: PlayerInfo[]) => void) {
    this.playersUpdateCallback = callback;
  }

  public onRemoteUpdate(callback: (x: number, y: number, name: string, ship: string, angle: number) => void) {
    this.remoteUpdateCallback = callback;
  }
}
