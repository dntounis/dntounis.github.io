require 'bibtex'
require 'citeproc'
require 'csl/styles'

module Jekyll
  class Scholar < Generator
    def generate(site)
      bibliography = BibTeX.open('_data/publications.bib')
      style = CSL::Style.load('apa')
      cp = CiteProc::Processor.new(style: style, format: 'html')

      site.data['publications'] = bibliography.map do |entry|
        cp.import([entry.to_citeproc])
        {
          'citation' => cp.render(:bibliography, id: entry.key).first,
          'year' => entry.year,
          'title' => entry.title,
          'doi' => entry.doi,
          'url' => entry.url,
          'key' => entry.key
        }
      end
    end
  end
end
