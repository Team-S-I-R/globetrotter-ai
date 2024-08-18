from flask import Flask, request, jsonify
import requests
import google.generativeai as genai
import google.logging as logging
import json
import os
from flask_cors import CORS
import dotenv
import datetime

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "https://globetrotter-app.vercel.app"])

dotenv.load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

AMADEUS_CLIENT_ID = os.getenv("AMADEUS_CLIENT_ID")
AMADEUS_CLIENT_SECRET = os.getenv("AMADEUS_CLIENT_SECRET")

NEW_GOOGLE_API_KEY = os.getenv("NEW_GOOGLE_API_KEY")
genai.configure(api_key=NEW_GOOGLE_API_KEY)
# model = genai.GenerativeModel('gemini-1.5-flash')
model = genai.GenerativeModel('gemini-1.0-pro')



chat = model.start_chat(
    history=[]
)

def format_date(date_str):
    try:
        prompt = f"Convert this date '{date_str}' to the format YYYY-MM-DD."
        formatted = generate_content(prompt)

        if formatted:
            return formatted.strip() 
        else:
            raise ValueError("gemini returned an empty response.")

    except Exception as e:
        print("error formatting date: {e}")
        return None



def get_airport_code(city):
    prompt = f"""
    You are a travel assistant. Provide the IATA airport code for the closest airport to {city} in one word. For example, if I put Los Angeles, you should simply provide 'LAX'.
    """
    response_text = generate_content(prompt)
    print(f"Generated content for airport code: {response_text}")  # Debug print
    if response_text:
        return response_text.strip()  # Clean up any extraneous whitespace
    else:
        print("Error: No response text received")
        return None

def generate_content(prompt):
    try:
        response = chat.send_message(prompt)
        response_text = response.text
        clean_response_text = response_text.replace("```json\n", "").replace("\n```", "")
        return clean_response_text
    except Exception as e:
        print(f"Error generating content: {e}")
        return None

