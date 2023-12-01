import Container from "@/components/Container";
import FormWrap from "@/components/FormWrap";
import CheckoutClient from "./CheckoutClient";

const CheckoutPage = () => {
  return (
    <div className="">
      <Container>
        <FormWrap>
          <CheckoutClient />
        </FormWrap>
      </Container>
    </div>
  );
};

export default CheckoutPage;
