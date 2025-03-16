from pydantic import BaseModel
class BuyerQueryRequest(BaseModel):
    # buyer details
    buyer_name: str
    buyer_id: str
    buyer_type: str # "<Medium-Sized Business, Large Corporation, Government Agency>"
    negotiation_style: str # "<Aggressive/Balanced/Conciliatory>"
    price_sensitivity: str # "<High/Medium/Low>"
    max_negotiation_attempts: int

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
    product_urgency_rate: float

buyer_query_request = BuyerQueryRequest(
    buyer_name="Jason",
    buyer_id="B123",
    buyer_type="Medium-Sized Business",
    negotiation_style="Balanced", #"<Aggressive/Balanced/Conciliatory>"
    price_sensitivity="Medium", # "<High/Medium/Low>"
    product_name="Widget",
    product_id="P456",
    min_unit_price=10.0,
    max_unit_price=20.0,
    min_delivery_time=2.0,
    max_delivery_time=5.0,
    min_lead_time=1.0,
    max_lead_time=3.0,
    min_order_quantity=100,
    max_order_quantity=500,
    expected_discount=0.05,
    requirement_of_certification=True,
    sustainability_requirement=False,
    product_urgency_rate=0.77,
    max_negotiation_attempts=7
)

# sample input:
# sample_input = 
# {
#     "buyer_name": "Jason",
#     "buyer_id": "B123",
#     "buyer_type": "Medium-Sized Business",
#     "negotiation_style": "Balanced",
#     "price_sensitivity": "Medium",
#     "product_name": "Widget",
#     "product_id": "P456",
#     "min_unit_price": 10.0,
#     "max_unit_price": 20.0,
#     "min_delivery_time": 2.0,
#     "max_delivery_time": 5.0,
#     "min_lead_time": 1.0,
#     "max_lead_time": 3.0,
#     "min_order_quantity": 100,
#     "max_order_quantity": 500,
#     "expected_discount": 5.0,
#     "requirement_of_certification": true,
#     "sustainability_requirement": false,
#     "product_urgency_rate": 0.77,
#     "max_negotiation_attempts": 7
# }
