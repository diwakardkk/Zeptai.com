from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from hashlib import sha256

from app.core.companion_config import companion_settings
from app.core.logging import get_logger
from app.db.database import DBCompanionUsage, SessionLocal

logger = get_logger(__name__)


@dataclass
class CompanionUsageSnapshot:
    turns_used: int
    credit_balance: int
    demo_locked: bool

    @property
    def remaining_free_turns(self) -> int:
        return max(companion_settings.max_turns - self.turns_used, 0)

    @property
    def access_locked(self) -> bool:
        return self.demo_locked and self.credit_balance <= 0


def _hash_client_id(client_id: str) -> str:
    return sha256(client_id.encode("utf-8")).hexdigest()


def get_or_create_usage(client_id: str) -> CompanionUsageSnapshot:
    client_id_hash = _hash_client_id(client_id)
    db = SessionLocal()
    try:
        row = db.query(DBCompanionUsage).filter_by(client_id_hash=client_id_hash).first()
        now = datetime.utcnow()
        if row is None:
            row = DBCompanionUsage(
                client_id_hash=client_id_hash,
                turns_used=0,
                credit_balance=0,
                demo_locked=False,
                first_seen_at=now,
                last_seen_at=now,
            )
            db.add(row)
        else:
            row.last_seen_at = now
        db.commit()
        return CompanionUsageSnapshot(
            turns_used=int(row.turns_used or 0),
            credit_balance=int(row.credit_balance or 0),
            demo_locked=bool(row.demo_locked),
        )
    finally:
        db.close()


def consume_turn(client_id: str) -> CompanionUsageSnapshot:
    client_id_hash = _hash_client_id(client_id)
    db = SessionLocal()
    try:
        row = db.query(DBCompanionUsage).filter_by(client_id_hash=client_id_hash).first()
        now = datetime.utcnow()
        if row is None:
            row = DBCompanionUsage(
                client_id_hash=client_id_hash,
                turns_used=0,
                credit_balance=0,
                demo_locked=False,
                first_seen_at=now,
                last_seen_at=now,
            )
            db.add(row)

        if row.demo_locked and (row.credit_balance or 0) <= 0:
            db.commit()
            return CompanionUsageSnapshot(
                turns_used=int(row.turns_used or 0),
                credit_balance=int(row.credit_balance or 0),
                demo_locked=bool(row.demo_locked),
            )

        row.turns_used = int(row.turns_used or 0) + 1
        row.last_seen_at = now
        if row.turns_used >= companion_settings.max_turns and (row.credit_balance or 0) <= 0:
            row.demo_locked = True
            row.locked_at = now

        db.commit()
        return CompanionUsageSnapshot(
            turns_used=int(row.turns_used or 0),
            credit_balance=int(row.credit_balance or 0),
            demo_locked=bool(row.demo_locked),
        )
    except Exception as exc:
        db.rollback()
        logger.warning(f"Companion usage consume error: {exc}")
        raise
    finally:
        db.close()