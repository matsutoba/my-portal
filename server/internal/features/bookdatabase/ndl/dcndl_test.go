package ndl

import (
	"strconv"
	"testing"
	"time"
)

// NDL Search SRU仕様（recordSchema=dcndl_v3）のDC-NDL（RDF）v3の例を参考に
// 作成。実際のレスポンスをキャプチャしたものではない — このsandbox環境から
// はndlsearch.ndl.go.jpへのネットワークアクセスがない — ため、実API側の
// 正確な形を網羅する保証ではなく、名前空間マッチングロジックの構造的な
// チェックとして扱うこと。
const sampleRecord = `<rdf:RDF
	xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:dcterms="http://purl.org/dc/terms/"
	xmlns:dcndl="http://ndl.go.jp/dcndl/terms/"
	xmlns:foaf="http://xmlns.com/foaf/0.1/">
	<dcndl:BibResource rdf:about="https://ndlsearch.ndl.go.jp/books/R100000002-I000012345">
		<dc:title>
			<rdf:Description>
				<rdf:value>実践Goプログラミング : クラウドネイティブ開発入門</rdf:value>
			</rdf:Description>
		</dc:title>
		<dcterms:title>実践Goプログラミング</dcterms:title>
		<dcterms:creator>
			<foaf:Agent>
				<foaf:name>山田太郎</foaf:name>
				<dcndl:role>著</dcndl:role>
			</foaf:Agent>
		</dcterms:creator>
		<dcterms:creator>
			<foaf:Agent>
				<foaf:name>鈴木花子</foaf:name>
				<dcndl:role>監修</dcndl:role>
			</foaf:Agent>
		</dcterms:creator>
		<dcterms:publisher>
			<foaf:Agent>
				<foaf:name>技術評論社</foaf:name>
			</foaf:Agent>
		</dcterms:publisher>
		<dcterms:issued>2026-08</dcterms:issued>
		<dcterms:identifier rdf:datatype="http://ndl.go.jp/dcndl/terms/NDLBibID">000012345</dcterms:identifier>
		<dcterms:identifier rdf:datatype="http://ndl.go.jp/dcndl/terms/ISBN">978-4-297-01234-5</dcterms:identifier>
		<dcndl:price>２４００円</dcndl:price>
		<dcndl:seriesTitle>
			<rdf:Description>
				<rdf:value>実践シリーズ ; 12</rdf:value>
			</rdf:Description>
		</dcndl:seriesTitle>
	</dcndl:BibResource>
	<dcndl:Item rdf:about="https://ndlsearch.ndl.go.jp/books/R100000002-I000012345#material">
		<foaf:thumbnail rdf:resource="https://ndlsearch.ndl.go.jp/thumbnail/9784297012345.jpg"/>
	</dcndl:Item>
</rdf:RDF>`

func TestParseDcndlRecord(t *testing.T) {
	parsed, err := ParseDcndlRecord(sampleRecord)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if parsed == nil {
		t.Fatal("expected a parsed record, got nil")
	}

	if parsed.NDLBibID != "000012345" {
		t.Errorf("NDLBibID = %q, want %q", parsed.NDLBibID, "000012345")
	}
	if parsed.ISBN13 == nil || *parsed.ISBN13 != "9784297012345" {
		t.Errorf("ISBN13 = %v, want 9784297012345", ptrString(parsed.ISBN13))
	}
	if parsed.Title != "実践Goプログラミング" {
		t.Errorf("Title = %q, want %q", parsed.Title, "実践Goプログラミング")
	}
	if parsed.Subtitle == nil || *parsed.Subtitle != "クラウドネイティブ開発入門" {
		t.Errorf("Subtitle = %v, want クラウドネイティブ開発入門", ptrString(parsed.Subtitle))
	}
	if len(parsed.Creators) != 2 {
		t.Fatalf("len(Creators) = %d, want 2", len(parsed.Creators))
	}
	if parsed.Creators[0].Name != "山田太郎" || parsed.Creators[0].Role == nil || *parsed.Creators[0].Role != "著" {
		t.Errorf("Creators[0] = %+v", parsed.Creators[0])
	}
	if parsed.Creators[1].Name != "鈴木花子" || parsed.Creators[1].Role == nil || *parsed.Creators[1].Role != "監修" {
		t.Errorf("Creators[1] = %+v", parsed.Creators[1])
	}
	if parsed.PublisherName == nil || *parsed.PublisherName != "技術評論社" {
		t.Errorf("PublisherName = %v, want 技術評論社", ptrString(parsed.PublisherName))
	}
	wantDate := time.Date(2026, time.August, 1, 0, 0, 0, 0, time.UTC)
	if parsed.PublishedDate == nil || !parsed.PublishedDate.Equal(wantDate) {
		t.Errorf("PublishedDate = %v, want %v", parsed.PublishedDate, wantDate)
	}
	if parsed.SeriesName == nil || *parsed.SeriesName != "実践シリーズ" {
		t.Errorf("SeriesName = %v, want 実践シリーズ", ptrString(parsed.SeriesName))
	}
	if parsed.Volume == nil || *parsed.Volume != "12" {
		t.Errorf("Volume = %v, want 12", ptrString(parsed.Volume))
	}
	if parsed.Price == nil || *parsed.Price != 2400 {
		t.Errorf("Price = %v, want 2400", ptrIntString(parsed.Price))
	}
	if parsed.CoverImageURL == nil || *parsed.CoverImageURL != "https://ndlsearch.ndl.go.jp/thumbnail/9784297012345.jpg" {
		t.Errorf("CoverImageURL = %v", ptrString(parsed.CoverImageURL))
	}
}

func TestParseDcndlRecord_MissingBibResourceReturnsNil(t *testing.T) {
	parsed, err := ParseDcndlRecord(`<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"></rdf:RDF>`)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if parsed != nil {
		t.Errorf("expected nil for a record with no BibResource, got %+v", parsed)
	}
}

func ptrString(s *string) string {
	if s == nil {
		return "<nil>"
	}
	return *s
}

func ptrIntString(n *int) string {
	if n == nil {
		return "<nil>"
	}
	return strconv.Itoa(*n)
}
