import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from '@environment';
import { RegisterEntity } from 'src/app/core/domain/entitys/register.entity';
import { ObservationEntity } from 'src/app/core/domain/entitys/observation.entity';
import { LogLevel } from '@microsoft/signalr';
import { AdvertenciaEntity } from 'src/app/core/domain/entitys/advertencia.entity';

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
  private updateAntisipo = new Subject<any>();
  private updateTotal = new Subject<any>();
  private updateRol = new Subject<any>();
  private newAdvertencia = new Subject<AdvertenciaEntity>();
  private deleteAdvertencia = new Subject<string>();
  private updateAdvertencia = new Subject<AdvertenciaEntity>();

  deleteRegistro$ = this.deleteRegsiter.asObservable();
  newRegistro$ = this.newRegister.asObservable();
  newObservation$ = this.newObservation.asObservable();
  deleteObservacion$ = this.deleteObservacion.asObservable();
  updateRegistro$ = this.updateRegister.asObservable();
  revokeSession$ = this.revokeSession.asObservable();
  updateTotal$ = this.updateTotal.asObservable();
  updateAntisipo$ = this.updateAntisipo.asObservable();
  updateRol$ = this.updateRol.asObservable();
  newAdvertencia$ = this.newAdvertencia.asObservable();
  deleteAdvertencia$ = this.deleteAdvertencia.asObservable();
  updateAdvertencia$ = this.updateAdvertencia.asObservable();

  public async conectar() {
    if (
      this.hubConnection?.state === signalR.HubConnectionState.Connected ||
      this.hubConnection?.state === signalR.HubConnectionState.Connecting
    ) {
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.signalR}/register`, { withCredentials: true })
      .configureLogging(
        environment.production ? LogLevel.None : LogLevel.Information,
      )
      .withAutomaticReconnect()
      .build();

    this.registerHandler('RegistroActualizado', this.updateRegister);
    this.registerHandler('RegistroCreado', this.newRegister);
    this.registerHandler('RegistroEliminado', this.deleteRegsiter);
    this.registerHandler('ObservacionEliminada', this.deleteObservacion);
    this.registerHandler('ObservacionCreada', this.newObservation);
    this.registerHandler('SesionRevoked', this.revokeSession);
    this.registerHandler('UpdateTotal', this.updateTotal);
    this.registerHandler('UpdateAntisipo', this.updateAntisipo);
    this.registerHandler('UpdateRol', this.updateRol);
    this.registerHandler('AdvertenciaCreated', this.newAdvertencia);
    this.registerHandler('AdvertenciaDeleted', this.deleteAdvertencia);
    this.registerHandler('AdvertenciaUpdated', this.updateAdvertencia);

    try {
      await this.hubConnection.start();
      console.log('🚀 Conexión SignalR establecida con éxito');
    } catch (err) {
      console.error('❌ Error al conectar a SignalR:', err);
    }
  }

  private registerHandler<T>(event: string, subject: Subject<T>) {
    this.hubConnection.on(event, (data: T) => {
      subject.next(data);
    });
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
