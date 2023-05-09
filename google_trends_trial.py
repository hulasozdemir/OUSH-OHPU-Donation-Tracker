import pandas as pd
from pytrends.request import TrendReq
import matplotlib.pyplot as plt

def download_trends_data(keywords, timeframe='2022-03-27 2023-04-30', 
geo=''):
    pytrends = TrendReq(hl='en-US', tz=360, timeout=(10,25))
    pytrends.build_payload(keywords, cat=0, timeframe=timeframe, geo=geo, gprop='')
    df = pytrends.interest_over_time()
    return df

def plot_trends_data(df, keywords):
    plt.figure(figsize=(15, 8))
    for keyword in keywords:
        plt.plot(df.index, df[keyword], label=keyword)
    plt.legend()
    plt.xlabel('Date')
    plt.ylabel('Trend Index')
    plt.title('Google Trends Data')
    plt.savefig('trends_dashboard.png')
    plt.show()

if __name__ == '__main__':
	keywords = ["CUAET"]  # Replace with your desired keywords
	df = download_trends_data(keywords)
	plot_trends_data(df, keywords)
