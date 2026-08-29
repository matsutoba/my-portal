package ndl

import (
	"encoding/xml"
	"regexp"
	"strconv"
	"strings"
	"time"
)

// Go の struct tag はリテラル文字列でなければならないため、以下の struct tag
// は DC-NDL（RDF）v3 の名前空間URI
// (https://ndlsearch.ndl.go.jp/renkei/dcndl/version3) を直接参照している:
//   dc:      http://purl.org/dc/elements/1.1/
//   dcterms: http://purl.org/dc/terms/
//   dcndl:   http://ndl.go.jp/dcndl/terms/
//   rdf:     http://www.w3.org/1999/02/22-rdf-syntax-ns#
//   foaf:    http://xmlns.com/foaf/0.1/

type rdfIdentifier struct {
	Datatype string `xml:"http://www.w3.org/1999/02/22-rdf-syntax-ns# datatype,attr"`
	Value    string `xml:",chardata"`
}

type rdfValueDescription struct {
	Value string `xml:"http://www.w3.org/1999/02/22-rdf-syntax-ns# value"`
}

type dcTitle struct {
	Description *rdfValueDescription `xml:"http://www.w3.org/1999/02/22-rdf-syntax-ns# Description"`
}

type foafAgent struct {
	Name string `xml:"http://xmlns.com/foaf/0.1/ name"`
	Role string `xml:"http://ndl.go.jp/dcndl/terms/ role"`
}

type dctermsCreator struct {
	Agent *foafAgent `xml:"http://xmlns.com/foaf/0.1/ Agent"`
}

type dctermsPublisher struct {
	Agent *foafAgent `xml:"http://xmlns.com/foaf/0.1/ Agent"`
}

type rdfDescriptionWrapper struct {
	Description *rdfValueDescription `xml:"http://www.w3.org/1999/02/22-rdf-syntax-ns# Description"`
}

type bibResource struct {
	Identifiers  []rdfIdentifier        `xml:"http://purl.org/dc/terms/ identifier"`
	DCTitle      *dcTitle               `xml:"http://purl.org/dc/elements/1.1/ title"`
	DCTermsTitle string                 `xml:"http://purl.org/dc/terms/ title"`
	Creators     []dctermsCreator       `xml:"http://purl.org/dc/terms/ creator"`
	DCCreators   []string               `xml:"http://purl.org/dc/elements/1.1/ creator"`
	Publisher    *dctermsPublisher      `xml:"http://purl.org/dc/terms/ publisher"`
	Date         string                 `xml:"http://purl.org/dc/terms/ date"`
	Issued       string                 `xml:"http://purl.org/dc/terms/ issued"`
	SeriesTitle  *rdfDescriptionWrapper `xml:"http://ndl.go.jp/dcndl/terms/ seriesTitle"`
	Volume       *rdfDescriptionWrapper `xml:"http://ndl.go.jp/dcndl/terms/ volume"`
	Price        string                 `xml:"http://ndl.go.jp/dcndl/terms/ price"`
}

type foafThumbnail struct {
	Resource string `xml:"http://www.w3.org/1999/02/22-rdf-syntax-ns# resource,attr"`
}

type dcndlItem struct {
	Thumbnail *foafThumbnail `xml:"http://xmlns.com/foaf/0.1/ thumbnail"`
}

type rdfRoot struct {
	XMLName     xml.Name     `xml:"http://www.w3.org/1999/02/22-rdf-syntax-ns# RDF"`
	BibResource *bibResource `xml:"http://ndl.go.jp/dcndl/terms/ BibResource"`
	Items       []dcndlItem  `xml:"http://ndl.go.jp/dcndl/terms/ Item"`
}

// ParsedCreator は書籍の著者/編者/訳者の1エントリ。
type ParsedCreator struct {
	Name string  `json:"name"`
	Role *string `json:"role"`
}

// ParsedRecord は1件のDC-NDL searchRetrieve recordDataペイロードから抽出
// した、正規化済みの書籍レコード。
type ParsedRecord struct {
	NDLBibID      string          `json:"ndlBibId"`
	ISBN13        *string         `json:"isbn13"`
	Title         string          `json:"title"`
	Subtitle      *string         `json:"subtitle"`
	Creators      []ParsedCreator `json:"creators"`
	PublisherName *string         `json:"publisherName"`
	PublishedDate *time.Time      `json:"publishedDate"`
	SeriesName    *string         `json:"seriesName"`
	Volume        *string         `json:"volume"`
	Price         *int            `json:"price"`
	CoverImageURL *string         `json:"coverImageUrl"`
}

