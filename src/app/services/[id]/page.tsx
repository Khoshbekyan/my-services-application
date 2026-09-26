// 📄 ՖԱՅԼ: app/services/[id]/page.tsx
import ServicesDynamic from "@/src/components/ServicesDynamic"
import Header from "@/src/components/Header"
import Footer from "@/src/components/Footer"
interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ServiceDetailPage({ params }: PageProps) {
  // ⚡ Next.js 15-ի պահանջով անում ենք await params-ին
  const resolvedParams = await params
  const serviceId = resolvedParams.id

  // ⚡ ID-ն որպես prop ուղարկում ենք Client բաղադրիչին
  return (<>
  <Header/>
  <ServicesDynamic id={serviceId} />
  <Footer/>
</>
  )
}
