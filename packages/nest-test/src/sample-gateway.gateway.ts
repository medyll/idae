// This file defines a WebSocket gateway for real-time communication in NestJS.
// Gateways enable bidirectional communication between client and server using WebSockets.

// Decorator: Marks this class as a NestJS WebSocket gateway.
import { SubscribeMessage, WebSocketGateway, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { SampleGuardGuard } from './sample-guard.guard';
import { SampleInterceptorInterceptor } from './sample-interceptor.interceptor';
import { SampleInterface } from './sample-interface.interface';

@WebSocketGateway()
// Decorator: Applies the custom guard to all WebSocket events in this gateway.
@UseGuards(SampleGuardGuard) 
// Decorator: Applies the custom interceptor to all WebSocket events in this gateway.
@UseInterceptors(SampleInterceptorInterceptor) 
export class SampleGatewayGateway {
  // Decorator: Handles incoming WebSocket messages with event name 'message'.
  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: any, @MessageBody() payload: any): string {
    console.log('Received message from client:', payload);
    client.emit('message', 'Hello from server!');
    return 'Hello world!';
  }

  // Example usage of SampleInterface for type safety
  @SubscribeMessage('typed-message')
  handleTypedMessage(
    @ConnectedSocket() client: any,
    @MessageBody() payload: SampleInterface,
  ): string {
    console.log('Received typed message:', payload);
    client.emit('typed-message', 'Typed message received!');
    return 'Typed message processed!';
  }
}
