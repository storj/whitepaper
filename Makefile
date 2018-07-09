all: storj-whitepaper-v3.pdf storj-whitepaper-v3.html storj-whitepaper-v3.epub storj-whitepaper-v3.mobi

clean:
	rm -f *.4ct *.4tc *.aux *.bbl *.blg *.css *.epub *.fdb_latexmk *.fls *.html *.idv *.lg *.log *.mobi *.out *.pdf *.tmp *.xref storj-whitepaper-v3*x.png

%.pdf: %.tex *.bib durability/durability.eps
	latexmk -pdf $<

%.html: %.pdf
	bibtex storj-whitepaper-v3.aux
	htlatex storj-whitepaper-v3.tex

%.epub: %.html
	ebook-convert storj-whitepaper-v3.html storj-whitepaper-v3.epub --level1-toc //h:h3 --level2-toc //h:h4 --level3-toc //h:h5 --authors "Storj Team"

%.mobi: %.html
	ebook-convert storj-whitepaper-v3.html storj-whitepaper-v3.mobi --level1-toc //h:h3 --level2-toc //h:h4 --level3-toc //h:h5 --authors "Storj Team"

.PHONY: all clean