// ParseDcndlRecord は1件の <rdf:RDF> レコードをパースする。dcndl:BibResource
// がない、またはNDLBibID識別子がないレコードの場合は (nil, nil) を返す
// — 元のNext.js実装が黙ってスキップしていたのと同じレコード。
func ParseDcndlRecord(rdfXML string) (*ParsedRecord, error) {
	var root rdfRoot
	if err := xml.Unmarshal([]byte(rdfXML), &root); err != nil {
		return nil, err
	}
	if root.BibResource == nil {
		return nil, nil
	}
	bib := root.BibResource

	var ndlBibID, isbnRaw string
	for _, ident := range bib.Identifiers {
		value := strings.TrimSpace(ident.Value)
		switch {
		case strings.HasSuffix(ident.Datatype, "/NDLBibID"):
			ndlBibID = value
		case strings.HasSuffix(ident.Datatype, "/ISBN"):
			isbnRaw = value
		}
	}
	if ndlBibID == "" {
		return nil, nil
	}

	fullTitle := ""
	if bib.DCTitle != nil && bib.DCTitle.Description != nil {
		fullTitle = bib.DCTitle.Description.Value
	} else if bib.DCTermsTitle != "" {
		fullTitle = bib.DCTermsTitle
	}
	title, subtitle := splitOnSeparator(fullTitle, " : ")
	if title == "" {
		title = fullTitle
	}

	var seriesName *string
	var volumeFromSeries *string
	if bib.SeriesTitle != nil && bib.SeriesTitle.Description != nil {
		seriesName, volumeFromSeries = splitOnSeparatorPtr(bib.SeriesTitle.Description.Value, " ; ")
	}

	volume := volumeFromSeries
	if bib.Volume != nil && bib.Volume.Description != nil && bib.Volume.Description.Value != "" {
		v := bib.Volume.Description.Value
		volume = &v
	}

	var publisherName *string
	if bib.Publisher != nil && bib.Publisher.Agent != nil && bib.Publisher.Agent.Name != "" {
		name := bib.Publisher.Agent.Name
		publisherName = &name
	}

	dateText := bib.Date
	if dateText == "" {
		dateText = bib.Issued
	}

	return &ParsedRecord{
		NDLBibID:      ndlBibID,
		ISBN13:        normalizeIsbn13(isbnRaw),
		Title:         title,
		Subtitle:      subtitle,
		Creators:      extractCreators(bib),
		PublisherName: publisherName,
		PublishedDate: parsePublishedDate(dateText),
		SeriesName:    seriesName,
		Volume:        volume,
		Price:         parsePrice(bib.Price),
		CoverImageURL: extractCoverImageURL(root.Items),
	}, nil
}

func extractCreators(bib *bibResource) []ParsedCreator {
	if len(bib.Creators) > 0 {
		creators := make([]ParsedCreator, 0, len(bib.Creators))
		for _, c := range bib.Creators {
			if c.Agent == nil || c.Agent.Name == "" {
				continue
			}
			var role *string
			if c.Agent.Role != "" {
				r := c.Agent.Role
				role = &r
			}
			creators = append(creators, ParsedCreator{Name: c.Agent.Name, Role: role})
		}
		return creators
	}

	creators := make([]ParsedCreator, 0, len(bib.DCCreators))
	for _, name := range bib.DCCreators {
		if name == "" {
			continue
		}
		creators = append(creators, ParsedCreator{Name: name})
	}
	return creators
}

func extractCoverImageURL(items []dcndlItem) *string {
	for _, item := range items {
		if item.Thumbnail != nil && item.Thumbnail.Resource != "" {
			url := item.Thumbnail.Resource
			return &url
		}
	}
	return nil
}

func normalizeIsbn13(raw string) *string {
	digits := nonDigitRe.ReplaceAllString(raw, "")
	if len(digits) != 13 {
		return nil
	}
	return &digits
}

func splitOnSeparator(value, sep string) (string, *string) {
	if value == "" {
		return "", nil
	}
	idx := strings.Index(value, sep)
	if idx == -1 {
		return value, nil
	}
	rest := value[idx+len(sep):]
	return value[:idx], &rest
}

func splitOnSeparatorPtr(value, sep string) (*string, *string) {
	first, second := splitOnSeparator(value, sep)
	if first == "" {
		return nil, second
	}
	return &first, second
}

var (
	publishedDateRe = regexp.MustCompile(`^(\d{4})(?:[.\-](\d{1,2}))?(?:[.\-](\d{1,2}))?`)
	priceDigitsRe   = regexp.MustCompile(`\d+`)
	nonDigitRe      = regexp.MustCompile(`[^0-9]`)
)

func parsePublishedDate(text string) *time.Time {
	text = strings.TrimSpace(text)
	if text == "" {
		return nil
	}
	m := publishedDateRe.FindStringSubmatch(text)
	if m == nil {
		return nil
	}
	year, _ := strconv.Atoi(m[1])
	month := 1
	if m[2] != "" {
		month, _ = strconv.Atoi(m[2])
	}
	day := 1
	if m[3] != "" {
		day, _ = strconv.Atoi(m[3])
	}
	t := time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.UTC)
	return &t
}

func parsePrice(text string) *int {
	text = strings.TrimSpace(text)
	if text == "" {
		return nil
	}
	halfWidth := toHalfWidthDigits(text)
	digits := priceDigitsRe.FindString(halfWidth)
	if digits == "" {
		return nil
	}
	n, err := strconv.Atoi(digits)
	if err != nil {
		return nil
	}
	return &n
}

func toHalfWidthDigits(s string) string {
	var b strings.Builder
	for _, r := range s {
		if r >= '０' && r <= '９' {
			b.WriteRune(r - 0xFEE0)
		} else {
			b.WriteRune(r)
		}
	}
	return b.String()
}
