"""
WebSocket connection manager for real-time updates
"""
from typing import List
from fastapi import WebSocket
import json


class ConnectionManager:
    """Manages WebSocket connections and broadcasts messages"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send message to a specific connection"""
        await websocket.send_json(message)
    
    async def broadcast(self, message: dict):
        """Broadcast message to all connected clients"""
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)
        
        # Remove disconnected connections
        for conn in disconnected:
            self.disconnect(conn)
    
    async def broadcast_update(self, event_type: str, data: dict):
        """Broadcast a standardized update message"""
        message = {
            "type": event_type,
            "data": data
        }
        await self.broadcast(message)


# Global connection manager instance
manager = ConnectionManager()
