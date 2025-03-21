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

LLM_MODEL = os.getenv("LLM_MODEL")

if LLM_MODEL == "GOOGLE":
    LLM_MODEL_NAME = os.getenv("GOOGLE_LLM_MODEL")
    API_KEY = os.getenv("GOOGLE_API_KEY")
else:
    LLM_MODEL_NAME = os.getenv("MISTRAL_LLM_MODEL")
    API_KEY = os.getenv("MISTRAL_API_KEY")

SELLER_ENDPOINT_URL = os.getenv("SELLER_ENDPOINT_URL")

graph = BuyerWorkflowManager(
    api_key=API_KEY, endpoint_url=SELLER_ENDPOINT_URL,
    llm_model_name=LLM_MODEL_NAME,
    llm_model=LLM_MODEL
).returnGraph()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/call-model")
async def call_model(request: BuyerQueryRequest):
    filtered_result = {}
    filtered_result['negotiation_attempts']=[]

    try:
        for i, step_result in enumerate(graph.stream(request)):
            # print(f"Step {i} Output:", step_result)
            if i>=2:
                # Extract the specific values you need
                first_key = next(iter(step_result))
                negotiation_data = step_result.get(first_key, {})
                result_dict = {'attempt': negotiation_data.get('negotiation_attempts'),
                    'current_negotiation_offer_buyer': negotiation_data.get('current_negotiation_offer_buyer'),
                    'current_negotiation_offer_seller': negotiation_data.get('current_negotiation_offer_seller')
                }
                filtered_result['negotiation_attempts'].append(result_dict)
            else:
                filtered_result.update(step_result)

            # yield json.dumps(filtered_result) + "\n"  # Convert to JSON string
    except Exception as e:
        print(f"Error in streaming: {str(e)}")

    return filtered_result

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
