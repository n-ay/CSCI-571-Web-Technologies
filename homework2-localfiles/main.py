from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import finnhub
# from polygon import RESTClient
from datetime import datetime, timedelta
import time
from dateutil.relativedelta import relativedelta


app = Flask(__name__,static_folder='static')
CORS(app)

@app.route("/")
def index():
    return app.send_static_file("stockindex.html")


# polygon_client = RESTClient(api_key="vFtIp94GNrAetLdLpwbFgz6sI1E3nBFX")
polygon_api_key ="vFtIp94GNrAetLdLpwbFgz6sI1E3nBFX"
finnhub_client = finnhub.Client(api_key="cmuu1i9r01qru65i16ggcmuu1i9r01qru65i16h0")
finnhub_api_key="cmuu1i9r01qru65i16ggcmuu1i9r01qru65i16h0"


@app.route("/summary", methods=['GET'])
def summary_stock():
 
    symbol = request.args.get('symbol')
    company_tab_url = "https://finnhub.io/api/v1/stock/profile2?symbol=" + str(symbol) + "&token=" + str(finnhub_api_key)

    response = requests.get(company_tab_url)
    if request.method=='GET':
        print("GET")
    else:
        print("POST")
 
    if response.status_code == 200:
        if response:
            return jsonify(response.json())
        else:
            return jsonify({'error': 'Empty or undefined response from the API'}), 404
    else:
        return jsonify({'error': 'Failed to fetch stock information'}), response.status_code

#HANDLE RESPONSE ERROR 2XX 4XX

@app.route("/stock", methods=['GET'])
def stock():
 
    symbol = request.args.get('symbol')
    stock_summary_tab__url = "https://finnhub.io/api/v1/quote?symbol=" + str(symbol) + "&token=" + str(finnhub_api_key)

    response = requests.get(stock_summary_tab__url)

    if request.method=='GET':
        print("GET")
    else:
        print("POST")
 
    if response.status_code == 200:
        if response:
            return jsonify(response.json())
        else:
            return jsonify({'error': 'Empty or undefined response from the API'}), 404
    else:
        return jsonify({'error': 'Failed to fetch stock information'}), response.status_code



@app.route("/chart", methods=['GET'])
def chart_stock():
 
    symbol = request.args.get('symbol')
    symbol1 = symbol.upper()
    start_date = (datetime.now() - relativedelta(months=6, days=1)).date()
    end_date = datetime.now().date()
    stock_chart_tab_url="https://api.polygon.io/v2/aggs/ticker/"+str(symbol1) + "/range/1/day/" + str(start_date) + "/"+ str(end_date) + "?adjusted=true&sort=asc&apiKey=vFtIp94GNrAetLdLpwbFgz6sI1E3nBFX"
    response = requests.get(stock_chart_tab_url)
    # print(response)
    if request.method=='GET':
        print("GET")
    else:
        print("POST")
 
    if response.status_code == 200 :
        if response:
            data = response.json()
            # print(data)
            results = data.get('results', [])
            timestamps = [point['t'] for point in results]
            close_prices = [point['c'] for point in results]
            volumes = [point['v'] for point in results]
            # print(timestamps, close_prices, volumes)
            # print(len(results))
            # print(len(volumes))
            # print(data['resultsCount'])
            return jsonify({'timestamps': timestamps, 'close_prices': close_prices, 'volumes': volumes})
        else:
            return jsonify({'error': 'Empty or undefined response from the API'}), 404
    else:
        return jsonify({'error': 'Failed to fetch stock information'}), response.status_code



@app.route("/news", methods=['GET'])
def news_stock():
    symbol = request.args.get('symbol')
    news_start_date = (datetime.now() - relativedelta(days=30)).date().strftime('%Y-%m-%d')
    news_end_date = datetime.now().date().strftime("%Y-%m-%d")

    # print(news_start_date)
    # print(news_end_date)
    #news_url = "https://finnhub.io/api/v1/stock/company-news?symbol=" + str(symbol) + "&from=" + str(news_start_date) + "&to=" + str(news_end_date) + "&token=" + str(finnhub_api_key)
    
    finnhub_client = finnhub.Client(api_key=finnhub_api_key)
    response = finnhub_client.company_news(symbol, _from=news_start_date, to=news_end_date)
    news_data=response
    # print(response)

    filtered_news = [item for item in news_data if 'image' in item and item['image'] and 'headline' in item and 'datetime' in item]
    sorted_news = sorted(filtered_news, key=lambda x: x.get('datetime', 0), reverse=True)
    top_5_news = sorted_news[:5]
    top_5_news_trimmed = [{'headline': item['headline'], 'image': item['image'], 'datetime': item.get('datetime', ''), 'url': item['url']} for item in top_5_news]

    if top_5_news_trimmed:
        return top_5_news_trimmed
    else:
        return jsonify({'error': 'Empty or undefined response from the API'}), 404
    


@app.route("/recommendation", methods=['GET'])
def recommend_stock():
    symbol = request.args.get('symbol')
    recommend_url = "https://finnhub.io/api/v1/stock/recommendation?symbol=" + str(symbol) + "&token=" + str(finnhub_api_key)

    response = requests.get(recommend_url)
    if response.status_code == 200:
        data = response.json()
        if data:
            return jsonify(data)
        else:
            return jsonify({'error': 'Empty or undefined response from the API'}), 404
    else:
        return jsonify({'error': 'Failed to fetch stock information'}), response.status_code


if __name__ == '__main__':
    app.run(host='127.0.0.1',port='8080', debug=True)





