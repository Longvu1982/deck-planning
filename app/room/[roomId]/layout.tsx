import { Room } from "@/app/Room";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Room>{children}</Room>;
}
