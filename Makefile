all: storj-whitepaper-v2.pdf

clean:
	rm -f *.aux *.bbl *.blg *.fdb_latexmk *.fls *.log *.out *.pdf
	
%.pdf: %.tex
	latexmk -pdf $<

.PHONY: all clean
