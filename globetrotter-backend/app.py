from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import google.generativeai as genai
import json
import os

app = Flask(__name__)
CORS(app)

GOOGLE_API_KEY = "AIzaSyAtw3ossKpb0a9aiDnB385Xal2OJpZX0ac"
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

AMADEUS_CLIENT_ID = "7MEvfgTSMXFdPgurtu2iscp7w2F6qBKA"
AMADEUS_CLIENT_SECRET = "NBVGe1CHAW1tLSxK"

@app.route('/travel', methods=['POST'])
def generate_travel_guide():
    data = request.json
    user_input = data.get('user_input', '')

    prompt = f"""
    You are a travel booking assistant. The user provided the following information: "{user_input}".
    Extract the data from the sentence, provide the output in the following JSON format:
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
        response_text = response.text
        print(response)
        clean_response_text = response_text.replace("```json\n", "").replace("\n```", "")
        return jsonify({'response': clean_response_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_access_token():
    try:
        response = requests.post(
            'https://test.api.amadeus.com/v1/security/oauth2/token',
            data={
                'grant_type': 'client_credentials',
                'client_id': AMADEUS_CLIENT_ID,
                'client_secret': AMADEUS_CLIENT_SECRET
            },
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        response.raise_for_status()
        return response.json()['access_token']
    except requests.exceptions.RequestException as e:
        print(f"Error fetching access token: {e}")
        return None

def search_flights(access_token, origin, destination, departure_date, return_date=None, adults=1, children=0, infants=0, is_one_way=True):
    try:
        params = {
            'originLocationCode': origin,
            'destinationLocationCode': destination,
            'departureDate': departure_date,
            'adults': adults,
            'children': children,
            'infants': infants,
            'max': 5 
        }
        if not is_one_way:
            params['returnDate'] = return_date

        response = requests.get(
            'https://test.api.amadeus.com/v2/shopping/flight-offers',
            headers={'Authorization': f'Bearer {access_token}'},
            params=params
        )
        response.raise_for_status()
        flight_data = response.json()

        parsed_flights = []
        for offer in flight_data.get('data', []):
            for itinerary in offer['itineraries']:
                for segment in itinerary['segments']:
                    flight_info = {
                        'flight_number': segment['number'],
                        'departure_time': segment['departure']['at'],
                        'arrival_time': segment['arrival']['at'],
                        'departure_airport': segment['departure']['iataCode'],
                        'arrival_airport': segment['arrival']['iataCode'],
                        'cabin': segment.get('cabin', 'N/A'),
                        'price': offer['price']['total'],
                        'currency': offer['price']['currency'],
                        'duration': itinerary['duration'],
                        'seat_type': segment['aircraft']['code'],
                        'airline': offer.get('validatingAirlineCodes', ['N/A'])[0],
                        'amenities': [
                            {
                                'type': amenity.get('amenityType', 'Unknown'),
                                'description': amenity.get('description', 'No description'),
                                'is_chargeable': amenity.get('isChargeable', False)
                            }
                            for amenity in segment.get('fareDetailsBySegment', [{}])[0].get('amenities', [])
                        ]
                    }
                    parsed_flights.append(flight_info)

        return {
            'total_results': flight_data.get('meta', {}).get('totalCount', 0),
            'flights': parsed_flights
        }

    except requests.exceptions.RequestException as e:
        print(f"Error searching flights: {e}")
        return None

@app.route('/search_flights', methods=['GET'])
def search_flights_route():

    origin = request.args.get('origin')
    destination = request.args.get('destination')
    departure_date = request.args.get('departure_date')
    return_date = request.args.get('return_date')
    adults = request.args.get('adults', default=1, type=int)
    children = request.args.get('children', default=0, type=int)
    infants = request.args.get('infants', default=0, type=int)
    is_one_way = request.args.get('is_one_way', default='true').lower() == 'true'

    access_token = get_access_token()
    if not access_token:
        return jsonify({'error': 'Unable to fetch access token'}), 500

    flight_data = search_flights(access_token, origin, destination, departure_date, return_date, adults, children, infants, is_one_way)
    if not flight_data:
        return jsonify({'error': 'Unable to fetch flight data'}), 500

    return jsonify(flight_data)

if __name__ == "__main__":
    app.run(debug=True)