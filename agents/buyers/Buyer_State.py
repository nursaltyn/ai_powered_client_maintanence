from typing import List, Any, Annotated, Dict
from typing_extensions import TypedDict
import operator
from pydantic import BaseModel

# class InputState(TypedDict):
#     question: str
#     file_uuids: List[str]
#     parsed_question: Dict[str, Any]
#     project_uuid: str
#     unique_nouns: List[str]
#     sql_query: str
#     results: List[Any]
#     visualization: Annotated[str, operator.add]
#     formatted_data_for_visualization: Dict[str, Any]

# class OutputState(TypedDict):
#     parsed_question: Dict[str, Any]
#     unique_nouns: List[str]
#     project_uuid: str
#     sql_query: str
#     sql_valid: bool
#     sql_issues: str
#     results: List[Any]
#     answer: Annotated[str, operator.add]
#     error: str
#     visualization: Annotated[str, operator.add]
#     visualization_reason: Annotated[str, operator.add]
#     visualization_summary: str
#     formatted_data_for_visualization: Dict[str, Any]


class BuyerNegotiatorState(TypedDict):

    # buyer details
    buyer_name: str
    buyer_id: str
    buyer_type: str # "<Medium-Sized Business, Large Corporation, Government Agency>"
    negotiation_style: str # "<Aggressive/Balanced/Conciliatory>"
    price_sensitivity: str # "<High/Medium/Low>"

    # product details
    product_name: str
    product_id: str
    min_unit_price: float
    max_unit_price: float
    min_delivery_time: float
    max_delivery_time: float
    min_lead_time: float
    max_lead_time: float
    min_order_quantity: float
    max_order_quantity: float
    expected_discount: float
    requirement_of_certification: bool
    sustainability_requirement: bool

    # product urgency rate
    product_urgency_rate: float

    # product demand forecast
    product_demand_forecast: Dict[str, Any]

    # intermediate negotiation decisions
    current_negotiation_offer_buyer: str
    current_negotiation_offer_seller: str

    # final negotiation decisions
    final_negotiation_decision_buyer: str
    final_negotiation_decision_seller: str

    # negotiation parameters
    negotiation_id: int
    negotiation_attempts: int
    max_negotiation_attempts: int
    send_confirmation_email: bool

    # agreement
    agreement_reached: bool
    message_to_the_buyer: str





