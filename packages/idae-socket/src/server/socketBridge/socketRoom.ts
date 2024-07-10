'use strict'

class socketRoomsInstance {
    _sid: string;
	private rooms: Record<string,any>;
	
	constructor() {
		
		this._sid = 'id';
		
		this.rooms = {}
		
	}

	
	leaveRoom() {
	
	}
	
	createRoom(room: string) {
		if ( !this.rooms[room] ) this.rooms[room] = {}
	}
	
	joinRoom(socketObj: any, room_name: string) {
		this.rooms[room_name][socketObj[this._sid]] = socketObj;
		socketObj.join(room_name, () => {
			let rooms = Object.keys(socketObj.rooms);
			console.log(rooms);
		});
	}
	
	/**
	 *
	 * @param roomList
	 */
	createAggregateRoom(roomList = []) {
		//
		const concatenateRoom       = roomList.join ('_');
		this.rooms[concatenateRoom] = roomList.map ((room) => {
			return this.rooms[room]
		}).reduce ((accumulator, other) => {
			
			return Object.assign (accumulator, other)
		}, {});
	}
	
	createTestRooms() {
		this.rooms = {
			first  : {
				poit  : { [this._sid] : 'poit' },
				poit2 : { [this._sid] : 'poit2' }
			},
			second : {
				fds  : { [this._sid] : 'fds' },
				gfhg : { [this._sid] : 'gfhg' }
				
			},
			third  : {
				bvc : { [this._sid] : 'bvc' },
				kjh : { [this._sid] : 'kjh' }
				
			},
			fourth : {
				xvb : { [this._sid] : 'groot' },
				nhg : { [this._sid] : 'groot tooo' }
			},
			
		}
	}
}

export const socketRoom = new socketRoomsInstance ();

