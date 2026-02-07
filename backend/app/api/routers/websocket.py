"""
WebSocket router for real-time updates
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.websocket_manager import manager
from app.db.database import SessionLocal
from app.services.transaction_service import TransactionService

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await manager.connect(websocket)
    try:
        # Send initial outstanding total when client connects
        db = SessionLocal()
        try:
            total = TransactionService.calculate_outstanding_total(db)
            await manager.send_personal_message({
                "type": "outstanding_total",
                "data": {"total": total}
            }, websocket)
        finally:
            db.close()
        
        # Keep connection alive and handle incoming messages
        while True:
            try:
                # Wait for any message (text or ping/pong)
                message = await websocket.receive()
                # Handle ping/pong for keepalive
                if message.get("type") == "websocket.receive":
                    # Client can send ping or we just keep connection alive
                    pass
            except Exception:
                # Connection closed or error
                break
    except WebSocketDisconnect:
        manager.disconnect(websocket)
