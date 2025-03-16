from langchain_core.prompts import ChatPromptTemplate
# from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAI
from langchain_mistralai import ChatMistralAI
# class LLMManager:
#     def __init__(self, api_key, llm_model_name):
#         model_name = llm_model_name
#         temperature = 0.0
#         verbose = True

#         # Create an OpenAI object.
#         self.llm = ChatGoogleGenerativeAI(model=model_name, 
#                                 google_api_key=api_key, 
#                                 temperature=temperature, 
#                                 verbose=verbose)

#     def invoke(self, prompt: ChatPromptTemplate, **kwargs) -> str:
#         messages = prompt.format_messages(**kwargs)
#         response = self.llm.invoke(messages)
#         return response.content
    
class LLMManager:
    def __init__(self, api_key, llm_model_name, llm_model):
        model_name = llm_model_name
        temperature = 0.0
        verbose = True

        if llm_model == "GOOGLE":
            # Create an Google Gmeini object.
            self.llm = ChatGoogleGenerativeAI(model=model_name, 
                                    google_api_key=api_key, 
                                    temperature=temperature, 
                                    verbose=verbose)
        elif llm_model == "MISTRAL":
            # Create a Mistral object.
            self.llm = ChatMistralAI(model=model_name, 
                                    mistral_api_key=api_key, 
                                    temperature=temperature, 
                                    verbose=verbose)

    def invoke(self, prompt: ChatPromptTemplate, **kwargs) -> str:
        messages = prompt.format_messages(**kwargs)
        response = self.llm.invoke(messages)
        return response.content