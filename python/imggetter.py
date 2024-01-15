import requests
from bs4 import BeautifulSoup
import re
import time

def downloadFile(url, newName, altName):
    response = requests.get(url)
    filePostfix = url.split(".")[-1]
    newName = re.sub(" created by HattoriGraphics", "", newName)
    newName = re.sub(r"[^\w\-_\.]","_",newName)
    
    if newName.strip() == "":
        newName = f"Hattori{altName}"
        
    filename = f"../downloads/{newName}.{filePostfix}"
    
    with open(filename, mode="wb") as file:
        file.write(response.content)
    
    print(f"Downloaded: {filename}")

url = 'https://gifmagazine.net'

page = open('webpage.html', 'r')
pagecontent = page.read()

# Parse page with BeautifulSoup API
soup = BeautifulSoup(pagecontent, 'html.parser')

# Extract all <a> tags using css class 'filter-entry'
links = soup.find_all('a', class_= re.compile('^gm-gif-preview*'))

linkNameList = []

for link in links:
    if link.has_attr('href'):
        linkNameList.append(url + link.get('href'))
        
linkCounter = 0
for link in linkNameList:
    linkPage = requests.get(link)
    eventSoup = BeautifulSoup(linkPage.text, 'html.parser')
    parentTag = eventSoup.find('section', class_= re.compile('^detail-pc-image*'))
    # print(parentTag)
    title = parentTag['data-stitle']
    p_elem = eventSoup.find('video')
    if p_elem == None:
        p_elem = eventSoup.findAll('img', {"title" : True})
        if len(p_elem) > 0:
            p_elem = p_elem[0]
    
    if p_elem != None:
        downloadFile(p_elem['src'], title, linkCounter)
        time.sleep(0.01)
        linkCounter = linkCounter + 1