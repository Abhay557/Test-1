import sys
import json
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from collections import Counter

def extract_features(text):
    words = text.split()
    word_count = len(words)
    unique_word_count = len(set(words))
    most_common_word = Counter(words).most_common(1)[0][1] if words else 0
    return [word_count, unique_word_count, most_common_word]

def process_resumes(file_path):
    with open(file_path, 'r') as f:
        resumes = json.load(f)

    feature_matrix = [extract_features(resume['content']) for resume in resumes]
    
    scaler = MinMaxScaler()
    scaled_features = scaler.fit_transform(feature_matrix)

    results = [
        {'filename': resume['filename'], 'scaled_features': scaled.tolist()}
        for resume, scaled in zip(resumes, scaled_features)
    ]

    print(json.dumps(results))

if __name__ == "__main__":
    process_resumes(sys.argv[1])
