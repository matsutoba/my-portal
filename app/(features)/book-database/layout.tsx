import { Providers } from "./_components/Providers";

export default function BookDatabaseLayout({ children }: LayoutProps<"/book-database">) {
  return <Providers>{children}</Providers>;
}
