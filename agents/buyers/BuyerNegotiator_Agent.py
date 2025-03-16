
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import JsonOutputParser
from agents.buyers.Buyer_Messenger import BuyerMessenger
from agents.LLMManager import LLMManager
from datetime import datetime

class BuyerNegotiatorAgent:
    def __init__(self, API_KEY, SELLER_ENDPOINT_URL, LLM_MODEL_NAME):
        self.buyer_messenger = BuyerMessenger(seller_endpoint_url=SELLER_ENDPOINT_URL,
                                              llm_api_key=API_KEY, 
                                              llm_model_name=LLM_MODEL_NAME)
        self.llm_manager = LLMManager(api_key=API_KEY, llm_model_name=LLM_MODEL_NAME)

    def get_product_demand_forecast(self, state: dict) -> dict:
        """Forecast product demand based on historical sales data."""

        product_name = state['product_name']
        prompt = ChatPromptTemplate.from_messages([
            ("system", '''You are a data analyst that specializes in forecasting product demand. 
        Your task is to analyze the demand for a given product and provide actionable recommendations for inventory adjustments. 

        Your response should always be in the following JSON format:
        {{
            "current_demand": "<High/Medium/Low>",
            "action": "<+X%/-X%>" 
        }}

        Only respond with the JSON object and no additional text or explanations.'''),
            ("human", "Give demand forecast for product {product_name}:")
        ])

        output_parser = JsonOutputParser()
        
        response = self.llm_manager.invoke(prompt, product_name=product_name, response_format={"type": "json_object"})
        parsed_response = output_parser.parse(response)

        # add a log statement to see the forecast
        # print(f"Forecast for product {product_name}: {parsed_response}")

        return {"product_demand_forecast": parsed_response}


    def identify_buyer_profile(self, state: dict) -> dict:
        """Forecast product demand based on historical sales data."""
        buyer_type = state["buyer_type"]
        negotiation_style = state["negotiation_style"]
        price_sensitivity = state["price_sensitivity"]
        return {
            "buyer_type": buyer_type,
            "negotiation_style": negotiation_style,
            "price_sensitivity": price_sensitivity
            }

    def initiate_negotiation(self, state: dict) -> dict:
        """Initiate a negotiation with the seller based on the buyer's profile, price thresholds, etc."""     

        # Extract buyer and negotiation parameters
        parameters = {
            "buyer_preferences": {key: state[key] for key in ["negotiation_style", "buyer_type", "price_sensitivity"]},
            "negotiation_constraints": {key: state[key] for key in [
            "min_unit_price", "max_unit_price", "min_delivery_time", "max_delivery_time",
            "min_lead_time", "max_lead_time", "min_order_quantity", "max_order_quantity",
            "expected_discount", "requirement_of_certification", "sustainability_requirement",
            "product_urgency_rate"
            ]},
            "product_demand_forecast": state["product_demand_forecast"]
        }

        # create a negotiation id from current timestamp YYMMDDHHMMSS
        negotiation_id = datetime.now().strftime("%Y%m%d%H%M%S")
        state["negotiation_id"] = negotiation_id
        state["negotiation_history_buyer"]={}
        state["negotiation_history_seller"]={}

        prompt = ChatPromptTemplate.from_messages([
            ("system", '''You are an expert negotiator specializing in analyzing buyer preferences, product demand forecasts, and negotiation parameters to provide optimal offers. 
        Your task is to evaluate the given information and propose a negotiation offer that aligns with the buyer's requirements, product demand, and constraints.

        Consider the following parameters:
        - Buyer preferences: negotiation_style, buyer_type, price_sensitivity
        - Negotiation constraints: min_unit_price, max_unit_price, min_delivery_time, max_delivery_time, min_lead_time, max_lead_time, min_order_quantity, max_order_quantity, expected_discount, requirement_of_certification, sustainability_requirement, product_urgency_rate
        - Product demand forecast: {{ "current_demand": "<High/Medium/Low>", "action": "<+X%/-X%>" }}

        Based on these inputs:
        1. Ensure the price_per_unit remains within the range of min_unit_price and max_unit_price.
        2. Lead time should be between min_lead_time and max_lead_time.
        3. Order quantity should respect the range of min_order_quantity and max_order_quantity.
        4. Payment terms should be reasonable based on buyer type and negotiation style.

        Your response must always be in the following JSON format:
        {{
            "price_per_unit": <integer>,
            "lead_time": <integer>,
            "order_quantity": <integer>,
            "payment_terms": "<upfront/credit/installments>"
        }}

        Only respond with the JSON object and no additional text or explanations.'''),
            ("human", '''Given the following parameters:
            {parameters}

        Provide a negotiation offer in suggested JSON format.''')
        ])


        output_parser = JsonOutputParser()
        response = self.llm_manager.invoke(prompt, parameters=parameters, response_format={"type": "json_object"})
        negotiation_offer_buyer = output_parser.parse(response)
        negotiation_offer_buyer["negotiation_id"] = negotiation_id

        # send negotiation request to seller
        seller_response = self.buyer_messenger.send_negotiation_offer(buyer_negotiation_offer=negotiation_offer_buyer,
                                                                      previous_seller_offer=None,
                                                                      initial_offer=True)

        state["agreement_reached"] = seller_response["agreement_reached"]
        state["current_negotiation_offer_seller"] = seller_response["negotiation_offer_seller"]

        # state["negotiation_attempts"] = state.get("negotiation_attempts", 0) + 1
        state["current_negotiation_offer_buyer"] = negotiation_offer_buyer
        
        # add a log statement to know current negotiation status
        # print("Inside initiate_negotiation function")
        # print(f"Negotiation attempts: {state.get("negotiation_attempts", 0) + 1}")
        # print(f"Negotiation status: {state['agreement_reached']}")
        # print(f"Offer from buyer: {state['current_negotiation_offer_buyer']}")
        # print(f"Offer from seller: {state['current_negotiation_offer_seller']}")
        print(f"Buyer negotiation history: {state['negotiation_history_buyer']}")
        print(f"Seller negotiation history: {state['negotiation_history_seller']}")
        print("===========================")

        state["negotiation_history_buyer"].update({"attempt_"+str(state.get("negotiation_attempts", 0)): negotiation_offer_buyer})
        state["negotiation_history_seller"].update({"attempt_"+str(state.get("negotiation_attempts", 0)): seller_response["negotiation_offer_seller"]})

        # print(f"Buyer negotiation history: {state["negotiation_history_buyer"]}")
        # print(f"Seller negotiation history: {state["negotiation_history_seller"]}")

        return {"negotiation_id": negotiation_id, 
                "negotiation_attempts": state.get("negotiation_attempts", 0) + 1,
                "current_negotiation_offer_buyer": negotiation_offer_buyer, 
                "current_negotiation_offer_seller": seller_response["negotiation_offer_seller"],
                "agreement_reached": seller_response["agreement_reached"],
                "negotiation_history_buyer": state["negotiation_history_buyer"],
                "negotiation_history_seller": state["negotiation_history_seller"]}

    def generate_email_client(self, state: dict):
        
        # print("Inside generate_email_client function")

        product_id = state["product_id"]
        negotiation_id = state["negotiation_id"] 

        # extract data from negotiation id
        date_of_request = datetime.strptime(negotiation_id, "%Y%m%d%H%M%S")

        # get time now
        date_of_now = datetime.now()
        
        email = f'''Dear {state['buyer_name']},
        
        We are writing to provide you with an update on your maintenance request from {date_of_request}.

        The status for product id {product_id} has been updated to: COMPLETED
        Last Updated: {date_of_now}

        Please don't hesitate to contact us if you have any questions.

        Best regards,
        Maintenance Team
        '''

        print(f"Email sent to buyer: {email}")

        return {"message_to_the_client": email}

    def continue_negotiation(self, state: dict) -> dict:

        print("Inside continue_negotiation function")


        previous_negotiation_offer = state["current_negotiation_offer_buyer"]
        negotiation_id = previous_negotiation_offer["negotiation_id"]

        negotiation_history_buyer = state["negotiation_history_buyer"],
        negotiation_history_seller = state["negotiation_history_seller"]

        # Extract buyer and negotiation parameters
        parameters = {
            "buyer_preferences": {key: state[key] for key in ["negotiation_style", "buyer_type", "price_sensitivity"]},
            "negotiation_constraints": {key: state[key] for key in [
            "min_unit_price", "max_unit_price", "min_delivery_time", "max_delivery_time",
            "min_lead_time", "max_lead_time", "min_order_quantity", "max_order_quantity",
            "expected_discount", "requirement_of_certification", "sustainability_requirement",
            "product_urgency_rate"
            ]},
            "product_demand_forecast": state["product_demand_forecast"]
        }


        prompt = ChatPromptTemplate.from_messages([
            ("system", '''You are an expert negotiator representing the buyer in a structured negotiation process.
            CONTEXT:
                - Your previous offer was: {previous_negotiation_offer_by_buyer}
                - The seller countered with: {counter_seller_offer}
            
             Here is the history of negotiations that took place between you and the seller:
             Your negotiation history:
             {negotiation_history_buyer}
             
             Seller's negotiation history:
             {negotiation_history_seller}
             
             TASK: 
             Analyze the seller's counteroffer and determine whether to accept it or provide a strategic counteroffer that optimizes the buyer's position.
             You may consider increasing order quantity size if the seller doesn't decrease the price per unit.           

            Consider the following parameters:
            - Buyer preferences: negotiation_style, buyer_type, price_sensitivity
            - Negotiation constraints: min_unit_price, max_unit_price, min_delivery_time, max_delivery_time, min_lead_time, max_lead_time, min_order_quantity, max_order_quantity, expected_discount, requirement_of_certification, sustainability_requirement, product_urgency_rate
            - Product demand forecast: {{ "current_demand": "<High/Medium/Low>", "action": "<+X%/-X%>" }}
            - Previous negotiation offer: {{ 
                "price_per_unit": <integer>, 
                "lead_time": <integer>, 
                "order_quantity": <integer>, 
                "payment_terms": "<upfront/credit/installments>" 
            }}

            Based on these inputs:
            1. Ensure the price_per_unit remains within the range of min_unit_price and max_unit_price.
            2. Lead time should be between min_lead_time and max_lead_time.
            3. Order quantity should respect the range of min_order_quantity and max_order_quantity.
            4. Payment terms should be reasonable based on buyer type and negotiation style.
            5. Adjust your new offer based on the previous negotiation offer while adhering to all constraints.

            Your response must always be in the following JSON format:
            {{
                "price_per_unit": <integer>,
                "lead_time": <integer>,
                "order_quantity": <integer>,
                "payment_terms": "<upfront/credit/installments>"
            }}

            Only respond with the JSON object and no additional text or explanations.'''),
            ("human", '''Below are the following buyer parameters:
            {parameters}

        Propose a new negotiation offer in suggested JSON format.''')
        ])


        output_parser = JsonOutputParser()
        response = self.llm_manager.invoke(prompt, parameters=parameters, 
                                           previous_negotiation_offer_by_buyer=state['current_negotiation_offer_buyer'], 
                                           counter_seller_offer=state['current_negotiation_offer_seller'], 
                                           negotiation_history_buyer=state['negotiation_history_buyer'],
                                           negotiation_history_seller=state['negotiation_history_seller'],                                           
                                           response_format={"type": "json_object"})
        
        negotiation_offer_buyer = output_parser.parse(response)
        negotiation_offer_buyer["negotiation_id"] = negotiation_id

        # send negotiation request to seller
        seller_response = self.buyer_messenger.send_negotiation_offer(buyer_negotiation_offer=negotiation_offer_buyer,
                                                                      previous_seller_offer=state["current_negotiation_offer_seller"],
                                                                      negotiation_history_buyer=negotiation_history_buyer,
                                                                      negotiation_history_seller=negotiation_history_seller)

        state["agreement_reached"] = seller_response["agreement_reached"]
        state["current_negotiation_offer_seller"] = seller_response["negotiation_offer_seller"]

        # state["negotiation_attempts"] = state.get("negotiation_attempts", 0) + 1
        state["current_negotiation_offer_buyer"] = negotiation_offer_buyer
        
        # check the difference between buyers and sellers quote:
        buyer_price_per_unit = negotiation_offer_buyer["price_per_unit"]
        seller_price_per_unit = seller_response["negotiation_offer_seller"]["price_per_unit"]
        
        if abs(buyer_price_per_unit - seller_price_per_unit) < 0.2:
            seller_response["agreement_reached"] = True
        

        # add a log statement to know current negotiation status
        # print("Inside continue_negotiation function")
        # print("Negotiation id: ", negotiation_id)
        # print(f"Negotiation attempts: {state.get("negotiation_attempts", 0) + 1}")
        # print(f"Negotiation status: {seller_response["agreement_reached"]}")
        print(f"Offer from buyer: {state['current_negotiation_offer_buyer']}")
        print(f"Offer from seller: {state['current_negotiation_offer_seller']}")
        print("===========================")

        state["negotiation_history_buyer"].update({"attempt_"+str(state.get("negotiation_attempts", 0)): negotiation_offer_buyer})
        state["negotiation_history_seller"].update({"attempt_"+str(state.get("negotiation_attempts", 0)): seller_response["negotiation_offer_seller"]})
        
        return {"negotiation_id": negotiation_id, 
                "negotiation_attempts": state.get("negotiation_attempts", 0) + 1,
                "current_negotiation_offer_buyer": negotiation_offer_buyer, 
                "current_negotiation_offer_seller": seller_response["negotiation_offer_seller"],
                "agreement_reached": seller_response["agreement_reached"],
                "negotiation_history_buyer": state["negotiation_history_buyer"],
                "negotiation_history_seller": state["negotiation_history_seller"]}


