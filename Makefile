all: storjv3.pdf

clean:
	rm -f *.4ct *.4tc *.aux *.bbl *.blg *.css *.dvi *.epub *.fdb_latexmk *.fls *.html *.idv *.lg *.log *.mobi *.out *.pdf *.tmp *.xref storj-whitepaper-v3*x.png *.ptc *.toc images/*.pdf

%.pdf: *.tex *.bib */*.tex
	latexmk -pdf $<

.PHONY: all clean
