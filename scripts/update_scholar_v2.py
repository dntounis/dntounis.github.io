import scholarly
import yaml
from datetime import datetime

def update_metrics():
    try:
        # Get author directly using your specific Scholar ID
        author = scholarly.scholarly.search_author_id("5vCzegYAAAAJ")
        
        if not author:
            raise ValueError("Could not retrieve author data")
            
        # Fill in all available author data
        author = scholarly.scholarly.fill(author)
        
        # More defensive data extraction
        metrics = {
            'citations': author.get('citedby', 0),
            'h_index': author.get('hindex', 0),
            'i10_index': author.get('i10index', 0),
            'last_updated': datetime.now().strftime("%Y-%m-%d")
        }
        
        # Print metrics for debugging
        print("Retrieved metrics:", metrics)
        
        with open('_data/scholar_metrics.yml', 'w') as f:
            yaml.dump(metrics, f)
            
    except Exception as e:
        print(f"Error updating metrics: {e}")
        print("Full author data structure:")
        try:
            print(author)
        except:
            print("Could not print author data")

if __name__ == "__main__":
    update_metrics()
