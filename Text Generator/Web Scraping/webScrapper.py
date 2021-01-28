# pip install beautifulsoup4

import requests
from requests import get
from bs4 import BeautifulSoup
import pandas as pd
import numpy as np

from time import sleep
from random import randint
import os 
dir_path = os.path.dirname(os.path.realpath(__file__))

headers = {"Accept-Language": "es-ES,es;q=0.9"}


url = "https://dungeon20.com/games/dnd-5/creatures?category=&cr_from=&cr_to=&order=challenge&q=&type=&page="
firstPage = 1
lastPage = 13
outPutResult = ""

for i in range(firstPage,lastPage+1):
    results = requests.get(url+str(i), headers=headers)

    soup = BeautifulSoup(results.text, "html.parser")

    # print(soup.prettify())
    # print(results.text)
    # container.h3.a.text

    names = soup.find_all('div', class_='font-weight-bold')
    # level = soup.find_all('div', class_='col-xs-1 pr-0')



    for name in names:
        if "Alineamiento" not in str(name.text):
            line = "\"" + str(name.text) + "\"," 
            outPutResult += (line.rstrip("\n") + "\n")


with open(dir_path + "\\" + 'results.txt', 'w') as outfile:
    outfile.write(outPutResult)


# titles = []
# years = []
# time = []
# imdb_ratings = []
# metascores = []
# votes = []
# us_gross = []

# pages = np.arange(1, 1001, 50)

# for page in pages: 

#   page = requests.get("https://www.imdb.com/search/title/?groups=top_1000&start=" + str(page) + "&ref_=adv_nxt", headers=headers)

#   soup = BeautifulSoup(page.text, 'html.parser')
#   movie_div = soup.find_all('div', class_='lister-item mode-advanced')
  
#   sleep(randint(2,10))

#   for container in movie_div:

#         name = container.h3.a.text
#         titles.append(name)
        
#         year = container.h3.find('span', class_='lister-item-year').text
#         years.append(year)

#         runtime = container.p.find('span', class_='runtime') if container.p.find('span', class_='runtime') else ''
#         time.append(runtime)

#         imdb = float(container.strong.text)
#         imdb_ratings.append(imdb)

#         m_score = container.find('span', class_='metascore').text if container.find('span', class_='metascore') else ''
#         metascores.append(m_score)

#         nv = container.find_all('span', attrs={'name': 'nv'})
        
#         vote = nv[0].text
#         votes.append(vote)
        
#         grosses = nv[1].text if len(nv) > 1 else ''
#         us_gross.append(grosses)

# movies = pd.DataFrame({
# 'movie': titles,
# 'year': years,
# 'imdb': imdb_ratings,
# 'metascore': metascores,
# 'votes': votes,
# 'us_grossMillions': us_gross,
# 'timeMin': time
# })

# movies['votes'] = movies['votes'].str.replace(',', '').astype(int)

# movies.loc[:, 'year'] = movies['year'].str[-5:-1].astype(int)

# movies['timeMin'] = movies['timeMin'].astype(str)
# movies['timeMin'] = movies['timeMin'].str.extract('(\d+)').astype(int)

# movies['metascore'] = movies['metascore'].str.extract('(\d+)')
# movies['metascore'] = pd.to_numeric(movies['metascore'], errors='coerce')

# movies['us_grossMillions'] = movies['us_grossMillions'].map(lambda x: x.lstrip('$').rstrip('M'))
# movies['us_grossMillions'] = pd.to_numeric(movies['us_grossMillions'], errors='coerce')


# # to see your dataframe
# print(movies)

# # to see the datatypes of your columns
# print(movies.dtypes)

# # to see where you're missing data and how much data is missing 
# print(movies.isnull().sum())

# # to move all your scraped data to a CSV file
# movies.to_csv('movies.csv')