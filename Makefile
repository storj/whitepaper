all: storj-whitepaper-v3.pdf

clean:
	rm -f *.aux *.bbl *.blg *.fdb_latexmk *.fls *.log *.out *.pdf
	
%.pdf: %.tex *.bib durability/durability.pdf
	latexmk -pdf $<

.PHONY: all clean
