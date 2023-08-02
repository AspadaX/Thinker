from anthropic import Anthropic, HUMAN_PROMPT, AI_PROMPT
from datetime import datetime
import pandas as pd
import os
from sklearn.metrics.pairwise import cosine_similarity
import spacy

def get_decision_maker():
    file = open(r"prompt_02", "r")
    prompt = file.read()

    return prompt
prompt = get_decision_maker()

def get_api():
    key = os.environ["ANTHROPIC_API_KEY"]
    anthropic = Anthropic(
        api_key=key
    )
    return anthropic
claude = get_api()

# load the historical data
def get_history():
    if os.path.exists('user_events.csv'):
        df = pd.read_csv('user_events.csv')
    else:
        df = pd.DataFrame(columns=['date', 'situation'])
    return df
df = get_history()

# Check if environment variable exists
def check_env_var(env_var):
    if env_var in os.environ:
        print('ANTHROPIC_API_KEY is set!')
    else:
        print('ANTHROPIC_API_KEY is not set!')
check_env_var('ANTHROPIC_API_KEY')

situation = input("Enter your situation: ")
now = datetime.now()
new_row = pd.DataFrame([[now, situation]], columns=['date', 'situation'])
df = pd.concat([df, new_row], ignore_index=True)

nlp = spacy.load('en_core_web_lg')
def get_context(user_input, data):
    df = pd.read_csv(data)

    # Add vector column
    df['Vector'] = df['situation'].apply(lambda x: nlp(x).vector)

    # Get user vector
    user_vector = nlp(user_input).vector

    # Compute similarities
    sims = df['Vector'].apply(lambda x: cosine_similarity([x], [user_vector]))
    df['Similarity'] = sims

    # Sort by similarity
    df = df.sort_values('Similarity', ascending=False)

    # Get top 3 situations
    top3 = df[['situation', 'date']].head(3)

    return top3.values.tolist()

if os.path.exists('user_events.csv'):
    embedding_results = get_context(situation, "user_events.csv")
else:
    embedding_results = []

def list_to_string(list):
  string = ""
  for item in list:
    string += str(item) + "\n"
  return string
context_lines = list_to_string(embedding_results)

# Save dataframe
df.to_csv('user_events.csv', index=False)

situation_prompt = "[situation]:" + situation + "\n"

context = "[context]:" + context_lines + "\n"
goal = "[goal]:" + input("Define your goal:") + "\n"
info_lookup = "[info_lookup]:" + "Current date is " + str(now) + "\n"
# advices_lookup = "[advices_lookup]:" + advices + "\n"
end_prompt = f"{HUMAN_PROMPT}" + prompt + goal + situation_prompt + info_lookup + context + f"{AI_PROMPT}"

def chat_completion(a,model_input):
    completion = claude.completions.create(
        model=model_input,
        max_tokens_to_sample=100000,
        temperature=0,
        prompt=a,
    )
    return completion
print("AI is thinking...")
response = chat_completion(end_prompt, "claude-2")

def response_determinator(response):
    if response is None:
        response = chat_completion(end_prompt, "claude-2")
        return response
    else:
        return response
response_determinator(response)

print(response.completion)

def cache_response(response_tag):
    filename = 'cache_response.txt'

    if os.path.exists(filename):
        # File exists, overwrite it
        with open(filename, 'w') as f:
            f.write(response_tag)

    else:
        # File does not exist, create it
        with open(filename, 'w') as f:
            f.write(response_tag)
cache_response(str(response.completion))