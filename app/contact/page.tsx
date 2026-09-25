import type { Metadata } from "next";
import { Card, CardDescription, CardHeader, CardTitle, LinkButton, PageContainer, PageHeader } from "@/components/ui";
import { contactInfo } from "../_lib/profile";

export const metadata: Metadata = {
  title: "Contact | Code Beaver",
  description: "お仕事のご相談・お問い合わせはこちらから。",
};

export default function ContactPage() {
  return (
    <PageContainer>
      <PageHeader title="Contact" description="お仕事のご相談はお気軽にご連絡ください。" />

      <Card>
        <CardHeader>
          <CardTitle>対応可能な条件</CardTitle>
        </CardHeader>
        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
          <li>契約形態: 業務委託（準委任・請負）</li>
          <li>稼働条件: フルタイム・一部稼働ともに応相談</li>
          <li>リモート対応: フルリモート対応可（実績多数）</li>
        </ul>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>連絡先</CardTitle>
          <CardDescription>下記のいずれかからご連絡ください。</CardDescription>
        </CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row">
          <LinkButton href={contactInfo.x} variant="accent" className="w-auto" target="_blank" rel="noopener noreferrer">
            Xでメッセージを送る
          </LinkButton>
        </div>
      </Card>
    </PageContainer>
  );
}
