import {  Container, Header, MenuList, ProductsList } from "@/shared/components";
import { Cartblock } from "@/shared/components/cartblock";

export default function Home() {
  return (
    <>
      <Header />

      <Container className="mb-10">
        <MenuList />
        <div className="mt-10 flex  gap-5 max-sm:flex-col ">
          <Cartblock />
          <ProductsList className="self-start" />
        </div>
      </Container>
    </>
  );
}
