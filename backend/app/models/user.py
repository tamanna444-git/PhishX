from sqlalchemy import Column, Integer, String
from backend.app.database.database import Base

# Change "User" to "DBUser"
class DBUser(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    operator_id = Column(String, unique=True, index=True, nullable=False)
    neural_key = Column(String, nullable=False)