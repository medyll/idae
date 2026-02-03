import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { httpDriver } from '../../src/lib/server/httpDriver';
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";

describe('Advanced Integration Features', () => {
    let server: httpDriver;
    let clientSocket: ClientSocket;
    const CUSTOM_PORT = 4322; // Different port than standard test

    beforeAll(async () => {
        // Initialize server with Custom Config and Payload Mapper
        server = new httpDriver({
            defaultPort: CUSTOM_PORT,
            corsOrigin: '*',
            auth: {
                strategy: 'none',
                jwtSecret: 'test',
                introspectionUrl: ''
            },
            // MAPPER: Transform a "Legacy" flat payload into our internal structure
            payloadMapper: (legacyData: any) => {
                return {
                    rooms: legacyData.target_groups || [],
                    sender: {
                        roles: ['SYSTEM'],
                        cookie: legacyData.session_cookie
                    },
                    payload: {
                        ...legacyData.data,
                        // If legacy data has a target_user, map it to 'own' to target specific socket
                        own: legacyData.target_user_socket_id
                    }
                };
            }
        });
        
        server.listen(CUSTOM_PORT);
        
        return new Promise((resolve) => {
             clientSocket = ioc(`http://localhost:${CUSTOM_PORT}`, {
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

    it('should transform legacy payload using payloadMapper', async () => {
        const testEvent = 'entity';
        
        return new Promise(async (resolve, reject) => {
            // Client listens for the standardized event
            clientSocket.on(testEvent, (standardizedData) => {
                try {
                    // Check if mapper correctly moved data around
                    expect(standardizedData.payload.message).toBe('legacy hello');
                    expect(standardizedData.sender.cookie).toBe('legacy_cookie_123');
                    expect(standardizedData.rooms).toContain('ADMIN_GROUP');
                    resolve(null);
                } catch(e) {
                    reject(e);
                }
            });

            // Simulate a Legacy System POST request (Flat structure)
            const legacyPayload = {
                target_groups: ['ADMIN_GROUP'],
                session_cookie: 'legacy_cookie_123',
                target_user_socket_id: clientSocket.id, // Target this client
                data: {
                    message: 'legacy hello',
                    some_id: 999
                }
            };

            const response = await fetch(`http://localhost:${CUSTOM_PORT}/${testEvent}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(legacyPayload)
            });
            
            expect(response.status).toBe(200);
        });
    });
});
