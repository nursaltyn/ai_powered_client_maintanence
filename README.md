# ai_powered_client_maintanence

Building an amazing AI-agentic framework for streamlining procurement and supply management in heating systems.

```
ai_powered_client_maintenance/
├── agents/                 # Contains AI agents for buyers and sellers
│   ├── buyers/             # Buyer-related agents
│   ├── sellers/            # Seller-related agents
│   ├── llm.py              # Language model functions
│   ├── LLMManager.py       # LLM manager script
│   ├── test.ipynb          # Notebook for testing agents
│
├── data/                   # Dataset and JSON mappings
│   ├── client_requests.csv      # Client request logs
│   ├── df_deals_closed.csv      # Closed deals dataset
│   ├── id_to_product.json       # Mapping of IDs to products
│   ├── product_to_vendor.json   # Product to vendor mappings
│   ├── vendors.csv              # Vendor information
│
├── frontend/               # Frontend-related files (empty for now)
│
├── .env                    # Environment variables (ignored in Git)
├── .gitignore              # Git ignore file
├── fastapi_agent_server.py # FastAPI server script
├── generate_database.ipynb # Notebook for database generation
├── README.md               # Project documentation
├── requirements.txt        # Python dependencies
```

## 🚀 Getting Started

### 1. **Clone the Repository**

```sh
git clone https://github.com/nursaltyn/ai_powered_client_maintenance.git
cd ai_powered_client_maintenance
```

### 2. Set Up a Virtual Environment

```
python3 -m venv venv
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate      # On Windows
```

### 3. Install Dependencies

```
pip install -r requirements.txt
```
