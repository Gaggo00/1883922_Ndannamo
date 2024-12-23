from bs4 import BeautifulSoup
import requests, lxml
import csv
import numpy as np
import time



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
    #print(html[:2000])

    soup = BeautifulSoup(html, 'lxml')

    for result in soup.find_all('li', id='resitem-0'):
        link = result.find('a')
        img =  link.find('img')
        source = img['data-src']
        
        return(source)


def addImageSrc(startIndex, endIndex):
    maxRows = 47869

    # per contare quanti none di fila ricevo
    noneCounter = 0
    res = True

    rows = np.loadtxt('cities.csv', delimiter=',', dtype=object)

    for index in range(startIndex-1, endIndex-1):

        if (index > maxRows): # per sicurezza
            break

        print("Idx:", index+1)
        row = rows[index]

        # Prepara query: nome citta e country
        queryStr = row[1] + " " + row[2]

        # Ottieni url immagine
        src = get_img_source(queryStr)

        if (src == None):
            noneCounter += 1
            if (noneCounter > 2):
                print("tre none di fila, stopping")
                res = False
                break
        else:
            noneCounter = 0

        # Aggiorna riga mettendo la src come campo image
        row[6] = src

    # Scrivi output
    print("Writing output...")
    np.savetxt('cities.csv', rows, delimiter=',', fmt="%s")
    print("Done")
    return res


def main():

    #'''
    start = 10300
    end = 20000

    step = 100
    
    # faccio i loop che servono per arrivare a end
    loops = (end - start) // step
    for i in range(0, loops):
        ok = addImageSrc(start, start+step)
        if (not ok):
            print("stop")
            break
        start = start+step
        if (i < loops - 1):
            time.sleep(60)          # pausetta cosi forse yahoo non mi denuncia e blocca a vita
    
    #'''

    #addImageSrc(10265, 10300)



if __name__ == "__main__":
    main()