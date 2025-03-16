from langgraph.graph import StateGraph
from agents.buyers.Buyer_State import BuyerNegotiatorState
from agents.buyers.BuyerNegotiator_Agent import BuyerNegotiatorAgent
from langgraph.graph import END
from typing import List

class WorkflowManager:
    def __init__(self, api_key: str, endpoint_url:str, llm_model_name:str):
        self.negotiator_agent = BuyerNegotiatorAgent(API_KEY=api_key, 
                                                     SELLER_ENDPOINT_URL=endpoint_url,
                                                     LLM_MODEL_NAME=llm_model_name)

    def create_workflow(self) -> StateGraph:
        """Create and configure the workflow graph."""
        workflow = StateGraph(input=BuyerNegotiatorState, output=BuyerNegotiatorState)

        # Add nodes to the graph
        workflow.add_node("get_product_demand_forecast", self.negotiator_agent.get_product_demand_forecast)
        workflow.add_node("identify_buyer_profile", self.negotiator_agent.identify_buyer_profile)
        workflow.add_node("initiate_negotiation", self.negotiator_agent.initiate_negotiation)
        workflow.add_node("continue_negotiation", self.negotiator_agent.continue_negotiation)
        workflow.add_node("generate_email_client", self.negotiator_agent.generate_email_client)

        # Define edges
        workflow.add_edge("get_product_demand_forecast", "identify_buyer_profile")
        workflow.add_edge("identify_buyer_profile", "initiate_negotiation")
        
        # workflow.add_conditional_edges(
        #     "initiate_negotiation",
        #     lambda state: "generate_email_client" if state["agreement_reached"] else (
        #         END if state["negotiation_attempts"] >= 3 else "continue_negotiation"
        #     ),
        #     {"generate_email_client": "generate_email_client", END: END, "continue_negotiation": "continue_negotiation"}
        # )

        workflow.add_edge("initiate_negotiation", "continue_negotiation")

    #     workflow.add_conditional_edges(
    #     "initiate_negotiation",
    #     lambda state: (
    #         "generate_email_client" if state["agreement_reached"] else 
    #         ("continue_negotiation" if state["negotiation_attempts"] < state["max_negotiation_attempts"] else END)
    #     ),
    #     {"generate_email_client": "generate_email_client", END: END, "continue_negotiation": "continue_negotiation"}
    # )
        workflow.add_conditional_edges(
        "continue_negotiation",
        lambda state: (
            "generate_email_client" if state["agreement_reached"] else
            ("continue_negotiation" if state["negotiation_attempts"] < state["max_negotiation_attempts"] else END)
        ),
        {"generate_email_client": "generate_email_client", END: END, "continue_negotiation": "continue_negotiation"}
    )


        workflow.set_entry_point("get_product_demand_forecast")

        return workflow
    
    def returnGraph(self):
        return self.create_workflow().compile()
