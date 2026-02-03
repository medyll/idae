import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { httpDriver } from '../../src/lib/server/httpDriver';
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";

describe('Socket Integration', () => {
    let server: httpDriver;
    let clientSocket: ClientSocket;
    const TEST_PORT = 4321;

    beforeAll(async () => {
        server = new httpDriver();
        server.listen(TEST_PORT);
        
        return new Promise((resolve) => {
             clientSocket = ioc(`http://localhost:${TEST_PORT}`, {
                auth: {
                    authMode: 'Bearer',
                    Authorization: 'Bearer test-token'
                }
            });
            clientSocket.on('connect', () => {
                resolve(null);
            });
        });
    });

    afterAll(() => {
        if(server) server.close();
        if(clientSocket) clientSocket.disconnect();
    });

    it('should connect successfully', () => {
        expect(clientSocket.connected).toBe(true);
    });

    it('should receive event when hitting POST endpoint', async () => {
        // Using an existing route from cmdRoutes.json
        const testEvent = 'entity';
        
        return new Promise(async (resolve, reject) => {
            clientSocket.on(testEvent, (data) => {
                try {
                    // Expecting full data object with payload
                    expect(data.payload.hello).toBe('world');
                    resolve(null);
                } catch(e) {
                    reject(e);
                }
            });

            // Trigger via HTTP
            // We target this specific client using its socket ID
            const payload = {
                payload: { 
                    hello: 'world',
                    own: clientSocket.id 
                },
                sender: { roles: ['TEST_SYSTEM'] }
            };

            const response = await fetch(`http://localhost:${TEST_PORT}/${testEvent}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            expect(response.status).toBe(200);
        });
    });
});
