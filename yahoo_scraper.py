from bs4 import BeautifulSoup
import requests, lxml
import csv
import numpy as np



def get_img_source(search_query):

    headers = {
        'User-agent':
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582"
    }

    response = requests.get(
        url=f"https://images.search.yahoo.com/search/images?p={search_query}",
        headers=headers
    )

    html = response.text

    soup = BeautifulSoup(html, 'lxml')

    for result in soup.find_all('li', id='resitem-0'):
        link = result.find('a')
        img =  link.find('img')
        source = img['data-src']
        
        return(source)


def addImageSrc(startIndex, endIndex) :
    maxRows = 47869

    rows = np.loadtxt('cities.csv', delimiter=',', dtype=object)

    for index in range(startIndex, endIndex):

        print("index:", index)
        row = rows[index]

        if (index > maxRows): # per sicurezza
            break

        # Prepara query: nome citta e country
        queryStr = row[1] + " " + row[2]

        # Ottieni url immagine
        src = get_img_source(queryStr)

        # Aggiorna riga mettendo la src come campo image
        row[6] = src

    # Scrivi output
    np.savetxt('cities.csv', rows, delimiter=',', fmt="%s")


def main():
    addImageSrc(51, 100)


if __name__ == "__main__":
    main()