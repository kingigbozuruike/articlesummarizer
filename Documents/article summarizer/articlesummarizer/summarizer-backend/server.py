# Please install these libraries using pip install


import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from transformers import BartTokenizer, BartForConditionalGeneration

app = Flask(__name__)
CORS(app)

# Initialize Limiter
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["1000 per minute"]
)

# Configure Cache
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

# Load the BART model and tokenizer
tokenizer = BartTokenizer.from_pretrained('facebook/bart-large-cnn')
model = BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn')

@app.route('/summarize', methods=['POST'])
@limiter.limit("100 per minute")
def summarize():
    try:
        data = request.get_json()
        text = data['text']
        
        # Check cache first
        cache_key = f"summarize_{hash(text)}"
        cached_summary = cache.get(cache_key)
        if cached_summary:
            return jsonify({"summary": cached_summary})
        
        # Generate the summary using the BART model
        inputs = tokenizer.encode("summarize: " + text, return_tensors="pt", max_length=1024, truncation=True)
        summary_ids = model.generate(inputs, min_length=50, length_penalty=2.0, num_beams=4, early_stopping=True)
        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        
        # Store result in cache
        cache.set(cache_key, summary, timeout=300)  # Cache for 5 minutes
        
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)


