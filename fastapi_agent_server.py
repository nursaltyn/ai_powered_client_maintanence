from agents.buyers.Buyer_Workflow_Manager import WorkflowManager as BuyerWorkflowManager
from agents.buyers.BuyerQuery_Request import BuyerQueryRequest
from dotenv import load_dotenv
import os
import json
import asyncio
import time

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

# load credentials
load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
SELLER_ENDPOINT_URL = os.getenv("SELLER_ENDPOINT_URL")
GOOGLE_LLM_MODEL = os.getenv("GOOGLE_LLM_MODEL")

graph = BuyerWorkflowManager(
    api_key=API_KEY, endpoint_url=SELLER_ENDPOINT_URL,
    llm_model_name=GOOGLE_LLM_MODEL
).returnGraph()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# @app.post("/call-model")
# async def call_model(request: BuyerQueryRequest):
#     async def result_generator():
#         try:
#             for i, step_result in enumerate(graph.stream(request)):
#                 print(f"Step {i} Output:", step_result)
#                 yield step_result
#         except Exception as e:
#             raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

#     return StreamingResponse(result_generator(), media_type="application/json")

# @app.post("/call-model")
# async def call_model(request: BuyerQueryRequest):
#     async def result_generator():
#         try:
#             for i, step_result in enumerate(graph.stream(request)):
#                 print(f"Step {i} Output:", step_result)
#                 yield json.dumps(step_result) + "\n"  # Convert to JSON string
#         except Exception as e:
#             print(f"Error in streaming: {str(e)}")
#             yield json.dumps({"error": "Internal server error"}) + "\n"

#     return StreamingResponse(result_generator(), media_type="application/json")

@app.post("/call-model")
async def call_model(request: BuyerQueryRequest):
    async def result_generator():
        try:
            yield json.dumps({"status": "streaming started"}) + "\n"  # Ensures immediate response
            
            for i, step_result in enumerate(graph.stream(request)):  # Ensure graph.stream() is async iterable
                print(f"Step {i} Output:", step_result)
                await asyncio.sleep(0.1)
                yield json.dumps(step_result) + "\n"
        
        except Exception as e:
            print(f"Error in streaming: {str(e)}")
            yield json.dumps({"error": "Internal server error"}) + "\n"

    return StreamingResponse(result_generator(), media_type="application/json")


def call_negotiator_model(request: BuyerQueryRequest):
    def result_generator():
        try:
            yield json.dumps({"status": "streaming started"}) + "\n"  # Ensures immediate response
            
            for i, step_result in enumerate(graph.stream(request)):  # Assuming graph.stream() is iterable
                print(f"Step {i} Output:", step_result)
                time.sleep(0.1)  # Replacing asyncio.sleep with time.sleep
                yield json.dumps(step_result) + "\n"
        
        except Exception as e:
            print(f"Error in streaming: {str(e)}")
            yield json.dumps({"error": "Internal server error"}) + "\n"

    return StreamingResponse(result_generator(), media_type="application/json")

def get_step_results(request: BuyerQueryRequest):
    results = []
    
    try:
        for i, step_result in enumerate(graph.stream(request)):  
            print(f"Step {i} Output:", step_result)
            time.sleep(0.1)  
            results.append(step_result)
    
    except Exception as e:
        print(f"Error in streaming: {str(e)}")
        return [{"error": "Internal server error"}]

    return results  # Returns a list of step results
