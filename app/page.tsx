import {
  Container,
  Footer,
  Header,
  MenuList,
  ProductsList,
} from "@/shared/components";
import { Cartblock } from "@/shared/components/cartblock";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <Container className="mb-10 flex-1">
        <MenuList />
        <div className="mt-10 flex  gap-5 max-sm:flex-col ">
          <Cartblock />
          <ProductsList className="self-start" />
        </div>
      </Container>
      <Footer />
    </div>
  );
}
