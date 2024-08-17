from flask import Flask, request, jsonify
import requests
import google.generativeai as genai
import json
import os

app = Flask(__name__)

GOOGLE_API_KEY = "AIzaSyAtw3ossKpb0a9aiDnB385Xal2OJpZX0ac"
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

AMADEUS_CLIENT_ID = "7MEvfgTSMXFdPgurtu2iscp7w2F6qBKA"
AMADEUS_CLIENT_SECRET = "NBVGe1CHAW1tLSxK"

NEW_GOOGLE_API_KEY = "AIzaSyCmIRr2omcRRr_dbASqK4KjDNdatz4zGK8"
genai.configure(api_key=NEW_GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def generate_content(prompt):
    try:
        response = model.generate_content(prompt)
        response_text = response.text
        clean_response_text = response_text.replace("```json\n", "").replace("\n```", "")
        return clean_response_text
    except Exception as e:
        print(f"Error generating content: {e}")
        return None

@app.route('/plan_trip', methods=['POST'])
def plan_trip():
    data = request.json
    city = data.get('city')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    budget = data.get('budget')
    max_distance = data.get('max_distance')
    user_comments = data.get('comments', '')  # Optional user comments

    prompt = f"""
    You are a travel assistant. Generate a comprehensive travel plan for a trip to {city} from {start_date} to {end_date}.
    The trip has a budget of {budget}, and the user wants to explore within {max_distance} km from {city}.
    Include the following:

    1. **Detailed Itinerary**: Provide a detailed daily itinerary with suggested activities and destinations.
    2. **Packing List**: Suggest a packing list for the trip, taking into account the weather and local activities.
    3. **Cultural Information**: Include key cultural practices, local cuisine, and must-see attractions in {city}.

    Additional comments from the user: "{user_comments}"

    Format the response as JSON with fields for 'itinerary', 'packing_list', and 'cultural_info', such as in the following:
        {{
    "itinerary": {{
        "Day 1": "Arrive in New York City. Check into your hotel. Explore Times Square and have dinner at a local restaurant.",
        "Day 2": "Visit the Statue of Liberty and Ellis Island. Spend the afternoon in Central Park. Evening Broadway show.",
        "Day 3": "Tour the Metropolitan Museum of Art. Explore the Upper East Side. Dinner at a Michelin-starred restaurant.",
        "Day 4": "Visit the Empire State Building and take in the city views. Shopping in Soho. Departure."
    }},
    "packing_list": [
        "Comfortable walking shoes",
        "Weather-appropriate clothing (e.g., light jacket, umbrella)",
        "Travel-sized toiletries",
        "Travel documents (ID, tickets)",
        "Chargers for electronics",
        "Reusable water bottle"
    ],
    "cultural_info": {{
        "Cultural Practices": "New Yorkers value their time and are known for their directness. Tipping is customary in restaurants.",
        "Local Cuisine": "Try iconic foods such as New York-style pizza, bagels, and hot dogs.",
        "Must-See Attractions": [
        "Statue of Liberty",
        "Central Park",
        "Empire State Building",
        "Broadway",
        "Metropolitan Museum of Art"
        ]
    }},
    "additional_comments": "Remember to check for any local events or festivals happening during your visit. Enjoy your trip!"
    }}
    """
    response_text = generate_content(prompt)
    
    if response_text:
        try:
            response_json = json.loads(response_text)
        except json.JSONDecodeError as e:
            print(f"Error parsing response JSON: {e}")
            response_json = {'error': 'Error parsing response from Gemini'}
    else:
        response_json = {'error': 'Error generating content from Gemini'}

    return jsonify(response_json)

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
        response_text = response.text
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
