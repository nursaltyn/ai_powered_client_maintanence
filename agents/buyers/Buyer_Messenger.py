import requests
from src.agents.LLMManager import LLMManager
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

class BuyerMessenger:
    def __init__(self, seller_endpoint_url, llm_api_key, llm_model_name):
        self.endpoint_url = seller_endpoint_url
        self.llm_manager = LLMManager(api_key=llm_api_key, llm_model_name=llm_model_name)

    def get_negotiation_offer(self, negotiation_uuid: str) -> str:
        """Get a negotiation offer from the seller"""
        try:
            response = requests.get(
                f"{self.endpoint_url}/get_negotiation_offer/{negotiation_uuid}"
            )
            response.raise_for_status()
            return response.json()['results']
        except requests.RequestException as e:
            raise Exception(f"Error fetching schema: {str(e)}")
        
    # def send_negotiation_offer(self, negotiation_offer: dict, negotiation_uuid: str) -> str:
    #     """Send a negotiation offer to the seller"""
    #     try:
    #         response = requests.post(
    #             f"{self.endpoint_url}/send_negotiation_offer",
    #             json={"negotiation_offer": negotiation_offer, "negotiation_uuid": negotiation_uuid}
    #         )
    #         response.raise_for_status()
    #         return response.json()['results']
    #     except requests.RequestException as e:
    #         raise Exception(f"Error executing query: {str(e)}")

    def send_negotiation_offer(self, buyer_negotiation_offer: dict, 
                               previous_seller_offer: dict,
                               initial_offer: bool = False) -> str:
        """Send a negotiation offer to the seller"""

        if initial_offer:
            prompt = ChatPromptTemplate.from_messages([
                ("system", '''You are an expert negotiator representing the seller in a negotiation process. 
            
                Your task is to evaluate the buyer's offer and decide whether to accept it or propose a counteroffer that aligns with the seller's requirements and constraints.

            Consider the following:
            1. If the buyer's offer is acceptable, respond with `agreement_reached: True` and return the buyer's offer as the final negotiation agreement.
            2. If the buyer's offer is not acceptable, respond with `agreement_reached: False` and provide a counteroffer that aligns with seller constraints.

            Your response must always be in the following JSON format:
            {{
                "agreement_reached": <True/False>,
                "negotiation_offer_seller": {{       
                    "price_per_unit": <integer>,
                    "lead_time": <integer>,
                    "order_quantity": <integer>,
                    "payment_terms": "<upfront/credit/installments>"
                }}
            }}

            Only respond with the JSON object and no additional text or explanations.'''),
                ("human", '''Given is the buyer's offer:
            {buyer_negotiation_offer}

            Evaluate the buyer's offer and respond in the specified JSON format.''')
            ])

        else:
            prompt = ChatPromptTemplate.from_messages([
                ("system", '''You are an expert negotiator representing the seller in a structured negotiation process.

                CONTEXT:
                - Your previous offer was: {previous_seller_offer}
                - The buyer countered with: {buyer_negotiation_offer}

                TASK:
                Analyze the buyer's counteroffer and determine whether to accept it or provide a strategic counteroffer that optimizes the seller's position.

                DECISION LOGIC:
                1. ACCEPT the buyer's offer ONLY if it meets or exceeds all minimum acceptable thresholds for the seller.
                2. COUNTER with a revised offer if the buyer's terms fall below acceptable thresholds.

                When countering, strategically adjust these four parameters:
                - price_per_unit: Prioritize maintaining profit margins
                - lead_time: Balance operational feasibility with competitiveness
                - order_quantity: Consider economies of scale and inventory constraints
                - payment_terms: Evaluate cash flow implications (upfront/credit/installments)

                Your counteroffer should move incrementally toward the buyer's position while protecting core seller interests.

            Your response must always be in the following JSON format:
            {{
                "agreement_reached": <True/False>,
                "negotiation_offer_seller": {{       
                    "price_per_unit": <integer>,
                    "lead_time": <integer>,
                    "order_quantity": <integer>,
                    "payment_terms": "<upfront/credit/installments>"
                }}
            }}

            Only respond with the JSON object and no additional text or explanations.
            NOTE: The "negotiation_offer_seller" field should contain either:
            - The buyer's exact offer terms (if agreement_reached is true)
            - Your new counteroffer terms (if agreement_reached is false)'''),
                ("human", '''Given is the buyer's counter offer:
            {buyer_negotiation_offer}

            Evaluate the buyer's offer and respond in the specified JSON format.''')
            ])

        output_parser = JsonOutputParser()
        
        response = self.llm_manager.invoke(prompt, 
                                            previous_seller_offer=previous_seller_offer, 
                                            buyer_negotiation_offer=buyer_negotiation_offer, 
                                            response_format={"type": "json_object"})
        parsed_response = output_parser.parse(response)
        return parsed_response