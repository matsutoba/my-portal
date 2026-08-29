"use client";

import { Table, TableCell, TableHeaderCell, TableRow } from "@/components/ui";
import { getApiBaseUrl } from "../_lib/api";
import type { BookRow } from "../_lib/types";
import { NoImage } from "./NoImage";
import { useFetchBooks } from "./useFetchBooks";

type BookTableProps = {
  initialBooks: BookRow[];
  initialHasMore: boolean;
};

export function BookTable({ initialBooks, initialHasMore }: BookTableProps) {
  const { books, hasNextPage, sentinelRef } = useFetchBooks(initialBooks, initialHasMore);

  if (books.length === 0) {
    return <p className="py-12 text-center text-sm text-foreground/60">書籍がありません</p>;
  }

  return (
    <Table>
      <thead>
        <tr>
          <TableHeaderCell className="w-48 text-center">発行月</TableHeaderCell>
          <TableHeaderCell className="w-30" aria-hidden="true" />
          <TableHeaderCell>書籍タイトル / 著者</TableHeaderCell>
          <TableHeaderCell className="w-48 text-center">出版社</TableHeaderCell>
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <TableRow key={book.id}>
            <TableCell className="text-center tabular-nums text-foreground/70">
              {formatPublishedDate(book.publishedDate)}
            </TableCell>
            <TableCell className="text-center">
              {book.coverImageUrl ? (
                <a
                  href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(book.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="h-32 w-22 object-cover"
                    src={`${getApiBaseUrl()}/api/books/${book.id}/cover`}
                    alt=""
                  />
                </a>
              ) : (
                <NoImage />
              )}
            </TableCell>
            <TableCell>
              <div className="text-[15px] font-semibold leading-snug">
                {book.title}
                {book.subtitle ? ` ${book.subtitle}` : ""}
              </div>
              {book.authors.length > 0 && (
                <div className="mt-1 text-[13px] text-foreground/60">{book.authors.join(" / ")}</div>
              )}
            </TableCell>
            <TableCell className="text-center text-foreground/70">{book.publisherName ?? "-"}</TableCell>
          </TableRow>
        ))}
        {hasNextPage && (
          <tr ref={sentinelRef}>
            <TableCell className="py-5 text-center text-[13px] text-foreground/60" colSpan={4}>
              読み込み中...
            </TableCell>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

function formatPublishedDate(date: Date | null): string {
  if (!date) {
    return "-";
  }
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${date.getUTCFullYear()}/${month}`;
}