@app.route('/plan_trip', methods=['POST'])
def plan_trip():
    data = request.get_json()
    city = data.get('city')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    budget = data.get('budget')
    max_distance = data.get('max_distance')
    user_comments = data.get('comments', '')  

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
    data = request.get_json()
    user_input = data.get('user_input', '')
    print()
    obj = {"responseText":"Your response here, fit with some travel destination recommendations or activities based on the user's input, also add some questions based on things that you don't have values of in the details area. If they did give you some information, please do not ask them about that as they just gave you the information. In fact, they would really appreciate it if you let them know you heard them, and what they heard. This is how humans show each other they are listening.",
           "details":[
               {"parameter":"departure", "value":"<value>"},
               {"parameter":"arrival", "value":"<value>"},
               {"parameter":"start_date", "value":"<value>"},
               {"parameter":"end_date", "value":"<value>"},
               {"parameter":"numAdults", "value":"<value>"},
               {"parameter":"numChildren", "value":"<value>"},
               {"parameter":"numInfants", "value":"<value>"},
               {"parameter":"baggage", "value":"<value>"},
               {"parameter":"isOneWay", "value":"<true/false>"},
               {"parameter":"budget", "value":"<value>"},
           ]}

    prompt = f"""
    Your name is Globetrotter Ai. If you introduce yourself to the user, use your name which is Globetrotter Ai. You are a travel booking assistant and are having a conversation with the user.YOUR GOAL IS TO SEARCH FOR FLIGHTS AND PROVIDE THEM TO THE USER.
    ONCE YOU HAVE ENOUGH INFORMATION YOU NEED TO START GIVING THE USER THE FLIGHT INFORMATION. IF YOU FOR SOME REASON ARE NOT ABLE TO, COMMUNICATE AND TRY AGAIN.
    EVERYTHING, THIS CONVERSATION IS SO THAT YOU CAN PROVIDE FLIGHTS BASED ON THE USER'S INFORMATION.  If they ask you a question, like recalling information they told you, it is your top priority to answer that question and get the answer correct. Listen.
    If you do not see anything in the user prompt, please let the user know that you didnt quite hear them. No exceptions. Do not hallucinate. Stop talking about paris and actually listen to the user. 
    You are just having a normal conversation and happen to be a travel planner. So be personable, make an effort to show the user you are paying attention. The users latest input is as following: "{user_input}".
    Use data from the conversation to output in the following JSON format. do not include formatting or code blocks.
    The user will be speaking to you in a conversation. Please infer the user's intent from the context and fill out the values in the json object based on the user's intent.
    If the user is talking about where they would like to travel to, please use the input to fill the 'arrival' parameter.
    If the user is asking about the dates, please use the input to fill the 'start_date' and 'end_date' parameters.
    If the user is asking about the number of people traveling, please use the input to fill the 'numAdults', 'numChildren', and 'numInfants' parameters.
    Also, as you are having the conversation, If you update a value in the json object, please remember these values. Add them to your memory and send them
    every time you send a response along with the new values you discover in the conversation.
    {json.dumps(obj)}
    """
    try:
        response = chat.send_message(prompt)
        response_text = response.text
        clean_response_text = response_text.replace("```json\n", "").replace("\n```", "")
        response_json = json.loads(clean_response_text)
        
        # Extract flight search details
        flight_search_details = response_json.get('details', [])
        search_params = {param['parameter']: param['value'] for param in flight_search_details}

        # Prepare parameters for flight search
        departure = search_params.get('departure')
        arrival = search_params.get('arrival')
        start_date = search_params.get('start_date')
        end_date = search_params.get('end_date')
        num_adults = search_params.get('numAdults')
        num_children = search_params.get('numChildren')
        num_infants = search_params.get('numInfants')
        is_one_way = search_params.get('isOneWay', 'true') == 'true'

        # Ensure that required parameters are present
        if departure and arrival and start_date and end_date:
            access_token = get_access_token()
            if not access_token:
                return jsonify({'error': 'Unable to fetch access token'}), 500

            # Convert parameters to integers if present
            num_adults = int(num_adults) if num_adults else 1
            num_children = int(num_children) if num_children else 0
            num_infants = int(num_infants) if num_infants else 0

            flight_data = search_flights(
                access_token,
                city_from=departure,
                city_to=arrival,
                departure_date=start_date,
                return_date=end_date,
                adults=num_adults,
                children=num_children,
                infants=num_infants,
                is_one_way=is_one_way
            )
            response_json['searched_flights'] = flight_data if flight_data else {}
        else:
            response_json['searched_flights'] = {}
        
        return jsonify(response_json)
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500


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

def search_flights(access_token, city_from, city_to, departure_date, return_date=None, adults=1, children=0, infants=0, is_one_way=True):
    try:
        origin = get_airport_code(city_from)
        destination = get_airport_code(city_to)

        print(f"Origin: {origin}, Destination: {destination}")  # Debug print

        if not origin or not destination:
            print("Error: Unable to retrieve airport codes")
            return None

        # Format the dates
        formatted_departure_date = format_date(departure_date)
        formatted_return_date = format_date(return_date) if return_date else None

        if not formatted_departure_date:
            print("Error: Unable to format departure date")
            return None

        params = {
            'originLocationCode': origin,
            'destinationLocationCode': destination,
            'departureDate': formatted_departure_date,
            'adults': adults,
            'children': children,
            'infants': infants,
            'max': 5 
        }
        if not is_one_way and formatted_return_date:
            params['returnDate'] = formatted_return_date

        print(f"Request Parameters: {params}")  # Debug print

        response = requests.get(
            'https://test.api.amadeus.com/v2/shopping/flight-offers',
            headers={'Authorization': f'Bearer {access_token}'},
            params=params
        )
        response.raise_for_status()

        print(f"Flight API Response: {response.json()}")  # Debug print

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