!pip install transformers torch textstat tqdm


import joblib
import torch
import textstat
import numpy as np
import pandas as pd
import re
import string

from transformers import GPT2TokenizerFast, GPT2LMHeadModel

# LOAD TRAINED MODEL
model = joblib.load("ai_detector.pkl")

feature_names = joblib.load("features.pkl")

print("Model Loaded Successfully")



# LOAD GPT2
device = "cuda" if torch.cuda.is_available() else "cpu"

tokenizer = GPT2TokenizerFast.from_pretrained("gpt2")

gpt2 = GPT2LMHeadModel.from_pretrained("gpt2")

gpt2.to(device)

gpt2.eval()

# ==========================================================
# CLEAN TEXT
# ==========================================================

def clean_text(text):

    text = text.lower()

    text = re.sub(r"\s+", " ", text)

    return text.strip()


# ==========================================================
# PERPLEXITY
# ==========================================================

def calculate_perplexity(text):

    encodings = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=512
    )

    input_ids = encodings.input_ids.to(device)

    attention_mask = encodings.attention_mask.to(device)

    with torch.no_grad():

        outputs = gpt2(
            input_ids,
            attention_mask=attention_mask,
            labels=input_ids
        )

    return torch.exp(outputs.loss).item()


# ==========================================================
# BURSTINESS
# ==========================================================

def calculate_burstiness(text):

    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]

    if len(sentences) <= 1:
        return 0

    lengths = [len(sentence.split()) for sentence in sentences]

    return np.std(lengths)


# ==========================================================
# OTHER FEATURES
# ==========================================================

def avg_sentence_length(text):

    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]

    if len(sentences) == 0:
        return 0

    lengths = [len(sentence.split()) for sentence in sentences]

    return np.mean(lengths)


def avg_word_length(text):

    words = text.split()

    if len(words)==0:
        return 0

    return np.mean([len(w) for w in words])


def vocabulary_richness(text):

    words = text.split()

    if len(words)==0:
        return 0

    return len(set(words))/len(words)


def word_count(text):

    return len(text.split())


def character_count(text):

    return len(text)


def sentence_count(text):

    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]

    return len(sentences)


def punctuation_count(text):

    return sum(1 for c in text if c in string.punctuation)


def readability(text):

    return textstat.flesch_reading_ease(text)

# ==========================================================
# AI DETECTION FUNCTION
# ==========================================================

def detect_ai(text):

    cleaned = clean_text(text)

    perplexity = calculate_perplexity(cleaned)

    burstiness = calculate_burstiness(cleaned)

    avg_sent = avg_sentence_length(cleaned)

    avg_word = avg_word_length(cleaned)

    vocab = vocabulary_richness(cleaned)

    words = word_count(cleaned)

    chars = character_count(cleaned)

    sentences = sentence_count(cleaned)

    punct = punctuation_count(cleaned)

    read = readability(cleaned)

    features = pd.DataFrame([[

        perplexity,

        burstiness,

        avg_sent,

        avg_word,

        vocab,

        words,

        chars,

        sentences,

        punct,

        read

    ]], columns=feature_names)

    prediction = model.predict(features)[0]

    probability = model.predict_proba(features)[0]

    ai_probability = probability[1]*100

    human_probability = probability[0]*100

    if ai_probability >= 90:
        confidence = "Very High"

    elif ai_probability >= 75:
        confidence = "High"

    elif ai_probability >= 60:
        confidence = "Medium"

    else:
        confidence = "Low"

    print("="*60)

    print("AI TEXT DETECTION REPORT")

    print("="*60)

    print(f"Prediction            : {'AI Generated' if prediction==1 else 'Human Written'}")

    print(f"AI Probability        : {ai_probability:.2f}%")

    print(f"Human Probability     : {human_probability:.2f}%")

    print()

    print(f"Perplexity            : {perplexity:.2f}")

    print(f"Burstiness            : {burstiness:.2f}")

    print(f"Word Count            : {words}")

    print(f"Character Count       : {chars}")

    print(f"Sentence Count        : {sentences}")

    print(f"Average Sentence Len  : {avg_sent:.2f}")

    print(f"Average Word Length   : {avg_word:.2f}")

    print(f"Vocabulary Richness   : {vocab:.2f}")

    print(f"Readability           : {read:.2f}")

    print()

    print(f"Confidence            : {confidence}")

    print("="*60)

sample_text = """
Artificial intelligence has become one of the most transformative
technologies of the modern era. It is being used in healthcare,
education, finance, and transportation to improve efficiency and
support decision-making. As AI continues to evolve, ethical
considerations and responsible development remain essential.
"""

detect_ai(sample_text)

while True:

    print("\n")

    text = input("Paste your paragraph (or type exit):\n\n")

    if text.lower() == "exit":
        break

    detect_ai(text)
from google.colab import files
files.download("ai_detector.py")
