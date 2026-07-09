from pydantic import BaseModel, field_validator


class UserCreate(BaseModel):
    operator_id: str
    neural_key: str

    @field_validator('operator_id')
    @classmethod
    def operator_id_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Operator ID cannot be empty')
        return v.strip()

    @field_validator('neural_key')
    @classmethod
    def neural_key_min_length(cls, v):
        if len(v) < 6:
            raise ValueError('Neural Key must be at least 6 characters')
        return v


class UserLogin(BaseModel):
    operator_id: str
    neural_key: str