import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';

// Mock Config
vi.mock('../../src/lib/server/_config/config', () => {
    return {
        _config: {
            auth: {
                jwtSecret: 'test-secret',
                introspectionUrl: 'http://test-intro.com',
                strategy: 'jwt'
            },
            corsOrigin: '*'
        }
    };
});

import { SocketIoServer } from '../../src/lib/server/socketBridge/socketIoServer';

describe('SocketIoServer Auth Logic', () => {
    let socketServer: SocketIoServer;

    beforeEach(() => {
        // Reset singleton/class if needed, here we just instantiate
        socketServer = new SocketIoServer();
    });

    it('should be defined', () => {
        expect(socketServer).toBeDefined();
    });

    // Since authorization is a private/protected middleware or bound to instance
    // We can simulate its call
    it('should validate correct JWT token', async () => {
        const validToken = jwt.sign({ user: 'test' }, 'test-secret');
        const mockSocket = {
            handshake: {
                headers: {
                    Authorization: 'Bearer ' + validToken
                },
                auth: {
                    authMode: 'Bearer'
                }
            },
            id: 'socket-1'
        };
        const nextSpy = vi.fn();

        // Access private property logic via the middleware method
        // @ts-ignore
        await socketServer.authorization(mockSocket, nextSpy);

        expect(nextSpy).toHaveBeenCalled();
        // If it failed, nextSpy would be called with Error, but here we expect success (no args)
        expect(nextSpy).toHaveBeenCalledWith();
    });

    it('should fail with invalid JWT token', async () => {
        const invalidToken = jwt.sign({ user: 'test' }, 'wrong-secret');
        const mockSocket = {
            handshake: {
                headers: {
                    Authorization: 'Bearer ' + invalidToken
                },
                auth: {
                    authMode: 'Bearer'
                }
            },
            id: 'socket-2'
        };
        const nextSpy = vi.fn();
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        // @ts-ignore
        await socketServer.authorization(mockSocket, nextSpy);
        
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Auth failed'));
        // Currently Soft-pass, so next() is called without error
        expect(nextSpy).toHaveBeenCalledWith();
    });
});
