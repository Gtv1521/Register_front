import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from '@environment';
import { RegisterEntity } from 'src/app/core/domain/entitys/register.entity';
import { ObservationEntity } from 'src/app/core/domain/entitys/observation.entity';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  // 1. Usamos el Subject para emitir CUALQUIER evento
  private deleteRegsiter = new Subject<string>();
  private newRegister = new Subject<RegisterEntity>();
  private newObservation = new Subject<ObservationEntity>();
  private deleteObservacion = new Subject<string>();
  private updateRegister = new Subject<RegisterEntity>();
  private revokeSession = new Subject<string>();

  deleteRegistro$ = this.deleteRegsiter.asObservable();
  newRegistro$ = this.newRegister.asObservable();
  newObservation$ = this.newObservation.asObservable();
  deleteObservacion$ = this.deleteObservacion.asObservable();
  updateRegistro$ = this.updateRegister.asObservable();
  revokeSession$ = this.revokeSession.asObservable();

  public async conectar() {
    if (
      this.hubConnection?.state === signalR.HubConnectionState.Connected ||
      this.hubConnection?.state === signalR.HubConnectionState.Connecting
    ) {
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.signalR}/register`, { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('RegistroEliminado', (id) =>
      this.deleteRegsiter.next(id),
    );

    this.hubConnection.on('RegistroCreado', (data) => {
      this.newRegister.next(data);
    });

    this.hubConnection.on('RegistroActualizado', (data) => {
      this.updateRegister.next(data);
    });

    this.hubConnection.on('ObservacionEliminada', (id) => {
      this.deleteObservacion.next(id);
    });
   
    this.hubConnection.on('ObservacionCreada', (data) => {
      this.newObservation.next(data);
    });

    this.hubConnection.on('SesionRevoked', (id) => {
      this.revokeSession.next(id);
    });

    try {
      await this.hubConnection.start();
      console.log('🚀 Conexión SignalR establecida con éxito');
    } catch (err) {
      console.error('❌ Error al conectar a SignalR:', err);
    }
  }

  async reiniciarConexion() {
    if (this.hubConnection) {
      console.warn('Reconectando SignalR con nueva identidad...');
      await this.hubConnection.stop();
      await this.hubConnection.start();
    }
  }

  public async RegistroCompleto(data: string): Promise<void> {
    if (
      this.hubConnection &&
      this.hubConnection.state === signalR.HubConnectionState.Connected
    ) {
      try {
        await this.hubConnection.invoke('RegistroCompleto', data);
      } catch (err) {
        console.error('❌ Error al propagar por SignalR:', err);
      }
    } else {
      console.warn('⚠️ No se pudo propagar: SignalR no está conectado');
    }
  }

  public async detenerConexion() {
    if (this.hubConnection) {
      await this.hubConnection.stop();
      console.log('👋 SignalR Desconectado');
    }
  }
}
