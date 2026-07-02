from fastapi import FastAPI
app= FastAPI(
    title="PhishX API",
    version="1.0.0"
)
@app.get("/")
def home():
    return{"message":"welcome to phishx backend"}