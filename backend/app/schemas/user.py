from pydantic import BaseModel, Field, field_validator


class UserCreate(BaseModel):
    # 1. Add aliases to match the frontend keys perfectly
    operator_id: str = Field(..., alias="operatorId")
    neural_key: str = Field(..., alias="neuralKey")

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

    # 2. Tell Pydantic to allow using underscores internally in your routes
    model_config = {
        "populate_by_name": True
    }


class UserLogin(BaseModel):
    # Do the exact same thing for the login schema!
    operator_id: str = Field(..., alias="operatorId")
    neural_key: str = Field(..., alias="neuralKey")

    model_config = {
        "populate_by_name": True
    }