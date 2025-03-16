from typing import List, Any, Annotated, Dict
from typing_extensions import TypedDict
import operator
from pydantic import BaseModel

class InputState(TypedDict):
    question: str
    file_uuids: List[str]
    parsed_question: Dict[str, Any]
    project_uuid: str
    unique_nouns: List[str]
    sql_query: str
    results: List[Any]
    visualization: Annotated[str, operator.add]
    formatted_data_for_visualization: Dict[str, Any]

    

class OutputState(TypedDict):
    parsed_question: Dict[str, Any]
    unique_nouns: List[str]
    project_uuid: str
    sql_query: str
    sql_valid: bool
    sql_issues: str
    results: List[Any]
    answer: Annotated[str, operator.add]
    error: str
    visualization: Annotated[str, operator.add]
    visualization_reason: Annotated[str, operator.add]
    visualization_summary: str
    formatted_data_for_visualization: Dict[str, Any]


class SellerNegotiatorState(BaseModel):

    # seller details
    seller_name: str
    seller_id: str
    seller_type: str # "<Medium-Sized Business, Large Corporation, Government Agency>"
    negotiation_style: str # "<Aggressive/Balanced/Conciliatory>"
    price_sensitivity: str # "<High/Medium/Low>"


    min_acceptable_unit_price: float  # Minimum price the seller is willing to accept
    max_acceptable_unit_price: float  # Maximum price the seller aims for
    min_delivery_time: float  # Shortest delivery time seller can offer
    max_delivery_time: float  # Longest acceptable delivery time
    min_lead_time: float  # Minimum time required to start production
    max_lead_time: float  # Maximum time acceptable before order is canceled
    min_order_quantity: float  # Smallest order seller is willing to fulfill
    max_order_quantity: float  # Largest order seller can handle
    bulk_discount_threshold: float  # Order quantity at which discount applies
    bulk_discount_rate: float  # Percentage discount for bulk orders
    payment_terms: List[str]  # Accepted payment terms (e.g., Net 30, Net 60)
    inventory_availability: bool  # Whether stock is available for immediate shipping
    certification_available: bool  # Whether seller can provide required certifications
    sustainability_compliance: bool  # Whether seller meets buyer's sustainability requirements
