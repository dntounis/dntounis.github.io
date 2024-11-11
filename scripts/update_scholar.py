import scholarly
import yaml
import json
from datetime import datetime

def fetch_scholar_data(scholar_id):
    try:
        # Initialize scholarly
        author = scholarly.search_author_id(scholar_id)
        author = scholarly.fill(author)
        
        # Basic author info
        scholar_data = {
            'name': author.name,
            'citations': author.citedby,
            'h_index': author.hindex,
            'i10_index': author.i10index,
            'interests': author.interests,
            'updated': datetime.now().strftime("%Y-%m-%d"),
            'publications': []
        }
        
        # Publication data
        for pub in author.publications:
            pub = scholarly.fill(pub)
            publication = {
                'title': pub.bib.get('title'),
                'year': pub.bib.get('year'),
                'citations': pub.citedby,
                'authors': pub.bib.get('author', '').split(' and '),
                'venue': pub.bib.get('journal', pub.bib.get('conference')),
                'url': pub.bib.get('url'),
                'scholar_url': pub.url_scholarbib
            }
            scholar_data['publications'].append(publication)
        
        # Sort publications by year
        scholar_data['publications'].sort(key=lambda x: int(x['year']), reverse=True)
        
        return scholar_data
        
    except Exception as e:
        print(f"Error fetching scholar data: {e}")
        return None

def save_to_files(data):
    # Save metrics to _data/scholar_metrics.yml
    metrics = {
        'citations': data['citations'],
        'h_index': data['h_index'],
        'i10_index': data['i10_index'],
        'updated': data['updated']
    }
    
    with open('_data/scholar_metrics.yml', 'w') as f:
        yaml.dump(metrics, f)
    
    # Save publications to _data/scholar_publications.yml
    with open('_data/scholar_publications.yml', 'w') as f:
        yaml.dump(data['publications'], f)
        
    # Save citation history for graphs
    years = range(int(min(p['year'] for p in data['publications'])), 
                 datetime.now().year + 1)
    citation_history = []
    
    for year in years:
        citations = sum(p['citations'] for p in data['publications'] 
                       if int(p['year']) == year)
        citation_history.append({'year': year, 'citations': citations})
    
    with open('_data/citation_history.json', 'w') as f:
        json.dump(citation_history, f)

if __name__ == "__main__":
    SCHOLAR_ID = "YOUR_SCHOLAR_ID"  # Replace with your Google Scholar ID
    data = fetch_scholar_data(SCHOLAR_ID)
    if data:
        save_to_files(data)
        print("Successfully updated Google Scholar data")
