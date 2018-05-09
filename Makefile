all: storj-whitepaper-v2.pdf

clean:
	rm -f *.aux *.bbl *.blg *.fdb_latexmk *.fls *.log *.out *.pdf
	
%.pdf: %.tex *.bib
	latexmk -pdf $<

.PHONY: all clean
