from flask import Flask, request, jsonify
import google.generativeai as genai
import os

app = Flask(__name__)

GOOGLE_API_KEY = "AIzaSyAtw3ossKpb0a9aiDnB385Xal2OJpZX0ac"
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/travel', methods=['POST'])
def generate_travel_guide():
    data = request.json
    user_input = data.get('user_input', '')

    prompt = f"""
    You are a travel booking assistant. The user provided the following information: "{user_input}".
    Please extract and format the details like this JSON example:

    {{
        "responseText": "<Your response here, fit with some travel destination recommendations or activities based on the user's input, also add some questions based on things that you don't have values of in the details area>",
        "details": [
            {{"parameter": "departure", "value": "<value>"}},
            {{"parameter": "arrival", "value": "<value>"}},
            {{"parameter": "start_date", "value": "<value>"}},
            {{"parameter": "end_date", "value": "<value>"}},
            {{"parameter": "numAdults", "value": "<value>"}},
            {{"parameter": "numChildren", "value": "<value>"}},
            {{"parameter": "numInfants", "value": "<value>"}},
            {{"parameter": "baggage", "value": "<value>"}},
            {{"parameter": "isOneWay", "value": <true/false>}},
            {{"parameter": "classPreference", "value": "<value>"}},
            {{"parameter": "directOnly", "value": <true/false>}}
        ],
    }}
    """
    try:
        response = model.generate_content(prompt)
        return jsonify({'response': response.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)